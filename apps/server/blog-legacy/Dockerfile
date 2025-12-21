# syntax=docker/dockerfile:1

FROM oven/bun:alpine AS base
WORKDIR /website
COPY . .
RUN bun install --frozen-lockfile

FROM base AS builder
RUN bun --filter "./apps/server/blog-legacy" build

FROM oven/bun:alpine AS blog-server-legacy
COPY --from=builder /website/apps/server/blog-legacy/dist /blog/dist
RUN addgroup -S bloggroup \
    && adduser -S -G bloggroup bloguser \
    && chown -R bloguser:bloggroup /blog
WORKDIR /blog
EXPOSE 4004
USER bloguser
CMD ["bun", "run", "dist/index.js"]
