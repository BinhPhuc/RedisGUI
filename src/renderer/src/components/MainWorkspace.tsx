import { useState, useRef, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { Search, Star, Code2, ChevronDown, LogOut } from "lucide-react"
import type { ConnectionInfo } from "../../../shared/connection"
import { toast } from "react-toastify"

interface MainWorkspaceProps {
  onDisconnect: () => void
  connectionInfo: ConnectionInfo
}

export default function MainWorkspace({ onDisconnect, connectionInfo }: MainWorkspaceProps) {
  const [query, setQuery] = useState("Vào mục kết nối và gõ\n\nGET my_key")
  const [showDisconnectMenu, setShowDisconnectMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const displayName = connectionInfo.name || `${connectionInfo.host}:${connectionInfo.port}`

  const handleDisconnect = async () => {
    const response = await window.redis.disconnect()
    console.log("Disconnect response:", response)
    if (response.ok) {
      toast.success(response.message ?? "Disconnected", { autoClose: 1500, type: "success" })
      onDisconnect()
    } else {
      toast.error(response.message ?? "Failed to disconnect", { autoClose: 4000, type: "error" })
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowDisconnectMenu(false)
      }
    }
    if (showDisconnectMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDisconnectMenu])

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme("solarized-light", {
      base: "vs",
      inherit: true,
      rules: [
        { background: "fdf6e3" },
        { token: "comment", foreground: "93a1a1", fontStyle: "italic" },
        { token: "string", foreground: "2aa198" },
        { token: "keyword", foreground: "859900" },
        { token: "number", foreground: "d33682" },
        { token: "variable", foreground: "268bd2" },
        { token: "type", foreground: "b58900" }
      ],
      colors: {
        "editor.background": "#fdf6e3",
        "editor.foreground": "#657b83",
        "editorLineNumber.foreground": "#93a1a1",
        "editorCursor.foreground": "#586e75",
        "editor.selectionBackground": "#eee8d5",
        "editor.inactiveSelectionBackground": "#eee8d5"
      }
    })

    monaco.editor.defineTheme("solarized-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { background: "002b36" },
        { token: "comment", foreground: "586e75", fontStyle: "italic" },
        { token: "string", foreground: "2aa198" },
        { token: "keyword", foreground: "859900" },
        { token: "number", foreground: "d33682" },
        { token: "variable", foreground: "268bd2" },
        { token: "type", foreground: "b58900" }
      ],
      colors: {
        "editor.background": "#002b36",
        "editor.foreground": "#839496",
        "editorLineNumber.foreground": "#586e75",
        "editorCursor.foreground": "#839496",
        "editor.selectionBackground": "#073642",
        "editor.inactiveSelectionBackground": "#073642"
      }
    })
  }

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden text-sm">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
          {/* Inner Sidebar: Entities Navigation */}
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            maxSize={40}
            className="flex flex-col bg-muted/20"
          >
            {/* Top Connection Name Selector */}
            <div className="p-3 border-b border-border flex flex-col font-bold">
              <span>{connectionInfo.name}</span>
              <span>
                {connectionInfo.host}:{connectionInfo.port}
              </span>
              {/* <ChevronDown className="w-4 h-4 text-muted-foreground" /> */}
            </div>

            {/* Filter */}
            <div className="p-3 pb-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter"
                  className="w-full bg-background border border-border rounded pl-2.5 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground placeholder:text-muted-foreground"
                />
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Tree Navigation */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 select-none mt-2">
              {/* Pinned Section */}
              <div>
                <div className="px-2 text-[10px] font-bold text-muted-foreground tracking-wider mb-1 flex items-center gap-1">
                  PINNED <span className="opacity-50">2</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between hover:bg-muted py-1.5 px-2 rounded cursor-pointer group text-foreground">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-chart-1" />
                      <span>user_sessions</span>
                    </div>
                    <Star className="w-3 h-3 text-muted-foreground group-hover:opacity-100 opacity-0" />
                  </div>
                  <div className="flex items-center justify-between hover:bg-muted py-1.5 px-2 rounded cursor-pointer group text-foreground">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-chart-1" />
                      <span>product_cache</span>
                    </div>
                    <Star className="w-3 h-3 text-muted-foreground group-hover:opacity-100 opacity-0" />
                  </div>
                </div>
              </div>

              {/* Entities Section */}
              <div>
                <div className="px-2 text-[10px] font-bold text-muted-foreground tracking-wider mb-1 flex items-center gap-1">
                  ENTITIES <span className="opacity-50">12</span>
                </div>
                <div className="space-y-0.5">
                  {[
                    "auth_tokens",
                    "config_flags",
                    "failed_jobs",
                    "logs_today",
                    "queue_workers"
                  ].map((key) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 hover:bg-muted py-1.5 px-2 rounded cursor-pointer text-foreground"
                    >
                      <Code2 className="w-3.5 h-3.5 text-chart-4" />
                      <span>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="w-1 bg-border hover:bg-primary/50 focus:bg-primary transition-colors"
          />

          {/* Right Main Area */}
          <ResizablePanel defaultSize={80} className="flex flex-col bg-background">
            <ResizablePanelGroup direction="vertical" className="flex-1">
              {/* Top Panel: Query Editor */}
              <ResizablePanel defaultSize={50} minSize={20} className="flex flex-col relative z-0">
                {/* Editor Surface */}
                <div className="flex-1 p-0 relative flex bg-background">
                  <Editor
                    height="100%"
                    defaultLanguage="redis"
                    language="redis"
                    theme="solarized-light"
                    beforeMount={handleEditorWillMount}
                    value={query}
                    onChange={(value) => setQuery(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      lineNumbersMinChars: 3
                    }}
                    className="flex-1"
                  />

                  {/* Floating Buttons Bottom Right inside Editor */}
                  <div className="absolute bottom-4 right-4 flex gap-2 shadow-lg">
                    <button className="bg-card text-foreground border border-border px-3 py-1.5 rounded text-xs font-bold hover:bg-muted transition-colors">
                      Save
                    </button>
                    <button className="bg-[#eab308] text-black px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-[#ca8a04] focus:ring focus:ring-yellow-300 transition-colors">
                      Run <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="h-1 bg-border hover:bg-primary/50 focus:bg-primary transition-colors"
              />

              {/* Bottom Panel: Table Results grid */}
              <ResizablePanel defaultSize={50} minSize={20} className="flex flex-col bg-card">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-card sticky top-0 z-10 font-bold text-foreground">
                      <tr className="border-b-2 border-border shadow-sm">
                        <th className="px-4 py-2 border-r border-border w-16 text-center text-muted-foreground">
                          #
                        </th>
                        <th className="px-4 py-2 border-r border-border w-48 text-chart-4">
                          key_name
                        </th>
                        <th className="px-4 py-2 border-r border-border w-24 text-chart-4">type</th>
                        <th className="px-4 py-2 text-chart-4">value</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono bg-background">
                      <tr className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-2 border-r border-border text-center text-muted-foreground">
                          1
                        </td>
                        <td className="px-4 py-2 border-r border-border text-foreground font-semibold">
                          user_sessions
                        </td>
                        <td className="px-4 py-2 border-r border-border text-muted-foreground">
                          hash
                        </td>
                        <td className="px-4 py-2 text-muted-foreground truncate max-w-xs ">
                          <span className="text-foreground">{"{ id: 1, token: 'abc' }"}</span>
                        </td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-2 border-r border-border text-center text-muted-foreground">
                          2
                        </td>
                        <td className="px-4 py-2 border-r border-border text-foreground font-semibold">
                          config_flags
                        </td>
                        <td className="px-4 py-2 border-r border-border text-muted-foreground">
                          set
                        </td>
                        <td className="px-4 py-2 text-muted-foreground truncate max-w-xs">
                          <span className="text-foreground">
                            [&quot;feature_x&quot;, &quot;feature_y&quot;]
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-2 border-r border-border text-center text-muted-foreground">
                          3
                        </td>
                        <td className="px-4 py-2 border-r border-border text-foreground font-semibold">
                          logs_today
                        </td>
                        <td className="px-4 py-2 border-r border-border text-muted-foreground">
                          list
                        </td>
                        <td className="px-4 py-2 text-muted-foreground truncate max-w-xs">
                          <span className="text-foreground">
                            [&quot;start&quot;, &quot;running&quot;, &quot;done&quot;]
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-[#eee8d5] text-[#657b83] border-t border-[#93a1a1]/30 shrink-0 flex items-center px-3 text-[11px] font-medium font-sans">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowDisconnectMenu((v) => !v)}
            className="flex items-center gap-1.5 bg-[#fdf6e3] hover:bg-[#fdf6e3]/80 border border-[#93a1a1]/30 px-2 py-0.5 rounded shadow-sm text-[#586e75] cursor-pointer transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#859900]" />
            {displayName}
            <ChevronDown className="w-3 h-3 text-[#93a1a1]" />
          </button>

          {showDisconnectMenu && (
            <div className="absolute bottom-full left-0 mb-1 w-40 bg-[#fdf6e3] border border-[#93a1a1]/30 rounded-md shadow-lg p-1 z-50">
              <button
                onClick={() => {
                  setShowDisconnectMenu(false)
                  handleDisconnect()
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#dc322f] hover:bg-[#eee8d5] rounded cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
