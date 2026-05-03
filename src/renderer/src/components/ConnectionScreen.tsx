import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import type { ConnectionInfo } from "../../../shared/connection"

interface ConnectionScreenProps {
  onConnected: (info: ConnectionInfo) => void
}

const mockConnections = [
  { id: 1, name: "Localhost", host: "127.0.0.1", port: "6379" },
  { id: 2, name: "Staging Redis", host: "192.168.1.10", port: "6379" }
]

export default function ConnectionScreen({ onConnected }: ConnectionScreenProps) {
  const [selectedId, setSelectedId] = useState<number | null>(1)
  const [name, setName] = useState("Localhost")
  const [host, setHost] = useState("127.0.0.1")
  const [port, setPort] = useState("6379")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnection = async () => {
    if (isConnecting) return

    setIsConnecting(true)
    const toastId = toast.loading("Connecting...")

    const response = await window.redis.connect({ host, port })

    if (response.ok) {
      toast.update(toastId, {
        render: response.message ?? "Connected successfully",
        type: "success",
        isLoading: false,
        autoClose: 1500
      })
      onConnected({ name, host, port })
    } else {
      toast.update(toastId, {
        render: response.message ?? "Connection failed",
        type: "error",
        isLoading: false,
        autoClose: 4000
      })
    }

    setIsConnecting(false)
  }

  return (
    <Card className="flex flex-row h-full w-full overflow-hidden m-auto max-w-5xl max-h-[80vh] mt-[10vh] p-0 gap-0 rounded-lg">
      {/* Left Sidebar: Connection History */}
      <div className="w-1/3 bg-muted/50 flex flex-col">
        <CardHeader className="px-4 py-4 rounded-none">
          <CardTitle className="text-base">Connections</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {mockConnections.map((conn) => (
              <button
                key={conn.id}
                onClick={() => setSelectedId(conn.id)}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                  selectedId === conn.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="font-medium text-sm">{conn.name}</div>
                <div className="text-xs opacity-70">
                  {conn.host}:{conn.port}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4">
          <Button variant="outline" className="w-full justify-center">
            + New Connection
          </Button>
        </div>
      </div>

      <Separator orientation="vertical" className="bg-foreground/20" />

      {/* Right Column: Connection Form */}
      <div className="w-2/3 flex flex-col bg-card">
        <CardHeader className="px-6 py-6 rounded-none">
          <CardTitle className="text-lg">Connection Settings</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="conn-name" className="text-muted-foreground">
              Name
            </Label>
            <Input
              id="conn-name"
              type="text"
              className="rounded-md border border-foreground/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="conn-host" className="text-muted-foreground">
                Host
              </Label>
              <Input
                id="conn-host"
                type="text"
                className="rounded-md border border-foreground/30"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </div>
            <div className="space-y-2 w-1/3">
              <Label htmlFor="conn-port" className="text-muted-foreground">
                Port
              </Label>
              <Input
                id="conn-port"
                type="text"
                className="rounded-md border border-foreground/30"
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conn-username" className="text-muted-foreground">
              Username
            </Label>
            <Input
              id="conn-username"
              type="text"
              className="rounded-md border border-foreground/30"
              placeholder="default"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conn-password" className="text-muted-foreground">
              Password
            </Label>
            <Input
              id="conn-password"
              type="password"
              className="rounded-md border border-foreground/30"
            />
          </div>
        </CardContent>

        <CardFooter className="p-4 flex justify-end gap-3 bg-muted/20">
          <Button onClick={handleConnection} className="px-6" disabled={isConnecting}>
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
