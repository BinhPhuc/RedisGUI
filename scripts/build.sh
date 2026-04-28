#!/usr/bin/env bash

# Remove old build artifacts
rm -rf build/

# Build with cmake
cmake -S . -B build -G "Unix Makefiles"

# Build the project
cmake --build build

# Create symlinks for compile_commands.json
# This allows tools like clangd to find the compilation database in the project root
if [[ -f build/compile_commands.json ]]; then
  ln -sf build/compile_commands.json .
else
  echo "Warning: compile_commands.json not found in build directory. Symlink not created."
fi
