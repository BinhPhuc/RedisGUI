import { useState } from "react"
import { Button } from "./ui/button"

interface ConnectionScreenProps {
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
}

const mockConnections = [
  { id: 1, name: "Localhost", host: "127.0.0.1", port: "6379" },
  { id: 2, name: "Staging Redis", host: "192.168.1.10", port: "6379" }
]

export default function ConnectionScreen({ setIsConnected }: ConnectionScreenProps) {
  const [selectedId, setSelectedId] = useState<number | null>(1)
  const [host, setHost] = useState("127.0.0.1")
  const [port, setPort] = useState("6379")

  const handleConnection = async () => {
    console.log("Attempting to connect to Redis at", host, ":", port)
    const response = await window.redis.connect({
      host,
      port
    })
    if (response.ok) {
      setIsConnected(true)
    }
  }

  return (
    <div className="flex h-full w-full bg-background border border-border rounded-lg shadow-xl overflow-hidden m-auto max-w-5xl max-h-[80vh] mt-[10vh]">
      {/* Left Sidebar: Connection History */}
      <div className="w-1/3 bg-muted/50 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border font-semibold text-foreground">Connections</div>
        <div className="flex-1 overflow-y-auto p-2">
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
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-center">
            + New Connection
          </Button>
        </div>
      </div>

      {/* Right Column: Connection Form */}
      <div className="w-2/3 flex flex-col bg-card">
        <div className="p-6 border-b border-border text-lg font-semibold text-foreground">
          Connection Settings
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <input
              type="text"
              className="w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              defaultValue="Localhost"
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-muted-foreground">Host</label>
              <input
                type="text"
                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </div>
            <div className="space-y-2 w-1/3">
              <label className="text-sm font-medium text-muted-foreground">Port</label>
              <input
                type="text"
                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <input
              type="text"
              className="w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="default"
            />
          </div>

          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              className="w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/20">
          <Button variant="outline" className="px-6">
            Test
          </Button>
          <Button onClick={handleConnection} className="px-6">
            Connect
          </Button>
        </div>
      </div>
    </div>
  )
}
