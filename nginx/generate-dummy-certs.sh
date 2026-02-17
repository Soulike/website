#!/bin/sh
# Generate dummy certificates for nginx config validation.
# Reads certificate paths from security.conf and creates self-signed certs.

set -e

CONF="/etc/nginx/security.conf"
mkdir -p /ssl

# Extract certificate key and cert paths from config
ECC_KEY=$(grep 'ssl_certificate_key.*_ecc' "$CONF" | awk '{print $2}' | tr -d ';')
ECC_CERT=$(grep 'ssl_certificate[^_].*_ecc' "$CONF" | awk '{print $2}' | tr -d ';')
RSA_KEY=$(grep 'ssl_certificate_key' "$CONF" | grep -v '_ecc' | awk '{print $2}' | tr -d ';')
RSA_CERT=$(grep 'ssl_certificate[^_]' "$CONF" | grep -v '_ecc' | head -1 | awk '{print $2}' | tr -d ';')
DH_PARAM=$(grep 'ssl_dhparam' "$CONF" | awk '{print $2}' | tr -d ';')
TRUSTED_CERT=$(grep 'ssl_trusted_certificate' "$CONF" | awk '{print $2}' | tr -d ';')

openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
    -keyout "$ECC_KEY" -out "$ECC_CERT" \
    -days 1 -nodes -subj "/CN=test" 2>/dev/null

openssl req -x509 -newkey rsa:2048 \
    -keyout "$RSA_KEY" -out "$RSA_CERT" \
    -days 1 -nodes -subj "/CN=test" 2>/dev/null

openssl dhparam -out "$DH_PARAM" 256 2>/dev/null

# trusted_certificate can reuse the RSA cert
cp "$RSA_CERT" "$TRUSTED_CERT" 2>/dev/null || true
