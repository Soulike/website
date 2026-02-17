# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

FROM nginx:stable-alpine AS base

FROM base AS website-nginx
WORKDIR /
COPY ./nginx/configurations /etc/nginx

FROM website-nginx AS website-nginx-test
COPY ./nginx/generate-dummy-certs.sh /generate-dummy-certs.sh
RUN apk add --no-cache openssl && sh /generate-dummy-certs.sh
RUN nginx -t