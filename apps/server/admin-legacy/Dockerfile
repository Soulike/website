# syntax=docker/dockerfile:1

FROM oven/bun:alpine AS base
WORKDIR /website
COPY . .
RUN bun install --frozen-lockfile

FROM base AS builder
RUN bun --filter "./apps/server/admin-legacy" build

FROM oven/bun:alpine AS admin-server-legacy
COPY --from=builder /website/apps/server/admin-legacy/dist /admin/dist
RUN addgroup -S admingroup \
    && adduser -S -G admingroup adminuser \
    && chown -R adminuser:admingroup /admin
WORKDIR /admin
EXPOSE 4003
USER adminuser
CMD ["bun", "run", "dist/index.js"]
