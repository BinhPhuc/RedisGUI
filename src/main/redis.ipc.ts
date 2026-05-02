import { ipcMain } from "electron"
import { IPC_CHANNELS } from "../shared/channels"
import { spawn } from "child_process"
import { resolve } from "path"
import { ConnectionResult } from "../shared/connection"
import { formatRequest, RequestProtocol } from "../shared/protocol"

const REDIS_BRIDGE_PATH = resolve(__dirname, "../../core/build/RedisGUI")

export function registerRedisIpc() {
  const cppCore = spawn(REDIS_BRIDGE_PATH)

  cppCore.on("error", (error) => {
    console.error(`Failed to spawn C++ core at ${REDIS_BRIDGE_PATH}:`, error)
  })

  ipcMain.handle(IPC_CHANNELS.redisConnect, (_event, { host, port }) => {
    const isValid = host && port

    if (!isValid) {
      return { ok: false, message: "Host and port are required" }
    }

    const connectionRequest: RequestProtocol = {
      type: "connect",
      payload: { host, port },
    }

    cppCore.stdin.write(formatRequest(connectionRequest))

    return new Promise<ConnectionResult>((resolve) => {
      const onData = (data: Buffer) => {
        const response: ConnectionResult = JSON.parse(data.toString())
        resolve(response)
        cppCore.stdout.off("data", onData)
      }
      cppCore.stdout.on("data", onData)
    })
  })

  cppCore.stderr.on("data", (data) => {
    console.error(`${data.toString()}`)
  })
}
