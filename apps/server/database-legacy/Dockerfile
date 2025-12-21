# syntax=docker/dockerfile:1

FROM oven/bun:alpine AS base
WORKDIR /website
COPY . .
RUN bun install --frozen-lockfile

FROM base AS builder
RUN bun --filter "./apps/server/database-legacy" build

FROM oven/bun:alpine AS database-server-legacy
COPY --from=builder /website/apps/server/database-legacy/dist /database/dist
RUN addgroup -S databasegroup \
    && adduser -S -G databasegroup databaseuser \
    && chown -R databaseuser:databasegroup /database
WORKDIR /database
EXPOSE 4000
USER databaseuser
CMD ["bun", "run", "dist/index.js"]
