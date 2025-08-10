# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

FROM node:lts-alpine AS base
RUN corepack enable \
    && corepack prepare --activate pnpm@latest

FROM base AS deps
WORKDIR /website
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --prefer-offline --frozen-lockfile && \
    pnpm build:packages

# Build blog
FROM deps AS blog-builder
RUN pnpm --filter "./apps/web/blog-vite" build

# Setup blog static server
FROM nginx:stable-alpine AS blog
COPY --from=blog-builder /website/apps/web/blog-vite/dist /blog-dist
COPY --from=blog-builder /website/apps/web/blog-vite/nginx.conf /etc/nginx/conf.d/blog.conf
WORKDIR /
EXPOSE 3000

# Build admin
FROM deps AS admin-builder
RUN pnpm --filter "./apps/web/admin-vite" build

# Setup admin static server
FROM nginx:stable-alpine AS admin
COPY --from=admin-builder /website/apps/web/admin-vite/dist /admin-dist
COPY --from=admin-builder /website/apps/web/admin-vite/nginx.conf /etc/nginx/conf.d/admin.conf
WORKDIR /
EXPOSE 3000

# Build 2048
FROM deps AS game-2048-builder
RUN pnpm --filter "./apps/web/game-2048" build

# Setup 2048 static server
FROM nginx:stable-alpine AS game-2048
COPY --from=game-2048-builder /website/apps/web/game-2048/dist /game-2048-dist
COPY --from=game-2048-builder /website/apps/web/game-2048/nginx.conf /etc/nginx/conf.d/game-2048.conf
WORKDIR /
EXPOSE 3000

# Build auth server
FROM deps AS auth-server-builder
RUN pnpm --filter "./apps/server/auth" build && \
    pnpm --filter "./apps/server/auth" deploy --prod /auth

FROM node:lts-alpine AS auth-server
COPY --from=auth-server-builder /auth/node_modules /auth/node_modules
COPY --from=auth-server-builder /auth/dist /auth/dist
WORKDIR /auth/dist
EXPOSE 4001
CMD [ "node", "index.js" ]
