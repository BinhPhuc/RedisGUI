import { ipcMain } from "electron"
import { IPC_CHANNELS } from "../shared/channels"
import { spawn } from "child_process"
import { resolve } from "path"

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
    const payload = JSON.stringify({ host, port }) + "\n"
    cppCore.stdin.write(payload)
    return { ok: false }
  })

  cppCore.stdout.on("data", (data) => {
    console.log(`${data.toString()}`)
  })

  cppCore.stderr.on("data", (data) => {
    console.error(`${data.toString()}`)
  })
}
