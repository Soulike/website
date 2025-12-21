# syntax=docker/dockerfile:1

FROM oven/bun:alpine AS base
WORKDIR /website
COPY . .
RUN bun install --frozen-lockfile

FROM base AS builder
RUN bun --filter "./apps/web/blog-vite" build

FROM nginx:stable-alpine AS blog
COPY --from=builder /website/apps/web/blog-vite/dist /blog-dist
COPY --from=builder /website/apps/web/blog-vite/nginx.conf /etc/nginx/conf.d/blog.conf
WORKDIR /
EXPOSE 3000
