# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
WORKDIR /website
COPY . .
RUN npm install --global --ignore-scripts pnpm@latest \
    && HUSKY=0 pnpm install --frozen-lockfile

FROM base AS builder
RUN pnpm --filter "./apps/web/game-2048" build

FROM nginx:stable-alpine AS game-2048
COPY --from=builder /website/apps/web/game-2048/dist /game-2048-dist
COPY --from=builder /website/apps/web/game-2048/nginx.conf /etc/nginx/conf.d/game-2048.conf
WORKDIR /
EXPOSE 3000
