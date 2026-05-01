import { ElectronAPI } from "@electron-toolkit/preload"
import { RedisAPI } from "../shared/connection"

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    redis: RedisAPI
  }
}
