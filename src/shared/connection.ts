export interface ConnectionPayload {
  host: string
  port: string
  // password?: string
}

export interface ConnectionResult {
  ok: boolean
  message?: string
}

export interface RedisAPI {
  connect: (connection: ConnectionPayload) => Promise<ConnectionResult>
}
