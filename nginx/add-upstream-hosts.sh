#!/bin/sh
# Add proxy_pass upstream hostnames to /etc/hosts for nginx -t validation.
# In CI, Docker network hostnames (e.g., admin, blog) don't exist.
# This script extracts them from config and maps to 127.0.0.1.

set -eu

grep -rh 'proxy_pass' /etc/nginx/conf.d/ \
    | awk -F'[/:]' '{print "127.0.0.1 " $4}' \
    | sort -u >> /etc/hosts
