import { ConnectionPayload } from "./connection"
import { ResponseProtocol } from "./protocol"

export interface RedisAPI {
  connect: (connection: ConnectionPayload) => Promise<ResponseProtocol>
  disconnect: () => Promise<ResponseProtocol>
  query: (query: string) => Promise<ResponseProtocol>
}
