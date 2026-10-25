# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
WORKDIR /website
COPY . .
RUN npm install --global --ignore-scripts pnpm@latest \
    && HUSKY=0 pnpm install --frozen-lockfile

FROM base AS builder
RUN pnpm --filter "./apps/server/blog-legacy" build

FROM node:lts-alpine AS blog-server-legacy
COPY --from=builder /website/apps/server/blog-legacy/dist /blog/dist
RUN addgroup -S bloggroup \
    && adduser -S -G bloggroup bloguser \
    && chown -R bloguser:bloggroup /blog
WORKDIR /blog
EXPOSE 4004
USER bloguser
CMD ["node", "dist/index.mjs"]
