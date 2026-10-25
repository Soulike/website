# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
WORKDIR /website
COPY . .
RUN npm install --global --ignore-scripts pnpm@latest \
    && HUSKY=0 pnpm install --frozen-lockfile

FROM base AS builder
RUN pnpm --filter "./apps/server/database-legacy" build

FROM node:lts-alpine AS database-server-legacy
COPY --from=builder /website/apps/server/database-legacy/dist /database/dist
RUN addgroup -S databasegroup \
    && adduser -S -G databasegroup databaseuser \
    && chown -R databaseuser:databasegroup /database
WORKDIR /database
EXPOSE 4000
USER databaseuser
CMD ["node", "dist/index.mjs"]
