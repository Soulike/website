# syntax=docker/dockerfile:1

FROM oven/bun:alpine AS base
WORKDIR /website
COPY . .
RUN bun install --frozen-lockfile

FROM base AS builder
RUN bun --filter "./apps/web/admin-vite" build

FROM nginx:stable-alpine AS admin
COPY --from=builder /website/apps/web/admin-vite/dist /admin-dist
COPY --from=builder /website/apps/web/admin-vite/nginx.conf /etc/nginx/conf.d/admin.conf
WORKDIR /
EXPOSE 3000
