import { ipcMain } from "electron"
import { IPC_CHANNELS } from "../shared/channels"
import { spawn } from "child_process"
import { resolve } from "path"
import { ConnectionResult } from "../shared/connection"
import { formatRequest, RequestProtocol } from "../shared/protocol"

const REDIS_BRIDGE_PATH = resolve(__dirname, "../../core/build/RedisGUI")
const CONNECTION_TIMEOUT_MS = 5000

export function registerRedisIpc() {
  const cppCore = spawn(REDIS_BRIDGE_PATH)
  let pendingResolve: ((result: ConnectionResult) => void) | null = null
  let stdoutBuffer = ""

  cppCore.on("error", (error) => {
    console.error(`Failed to spawn C++ core at ${REDIS_BRIDGE_PATH}:`, error)
  })

  cppCore.stdout.on("data", (data: Buffer) => {
    stdoutBuffer += data.toString()

    // Try to parse a complete JSON object from the buffer
    try {
      const response: ConnectionResult = JSON.parse(stdoutBuffer)
      stdoutBuffer = ""
      if (pendingResolve) {
        pendingResolve(response)
        pendingResolve = null
      }
    } catch {
      // Incomplete JSON, keep buffering
    }
  })

  cppCore.stderr.on("data", (data: Buffer) => {
    console.error(`${data.toString()}`)
  })

  function sendRequest(request: RequestProtocol, timeoutMs?: number): Promise<ConnectionResult> {
    if (pendingResolve) {
      return Promise.resolve({ ok: false, message: "Another request is in progress" })
    }

    stdoutBuffer = ""
    cppCore.stdin.write(formatRequest(request))

    return new Promise<ConnectionResult>((resolve) => {
      const timer = timeoutMs
        ? setTimeout(() => {
            pendingResolve = null
            stdoutBuffer = ""
            resolve({ ok: false, message: "Request timed out" })
          }, timeoutMs)
        : undefined

      pendingResolve = (result) => {
        if (timer) clearTimeout(timer)
        resolve(result)
      }
    })
  }

  ipcMain.handle(IPC_CHANNELS.redisConnect, (_event, { host, port }) => {
    if (!host || !port) {
      return { ok: false, message: "Host and port are required" }
    }

    return sendRequest({ type: "connect", payload: { host, port } }, CONNECTION_TIMEOUT_MS)
  })

  ipcMain.handle(IPC_CHANNELS.redisDisconnect, () => {
    return sendRequest({ type: "disconnect", payload: null })
  })
}
