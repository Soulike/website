# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

FROM oven/bun:alpine AS base

FROM base AS deps
WORKDIR /website
COPY . .
RUN bun install --frozen-lockfile

# Build blog
FROM deps AS blog-builder
RUN bun --filter "./apps/web/blog-vite" build

# Setup blog static server
FROM nginx:stable-alpine AS blog
COPY --from=blog-builder /website/apps/web/blog-vite/dist /blog-dist
COPY --from=blog-builder /website/apps/web/blog-vite/nginx.conf /etc/nginx/conf.d/blog.conf
WORKDIR /
EXPOSE 3000

# Build admin
FROM deps AS admin-builder
RUN bun --filter "./apps/web/admin-vite" build

# Setup admin static server
FROM nginx:stable-alpine AS admin
COPY --from=admin-builder /website/apps/web/admin-vite/dist /admin-dist
COPY --from=admin-builder /website/apps/web/admin-vite/nginx.conf /etc/nginx/conf.d/admin.conf
WORKDIR /
EXPOSE 3000

# Build 2048
FROM deps AS game-2048-builder
RUN bun --filter "./apps/web/game-2048" build

# Setup 2048 static server
FROM nginx:stable-alpine AS game-2048
COPY --from=game-2048-builder /website/apps/web/game-2048/dist /game-2048-dist
COPY --from=game-2048-builder /website/apps/web/game-2048/nginx.conf /etc/nginx/conf.d/game-2048.conf
WORKDIR /
EXPOSE 3000

# Build auth server
FROM deps AS auth-server-builder
RUN bun --filter "./apps/server/auth" build

FROM alpine:latest AS auth-server
COPY --from=auth-server-builder /website/apps/server/auth/dist/auth-server /auth/auth-server
RUN chmod +x /auth/auth-server \
    && addgroup -S authgroup \
    && adduser -S authuser -G authgroup \
    && chown -R authuser:authgroup /auth
WORKDIR /auth
EXPOSE 4001
USER authuser
CMD ["/auth/auth-server"]

# Build database-legacy server
FROM deps AS database-server-builder
RUN bun --filter "./apps/server/database-legacy" build

FROM alpine:latest AS database
COPY --from=database-server-builder /website/apps/server/database-legacy/dist/database-legacy-server /database/database-server
RUN chmod +x /database/database-server \
    && addgroup -S databasegroup \
    && adduser -S databaseuser -G databasegroup \
    && chown -R databaseuser:databasegroup /database
WORKDIR /database
EXPOSE 4000
USER databaseuser
CMD ["/database/database-server"]
