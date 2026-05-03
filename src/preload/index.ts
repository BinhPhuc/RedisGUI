import { contextBridge, ipcRenderer } from "electron"
import { electronAPI } from "@electron-toolkit/preload"
import { IPC_CHANNELS } from "../shared/channels"
import { RedisAPI } from "../shared/api"

// Custom APIs for renderer
const api = {}
const redisAPI: RedisAPI = {
  connect: (connection) => ipcRenderer.invoke(IPC_CHANNELS.redisConnect, connection),
  disconnect: () => ipcRenderer.invoke(IPC_CHANNELS.redisDisconnect),
  query: (query) => ipcRenderer.invoke(IPC_CHANNELS.redisQuery, query)
}

function exposeApi(name: string, value: unknown): void {
  try {
    contextBridge.exposeInMainWorld(name, value)
  } catch (error) {
    console.error(`[preload] failed to expose ${name}`, error)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  exposeApi("electron", electronAPI)
  exposeApi("api", api)
  exposeApi("redis", redisAPI)
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.redis = redisAPI
  // @ts-ignore (define in dts)
  window.title = {
    setTitle: (title: string) => ipcRenderer.send("set-title", title)
  }
  // @ts-ignore (define in dts)
  window.getInfo = {
    getInfo: () => ipcRenderer.invoke("get-info")
  }
}
