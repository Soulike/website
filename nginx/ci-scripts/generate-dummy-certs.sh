#!/bin/sh
# Generate dummy certificates for nginx config validation.
# Creates self-signed certs at paths referenced in security.conf.

set -eu

CONF="/etc/nginx/security.conf"
mkdir -p /ssl

# Extract all unique file paths under /ssl from the config
PATHS=$(awk '{for(i=1;i<=NF;i++) if($i ~ /^\/ssl\//) {gsub(/;$/,"",$i); print $i}}' "$CONF" | sort -u)

# Generate a single self-signed cert and key
openssl req -x509 -newkey rsa:2048 \
    -keyout /ssl/_dummy.key -out /ssl/_dummy.crt \
    -days 1 -nodes -subj "/CN=test"

# Generate DH parameters (-dsaparam for fast generation in CI)
openssl dhparam -dsaparam -out /ssl/_dummy.dhparam 2048

# Create copies for each referenced path
for P in $PATHS; do
    case "$P" in
        *dhparam*) cp /ssl/_dummy.dhparam "$P" ;;
        *.key)     cp /ssl/_dummy.key "$P" ;;
        *)         cp /ssl/_dummy.crt "$P" ;;
    esac
done
