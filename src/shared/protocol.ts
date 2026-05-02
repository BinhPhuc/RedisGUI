export interface RequestProtocol {
  type: "connect" | "disconnect" | "type"
  payload: any
}

export const formatRequest = (request: RequestProtocol) => {
  return JSON.stringify(request) + "\n"
}
