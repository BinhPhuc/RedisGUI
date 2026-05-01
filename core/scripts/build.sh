#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$CORE_DIR/build"
PRESET="${CMAKE_PRESET:-default}"
clean_build=0

for arg in "$@"; do
  case "$arg" in
    --clean)
      clean_build=1
      ;;
    *)
      PRESET="$arg"
      ;;
  esac
done

if [[ $clean_build -eq 1 ]]; then
  rm -rf "$BUILD_DIR"
fi

cmake --preset="$PRESET" -S "$CORE_DIR" -B "$BUILD_DIR"
cmake --build "$BUILD_DIR" --parallel

# Create symlinks for compile_commands.json
# This allows tools like clangd to find the compilation database in the project root
if [[ -f "$BUILD_DIR/compile_commands.json" ]]; then
  ln -sfn "$BUILD_DIR/compile_commands.json" "$CORE_DIR/compile_commands.json"
else
  echo "Warning: compile_commands.json not found in $BUILD_DIR. Symlink not created." >&2
fi
