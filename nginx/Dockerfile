# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

FROM nginx:stable-alpine AS base

FROM base AS website-nginx
WORKDIR /
COPY ./nginx/configurations /etc/nginx

FROM website-nginx AS website-nginx-test
RUN DOMAIN="soulike" && DOMAIN="${DOMAIN}.tech" \
    && apk add --no-cache openssl \
    && mkdir -p /ssl \
    && openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
       -keyout /ssl/${DOMAIN}_ecc.key -out /ssl/fullchain_ecc.cer \
       -days 1 -nodes -subj "/CN=test" \
    && openssl req -x509 -newkey rsa:2048 \
       -keyout /ssl/${DOMAIN}.key -out /ssl/fullchain.cer \
       -days 1 -nodes -subj "/CN=test" \
    && openssl dhparam -out /ssl/dhparam.pem 256
RUN nginx -t