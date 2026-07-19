#!/usr/bin/env bash
set -euo pipefail

judge0_host="${CODEDUO_JUDGE0_HOST:-}"
judge0_key="${CODEDUO_JUDGE0_KEY:-}"

if [[ -z "$judge0_host" || -z "$judge0_key" ]]; then
  echo "Set CODEDUO_JUDGE0_HOST and CODEDUO_JUDGE0_KEY in your shell." >&2
  echo "Do not commit the EC2 address or private-key path." >&2
  exit 1
fi

if [[ ! -f "$judge0_key" ]]; then
  echo "Judge0 EC2 key not found: $judge0_key" >&2
  exit 1
fi

exec ssh \
  -N \
  -L 127.0.0.1:2358:127.0.0.1:2358 \
  -i "$judge0_key" \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -o ServerAliveCountMax=3 \
  -o StrictHostKeyChecking=yes \
  "ubuntu@$judge0_host"
