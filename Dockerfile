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
RUN pnpm --filter "./apps/blog" build && \
    pnpm --filter "./apps/blog" deploy --prod /blog

FROM base AS blog
COPY --from=blog-builder /blog /blog
WORKDIR /blog
EXPOSE 3000
CMD pnpm start

# Build admin
FROM deps AS admin-builder
RUN pnpm --filter "./apps/admin" build && \
    pnpm --filter "./apps/admin" deploy --prod /admin

FROM base AS admin
COPY --from=admin-builder /admin /admin
WORKDIR /admin
EXPOSE 3000
CMD pnpm start
