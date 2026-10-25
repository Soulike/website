# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
WORKDIR /website
COPY . .
RUN npm install --global --ignore-scripts pnpm@latest \
    && HUSKY=0 pnpm install --frozen-lockfile

FROM base AS builder
RUN pnpm --filter "./apps/server/admin-legacy" build

FROM node:lts-alpine AS admin-server-legacy
COPY --from=builder /website/apps/server/admin-legacy/dist /admin/dist
RUN addgroup -S admingroup \
    && adduser -S -G admingroup adminuser \
    && chown -R adminuser:admingroup /admin
WORKDIR /admin
EXPOSE 4003
USER adminuser
CMD ["node", "dist/index.mjs"]
