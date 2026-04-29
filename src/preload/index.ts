import { contextBridge, ipcRenderer } from "electron"
import { electronAPI } from "@electron-toolkit/preload"

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("api", api)
    contextBridge.exposeInMainWorld("title", {
      setTitle: (title: string) => ipcRenderer.send("set-title", title)
    })
    contextBridge.exposeInMainWorld("getInfo", {
      getInfo: () => ipcRenderer.invoke("get-info")
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.title = {
    setTitle: (title: string) => ipcRenderer.send("set-title", title)
  }
  // @ts-ignore (define in dts)
  window.getInfo = {
    getInfo: () => ipcRenderer.invoke("get-info")
  }
}
