import { Button } from "@renderer/components/ui/button"
import { Label } from "@renderer/components/ui/label"
import { useState } from "react"

function App(): React.JSX.Element {
  const [name, setName] = useState("")
  const [version, setVersion] = useState("")
  const [platform, setPlatform] = useState("")

  const ipcHandle = async () => {
    console.log("Getting app info from main process...")
    const info = await window.getInfo.getInfo()
    setName(info.name)
    setVersion(info.version)
    setPlatform(info.platform)
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Name: {name}</Label>
        <Label>Version: {version}</Label>
        <Label>Platform: {platform}</Label>
        <Button onClick={ipcHandle}>Get App Info from Main Process</Button>
      </div>
    </>
  )
}

export default App
