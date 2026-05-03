export interface RequestProtocol {
  type: "connect" | "disconnect" | "query"
  payload: any
}

export interface ResponseProtocol {
  ok: boolean
  message: string
  payload: any
}

export const formatRequest = (request: RequestProtocol) => {
  return JSON.stringify(request) + "\n"
}
