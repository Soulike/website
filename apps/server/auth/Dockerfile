# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
WORKDIR /website
COPY . .
RUN npm install --global --ignore-scripts pnpm@latest \
    && HUSKY=0 pnpm install --frozen-lockfile

FROM base AS builder
RUN pnpm --filter "./apps/server/auth" build

FROM node:lts-alpine AS auth-server
COPY --from=builder /website/apps/server/auth/dist /auth/dist
RUN addgroup -S authgroup \
    && adduser -S -G authgroup authuser \
    && chown -R authuser:authgroup /auth
WORKDIR /auth
EXPOSE 3000
USER authuser
CMD ["node", "dist/index.mjs"]
