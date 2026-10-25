#!/usr/bin/env bash

set -euo pipefail

profile=${1:?Smoke profile is required.}
image=${2:?Image tag is required.}

if [[ "$profile" == 'none' ]]; then
  exit 0
fi

if [[ "$profile" != 'postgres-redis-server' ]]; then
  echo "Unknown smoke profile: $profile" >&2
  exit 1
fi

suffix="${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}-${RANDOM}"
network="website-smoke-$suffix"
postgres="website-smoke-postgres-$suffix"
redis="website-smoke-redis-$suffix"
application="website-smoke-app-$suffix"
secret_directory=$(mktemp -d)
response_file="$secret_directory/response.json"
database_password='smoke-database-password'
redis_password='smoke-redis-password'

print_diagnostics() {
  for container in "$application" "$postgres" "$redis"; do
    if docker inspect "$container" >/dev/null 2>&1; then
      echo "::group::$container logs"
      docker logs "$container" 2>&1 || true
      echo '::endgroup::'
      echo "::group::$container inspect"
      docker inspect "$container" 2>&1 || true
      echo '::endgroup::'
    fi
  done
}

cleanup() {
  status=$?
  set +e

  if [[ $status -ne 0 ]]; then
    print_diagnostics
  fi

  docker rm --force --volumes "$application" "$postgres" "$redis" >/dev/null 2>&1
  docker network rm "$network" >/dev/null 2>&1
  rm -rf "$secret_directory"

  trap - EXIT
  exit "$status"
}

wait_for() {
  description=$1
  shift

  for _ in $(seq 1 60); do
    if "$@" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done

  echo "Timed out waiting for $description." >&2
  return 1
}

wait_for_http() {
  description=$1
  expected_status=$2
  url=$3
  shift 3
  last_status='unreachable'

  for _ in $(seq 1 60); do
    if [[ $(docker inspect --format '{{.State.Running}}' "$application") != 'true' ]]; then
      echo "$description exited before becoming ready." >&2
      return 1
    fi

    if last_status=$(curl --silent --show-error \
      --output "$response_file" \
      --write-out '%{http_code}' \
      "$@" \
      "$url" 2>/dev/null) && [[ "$last_status" == "$expected_status" ]]; then
      return 0
    fi
    sleep 1
  done

  echo "Timed out waiting for $description; last HTTP status: $last_status." >&2
  if [[ -s "$response_file" ]]; then
    cat "$response_file" >&2
  fi
  return 1
}

trap cleanup EXIT

printf '%s' "$database_password" >"$secret_directory/database-password"
printf '%s' "$redis_password" >"$secret_directory/redis-password"

docker image inspect "$image" >/dev/null
docker network create "$network" >/dev/null

docker run --detach \
  --name "$postgres" \
  --network "$network" \
  --network-alias db \
  --env POSTGRES_USER=soulike \
  --env POSTGRES_DB=website \
  --env POSTGRES_PASSWORD="$database_password" \
  postgres:16-alpine >/dev/null

wait_for 'Postgres readiness' \
  docker exec "$postgres" pg_isready --username soulike --dbname website

docker run --detach \
  --name "$redis" \
  --network "$network" \
  --network-alias redis \
  redis:alpine \
  redis-server --requirepass "$redis_password" >/dev/null

wait_for 'Redis readiness' \
  docker exec "$redis" redis-cli --no-auth-warning --pass "$redis_password" ping

docker exec "$redis" redis-cli --no-auth-warning --pass "$redis_password" \
  set smoke-session '{"username":"smoke"}' >/dev/null

docker run --detach \
  --name "$application" \
  --network "$network" \
  --publish 127.0.0.1::3000 \
  --env DB_PASSWORD_FILE=/run/secrets/database-password \
  --env REDIS_PASSWORD_FILE=/run/secrets/redis-password \
  --volume "$secret_directory/database-password:/run/secrets/database-password:ro" \
  --volume "$secret_directory/redis-password:/run/secrets/redis-password:ro" \
  "$image" >/dev/null

if [[ $(docker inspect --format '{{.State.Running}}' "$application") != 'true' ]]; then
  echo 'Auth server exited before becoming ready.' >&2
  exit 1
fi

host_port=$(docker port "$application" 3000/tcp 2>/dev/null | head -n 1 | sed 's/.*://' || true)
if [[ -z "$host_port" ]]; then
  echo 'Auth server did not publish port 3000.' >&2
  exit 1
fi

wait_for_http 'auth server HTTP readiness' 200 \
  "http://127.0.0.1:$host_port/session" \
  --cookie 'sess=smoke-session'

if ! jq --exit-status '.username == "smoke"' "$response_file" >/dev/null; then
  echo 'Auth server returned an unexpected session response:' >&2
  cat "$response_file" >&2
  exit 1
fi

echo "Smoke passed for $image ($profile)."
