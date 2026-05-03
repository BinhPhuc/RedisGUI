import { ipcMain } from "electron"
import { IPC_CHANNELS } from "../shared/channels"
import { spawn } from "child_process"
import { resolve } from "path"
import { formatRequest, RequestProtocol, ResponseProtocol } from "../shared/protocol"

const REDIS_BRIDGE_PATH = resolve(__dirname, "../../core/build/RedisGUI")
const CONNECTION_TIMEOUT_MS = 5000
const QUERY_TIMEOUT_MS = 10000

export function registerRedisIpc() {
  const cppCore = spawn(REDIS_BRIDGE_PATH)
  let pendingResolve: ((result: ResponseProtocol) => void) | null = null
  let stdoutBuffer = ""

  cppCore.on("error", (error) => {
    console.error(`Failed to spawn C++ core at ${REDIS_BRIDGE_PATH}:`, error)
  })

  cppCore.stdout.on("data", (data: Buffer) => {
    stdoutBuffer += data.toString()

    // Try to parse a complete JSON object from the buffer
    try {
      const response: ResponseProtocol = JSON.parse(stdoutBuffer)
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

  function sendRequest(request: RequestProtocol, timeoutMs?: number): Promise<ResponseProtocol> {
    if (pendingResolve) {
      return Promise.resolve({
        ok: false,
        message: "Another request is in progress",
        payload: null
      })
    }

    stdoutBuffer = ""
    cppCore.stdin.write(formatRequest(request))

    return new Promise<ResponseProtocol>((resolve) => {
      const timer = timeoutMs
        ? setTimeout(() => {
            pendingResolve = null
            stdoutBuffer = ""
            resolve({ ok: false, message: "Request timed out", payload: null })
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
      return { ok: false, message: "Host and port are required", payload: null }
    }

    return sendRequest({ type: "connect", payload: { host, port } }, CONNECTION_TIMEOUT_MS)
  })

  ipcMain.handle(IPC_CHANNELS.redisDisconnect, () => {
    return sendRequest({ type: "disconnect", payload: null })
  })

  ipcMain.handle(IPC_CHANNELS.redisQuery, (_event, query) => {
    if (!query) {
      return { ok: false, message: "Query is required", payload: null }
    }

    console.log(`Received query: ${query}`)

    return sendRequest({ type: "query", payload: { query } }, QUERY_TIMEOUT_MS)
  })
}
