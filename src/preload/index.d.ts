import { ElectronAPI } from "@electron-toolkit/preload"
import type { AppInfo } from "../shared/ipc"

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    title: {
      setTitle: (title: string) => void
    }
    getInfo: {
      getInfo: () => Promise<AppInfo>
    }
  }
}
