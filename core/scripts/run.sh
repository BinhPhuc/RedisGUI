#!/usr/bin/env bash

set -euo pipefail

PROJECT_NAME=RedisGUI
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
EXECUTABLE="$CORE_DIR/build/$PROJECT_NAME"

if [[ ! -x "$EXECUTABLE" ]]; then
  "$SCRIPT_DIR/build.sh"
fi

exec "$EXECUTABLE" "$@"
