#!/usr/bin/env bash

PROJECT_NAME=RedisGUI

if [[ -d build ]]; then
  ./build/$PROJECT_NAME
else
  echo "Error: Build directory not found. Please run the build script first."
  exit 1
fi
