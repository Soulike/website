# NGINX

The folder contains configuration and build files for NGINX docker image.

## Volumes

1. **/ssl**: Should contain SSL certificates.

## Logging

Logs are sent to stdout/stderr and managed by Docker's logging driver. Configure
log rotation via the `logging` option in `compose.yaml`.
