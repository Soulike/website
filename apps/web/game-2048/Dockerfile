# syntax=docker/dockerfile:1

FROM oven/bun:alpine AS base
WORKDIR /website
COPY . .
RUN bun install --frozen-lockfile

FROM base AS builder
RUN bun --filter "./apps/web/game-2048" build

FROM nginx:stable-alpine AS game-2048
COPY --from=builder /website/apps/web/game-2048/dist /game-2048-dist
COPY --from=builder /website/apps/web/game-2048/nginx.conf /etc/nginx/conf.d/game-2048.conf
WORKDIR /
EXPOSE 3000
