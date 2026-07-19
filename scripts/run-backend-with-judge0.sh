#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "$script_dir/.." && pwd)"

export JUDGE0_BASE_URL="${JUDGE0_BASE_URL:-http://127.0.0.1:2358}"
export JUDGE0_MOCK=false
export GRADING_SECRETS_PATH="${GRADING_SECRETS_PATH:-$project_root/config/grading-secrets.json}"
export GRADING_REQUIRE_SECRETS=true

if [[ -z "${JWT_SECRET:-}" ]]; then
  echo "JWT_SECRET is required. Generate a random value of at least 32 bytes." >&2
  exit 1
fi

if [[ ! -f "$GRADING_SECRETS_PATH" ]]; then
  echo "Private grading file not found: $GRADING_SECRETS_PATH" >&2
  exit 1
fi

if [[ -z "${JAVA_HOME:-}" ]]; then
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
fi

if ! curl --fail --silent --show-error --max-time 3 "$JUDGE0_BASE_URL/version" >/dev/null; then
  echo "Judge0 is not reachable at $JUDGE0_BASE_URL." >&2
  echo "Start ./scripts/judge0-tunnel.sh in another terminal first." >&2
  exit 1
fi

exec "$project_root/gradlew" :backend:bootRun
