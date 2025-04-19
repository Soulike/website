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
RUN pnpm --filter "./apps/blog-vite" build && \
    pnpm --filter "./apps/blog-vite" deploy --prod /blog

FROM base AS blog
COPY --from=blog-builder /blog /blog
WORKDIR /blog
EXPOSE 3000
CMD pnpm start

# Build admin
FROM deps AS admin-builder
RUN pnpm --filter "./apps/admin-vite" build

# Setup admin static server
FROM nginx:stable-alpine AS admin
COPY --from=admin-builder /website/apps/admin-vite/dist /admin-dist
COPY --from=admin-builder /website/apps/admin-vite/nginx.conf /etc/nginx/conf.d/admin.conf
WORKDIR /
EXPOSE 3000
