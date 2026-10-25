#!/usr/bin/env bash

set -euo pipefail

profile=${1:?Smoke profile is required.}
image=${2:?Image tag is required.}
suffix="${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}-${RANDOM}"
network="website-smoke-$suffix"
postgres="website-smoke-postgres-$suffix"
redis="website-smoke-redis-$suffix"
application="website-smoke-app-$suffix"
secret_directory=''
response_file=''
database_schema="$PWD/apps/server/database-legacy/src/Database/database.sql"
database_password='smoke-database-password'
redis_password='smoke-redis-password'
host_port=''

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
  local status=$?
  set +e

  if [[ $status -ne 0 ]]; then
    print_diagnostics
  fi

  docker rm --force --volumes "$application" "$postgres" "$redis" >/dev/null 2>&1
  docker network rm "$network" >/dev/null 2>&1
  if [[ -n "$secret_directory" ]]; then
    rm -rf "$secret_directory"
  fi

  trap - EXIT
  exit "$status"
}

wait_for() {
  local description=$1
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
  local description=$1
  local expected_status=$2
  local url=$3
  shift 3
  local last_status='unreachable'

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

postgres_initialization_complete() {
  docker logs "$postgres" 2>&1 | grep -q 'PostgreSQL init process complete'
}

initialize_smoke() {
  secret_directory=$(mktemp -d)
  response_file="$secret_directory/response.json"
  trap cleanup EXIT

  docker image inspect "$image" >/dev/null
  docker network create "$network" >/dev/null
}

write_database_secret() {
  printf '%s' "$database_password" >"$secret_directory/database-password"
}

write_redis_secret() {
  printf '%s' "$redis_password" >"$secret_directory/redis-password"
}

start_postgres() {
  local schema=${1:-}
  local -a postgres_arguments=(
    docker run --detach
    --name "$postgres"
    --network "$network"
    --network-alias db
    --env POSTGRES_USER=soulike
    --env POSTGRES_DB=website
    --env POSTGRES_PASSWORD="$database_password"
  )

  if [[ -n "$schema" ]]; then
    test -f "$schema"
    postgres_arguments+=(
      --volume "$schema:/docker-entrypoint-initdb.d/database.sql:ro"
    )
  fi

  postgres_arguments+=(postgres:16-alpine)
  "${postgres_arguments[@]}" >/dev/null

  wait_for 'Postgres initialization' postgres_initialization_complete
  wait_for 'Postgres readiness' \
    docker exec "$postgres" pg_isready --username soulike --dbname website

  if [[ -n "$schema" ]]; then
    wait_for 'database schema readiness' \
      docker exec "$postgres" psql --username soulike --dbname website \
      --tuples-only --command 'SELECT count(*) FROM "categories";'
  fi
}

start_redis() {
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
}

start_application() {
  local description=$1
  local application_port=$2
  shift 2
  local -a application_arguments=(
    docker run --detach
    --name "$application"
    --network "$network"
    --publish "127.0.0.1::$application_port"
  )

  application_arguments+=("$@")
  application_arguments+=("$image")
  "${application_arguments[@]}" >/dev/null

  if [[ $(docker inspect --format '{{.State.Running}}' "$application") != 'true' ]]; then
    echo "$description exited before becoming ready." >&2
    exit 1
  fi

  host_port=$(docker port "$application" "$application_port/tcp" 2>/dev/null | head -n 1 | sed 's/.*://' || true)
  if [[ -z "$host_port" ]]; then
    if [[ $(docker inspect --format '{{.State.Running}}' "$application") != 'true' ]]; then
      echo "$description exited before publishing port $application_port." >&2
    else
      echo "$description did not publish port $application_port." >&2
    fi
    exit 1
  fi
}

smoke_auth_server() {
  initialize_smoke
  write_database_secret
  write_redis_secret
  start_postgres
  start_redis
  start_application 'Auth server' 3000 \
    --env DB_PASSWORD_FILE=/run/secrets/database-password \
    --volume "$secret_directory/database-password:/run/secrets/database-password:ro" \
    --env REDIS_PASSWORD_FILE=/run/secrets/redis-password \
    --volume "$secret_directory/redis-password:/run/secrets/redis-password:ro"

  wait_for_http 'Auth server HTTP readiness' 200 \
    "http://127.0.0.1:$host_port/session" \
    --cookie 'sess=smoke-session'

  if ! jq --exit-status '.username == "smoke"' "$response_file" >/dev/null; then
    echo 'Auth server returned an unexpected session response:' >&2
    cat "$response_file" >&2
    exit 1
  fi
}

smoke_database_server() {
  initialize_smoke
  write_database_secret
  start_postgres "$database_schema"
  start_application 'Database server' 4000 \
    --env DB_PASSWORD_FILE=/run/secrets/database-password \
    --volume "$secret_directory/database-password:/run/secrets/database-password:ro"

  wait_for_http 'Database server HTTP readiness' 200 \
    "http://127.0.0.1:$host_port/category/getAll" \
    --user 'Soulike:Soulike@Database'

  if ! jq --exit-status \
    '.isSuccessful == true and .data == []' "$response_file" >/dev/null; then
    echo 'Database server returned an unexpected category response:' >&2
    cat "$response_file" >&2
    exit 1
  fi
}

smoke_admin_server() {
  initialize_smoke
  write_redis_secret
  start_redis
  start_application 'Admin server' 4003 \
    --env REDIS_PASSWORD_FILE=/run/secrets/redis-password \
    --volume "$secret_directory/redis-password:/run/secrets/redis-password:ro"

  # A valid Redis session reaches the unmatched route; session rejection does not.
  wait_for_http 'Admin server HTTP readiness' 404 \
    "http://127.0.0.1:$host_port/smoke-not-found" \
    --cookie 'sess=smoke-session'
}

smoke_standalone_server() {
  initialize_smoke
  start_application 'Standalone server' 4004

  wait_for_http 'Standalone server HTTP readiness' 404 \
    "http://127.0.0.1:$host_port/smoke-not-found"
}

smoke_web_image() {
  initialize_smoke
  # Nginx resolves configured proxy upstreams while loading its configuration.
  start_application 'Web image' 3000 \
    --add-host admin-server:127.0.0.1 \
    --add-host blog-server:127.0.0.1

  wait_for_http 'Web image HTTP readiness' 200 \
    "http://127.0.0.1:$host_port/"

  if ! grep --ignore-case --extended-regexp \
    '<!doctype html|<html' "$response_file" >/dev/null; then
    echo 'Web image returned a non-HTML root response:' >&2
    cat "$response_file" >&2
    exit 1
  fi
}

case "$profile" in
  none)
    exit 0
    ;;
  postgres-redis-server)
    smoke_auth_server
    ;;
  postgres-server)
    smoke_database_server
    ;;
  redis-server)
    smoke_admin_server
    ;;
  standalone-server)
    smoke_standalone_server
    ;;
  web)
    smoke_web_image
    ;;
  *)
    echo "Unknown smoke profile: $profile" >&2
    exit 1
    ;;
esac

echo "Smoke passed for $image ($profile)."
