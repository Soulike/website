# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
WORKDIR /website
COPY . .
RUN npm install --global --ignore-scripts pnpm@latest \
    && HUSKY=0 pnpm install --frozen-lockfile

FROM base AS builder
RUN pnpm --filter "./apps/web/blog-vite" build

FROM nginx:stable-alpine AS blog
COPY --from=builder /website/apps/web/blog-vite/dist /blog-dist
COPY --from=builder /website/apps/web/blog-vite/nginx.conf /etc/nginx/conf.d/blog.conf
WORKDIR /
EXPOSE 3000
