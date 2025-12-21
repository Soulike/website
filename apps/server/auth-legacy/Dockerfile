# syntax=docker/dockerfile:1

FROM oven/bun:alpine AS base
WORKDIR /website
COPY . .
RUN bun install --frozen-lockfile

FROM base AS builder
RUN bun --filter "./apps/server/auth-legacy" build

FROM oven/bun:alpine AS auth-server-legacy
COPY --from=builder /website/apps/server/auth-legacy/dist /auth/dist
RUN addgroup -S authgroup \
    && adduser -S -G authgroup authuser \
    && chown -R authuser:authgroup /auth
WORKDIR /auth
EXPOSE 4001
USER authuser
CMD ["bun", "run", "dist/index.js"]
