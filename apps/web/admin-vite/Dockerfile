# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
WORKDIR /website
COPY . .
RUN npm install --global --ignore-scripts pnpm@latest \
    && HUSKY=0 pnpm install --frozen-lockfile

FROM base AS builder
RUN pnpm --filter "./apps/web/admin-vite" build

FROM nginx:stable-alpine AS admin
COPY --from=builder /website/apps/web/admin-vite/dist /admin-dist
COPY --from=builder /website/apps/web/admin-vite/nginx.conf /etc/nginx/conf.d/admin.conf
WORKDIR /
EXPOSE 3000
