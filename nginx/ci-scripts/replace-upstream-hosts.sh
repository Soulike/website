#!/bin/sh
# Replace proxy_pass upstream hostnames with 127.0.0.1 for nginx -t validation.
# In CI, Docker network hostnames (e.g., admin, blog) don't exist.
# This script rewrites them in-place so nginx -t can pass.

set -eu

for f in /etc/nginx/conf.d/*.conf; do
    sed -i 's|proxy_pass http://[^:/]*|proxy_pass http://127.0.0.1|g' "$f"
done
