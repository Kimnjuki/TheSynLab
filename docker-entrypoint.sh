#!/bin/sh
# Entrypoint: inject $NVIDIA_API_KEY into nginx.conf via envsubst, then launch nginx.
# NVIDIA_API_KEY is read from the live container environment (runtime env var,
# never a build arg). The envsubst whitelist ensures nginx internal vars
# like $request_uri, $uri are NOT corrupted. gettext/envsubst is in nginx:alpine.
set -e
if [ -z "$NVIDIA_API_KEY" ]; then
  echo "WARNING: NVIDIA_API_KEY not set; starting nginx without it." >&2
fi
envsubst '$NVIDIA_API_KEY' < /etc/nginx/conf.d/default.conf > /tmp/nginx-runtime.conf
mv /tmp/nginx-runtime.conf /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
