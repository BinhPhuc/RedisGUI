import ConnectionScreen from "@renderer/components/ConnectionScreen"
import MainWorkspace from "@renderer/components/MainWorkspace"
import { useState } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import type { ConnectionInfo } from "../../shared/connection"

function App(): React.JSX.Element {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null)

  const handleConnected = (info: ConnectionInfo) => {
    setConnectionInfo(info)
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectionInfo(null)
  }

  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans overflow-hidden">
      <ToastContainer position="bottom-right" theme="colored" />
      {isConnected ? (
        <MainWorkspace onDisconnect={handleDisconnect} connectionInfo={connectionInfo!} />
      ) : (
        <ConnectionScreen onConnected={handleConnected} />
      )}
    </div>
  )
}

export default App
