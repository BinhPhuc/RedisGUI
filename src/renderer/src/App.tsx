import ConnectionScreen from "@renderer/components/ConnectionScreen"
import MainWorkspace from "@renderer/components/MainWorkspace"
import { useState } from "react"

function App(): React.JSX.Element {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans overflow-hidden">
      {isConnected ? (
        <MainWorkspace onDisconnect={() => setIsConnected(false)} />
      ) : (
        <ConnectionScreen onConnect={() => setIsConnected(true)} />
      )}
    </div>
  )
}

export default App
