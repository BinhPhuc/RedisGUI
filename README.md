# RedisGUI

RedisGUI is an Electron desktop application that helps users write and interact with Redis queries. The desktop interface is built with Electron, React, and TypeScript, while the Redis bridge core is written in C++.

## How It Works

- The Electron app provides the desktop UI and IPC layer.
- The C++ core runs as a child process inside the Electron app.
- Electron sends query and connection requests to the C++ core.
- The C++ core communicates with Redis through a socket connection and sends responses back to the Electron side.

## Development Quick Start

### Electron App

#### Prerequisites

- Node.js and npm. Install from the official download page: [Node.js Downloads](https://nodejs.org/en/download).
- On Linux or macOS, you can also install Node.js with `nvm`: [nvm installation guide](https://github.com/nvm-sh/nvm#installing-and-updating).

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install 22
nvm use 22
```

Install JavaScript dependencies from the project root:

```bash
npm install
```

Start the Electron development server:

```bash
npm run dev
```

Note: the Electron main process expects the native executable at `core/build/RedisGUI`, so build the C++ core first if it has not been compiled yet.

### C++ Core

#### Prerequisites

- CMake 3.10 or newer. Download or install it from: [CMake Download](https://cmake.org/download/).
- A C++17-compatible compiler.

Example installation commands:

```bash
# Ubuntu / Debian
sudo apt update
sudo apt install -y build-essential cmake

# Fedora
sudo dnf install -y gcc-c++ make cmake
```

- `vcpkg` for native dependencies. Setup guide: [vcpkg Getting Started](https://learn.microsoft.com/vcpkg/get_started/get-started).

The native core uses CMake and requires a C++17-compatible compiler. The project also uses `vcpkg` for native dependencies.

Build the core from the `core` directory:

```bash
cd core
./scripts/build.sh
```

Run the compiled executable directly:

```bash
cd core
./scripts/run.sh
```

## Build

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```
