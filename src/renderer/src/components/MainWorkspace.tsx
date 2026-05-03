import { useState } from "react"
import Editor from "@monaco-editor/react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { Search, Star, Code2, ChevronDown, LogOut } from "lucide-react"
import type { ConnectionInfo } from "../../../shared/connection"
import { toast } from "react-toastify"

interface MainWorkspaceProps {
  onDisconnect: () => void
  connectionInfo: ConnectionInfo
}

export default function MainWorkspace({ onDisconnect, connectionInfo }: MainWorkspaceProps) {
  const [query, setQuery] = useState("")

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

  const handleQueryExecute = async () => {
    if (!query.trim()) {
      toast.warning("Please enter a query to execute", { autoClose: 3000, type: "warning" })
      return
    }
    console.log(`Executing query: ${query}`)
    const response = await window.redis.query(query)
    console.log("Query response:", response)
    if (response.ok) {
      toast.success(response.message ?? "Query executed successfully", {
        autoClose: 1500,
        type: "success"
      })
    }
  }



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
            <div className="p-3 flex flex-col font-bold">
              <span>{connectionInfo.name}</span>
              <span>
                {connectionInfo.host}:{connectionInfo.port}
              </span>
            </div>
            <Separator />

            {/* Filter */}
            <div className="p-3 pb-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Filter"
                  className="rounded-md pl-2.5 pr-8 py-1.5 h-8 text-xs"
                />
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Tree Navigation */}
            <ScrollArea className="flex-1 mt-2">
              <div className="p-2 space-y-4 select-none">
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
            </ScrollArea>
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
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-[#eab308] text-black text-xs font-bold hover:bg-[#ca8a04] focus:ring focus:ring-yellow-300"
                      onClick={handleQueryExecute}
                    >
                      Run <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="h-1 bg-border hover:bg-primary/50 focus:bg-primary transition-colors"
              />

              {/* Bottom Panel: Table Results grid */}
              <ResizablePanel defaultSize={50} minSize={20} className="flex flex-col bg-card">
                <ScrollArea className="flex-1">
                  <Table className="text-xs">
                    <TableHeader className="bg-card sticky top-0 z-10">
                      <TableRow className="border-b-2 border-border">
                        <TableHead className="w-16 text-center text-muted-foreground">#</TableHead>
                        <TableHead className="w-48 text-chart-4">key_name</TableHead>
                        <TableHead className="w-24 text-chart-4">type</TableHead>
                        <TableHead className="text-chart-4">value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="font-mono bg-background">
                      <TableRow>
                        <TableCell className="text-center text-muted-foreground">1</TableCell>
                        <TableCell className="text-foreground font-semibold">user_sessions</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">hash</Badge>
                        </TableCell>
                        <TableCell className="truncate max-w-xs text-foreground">
                          {"{ id: 1, token: 'abc' }"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-center text-muted-foreground">2</TableCell>
                        <TableCell className="text-foreground font-semibold">config_flags</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">set</Badge>
                        </TableCell>
                        <TableCell className="truncate max-w-xs text-foreground">
                          [&quot;feature_x&quot;, &quot;feature_y&quot;]
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-center text-muted-foreground">3</TableCell>
                        <TableCell className="text-foreground font-semibold">logs_today</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">list</Badge>
                        </TableCell>
                        <TableCell className="truncate max-w-xs text-foreground">
                          [&quot;start&quot;, &quot;running&quot;, &quot;done&quot;]
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </ScrollArea>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-muted border-t border-border shrink-0 flex items-center px-3 text-[11px] font-medium font-sans text-muted-foreground">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 bg-background hover:bg-background/80 border border-border px-2 py-0.5 rounded shadow-sm text-foreground cursor-pointer transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              {displayName}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-40">
            <DropdownMenuItem variant="destructive" onClick={handleDisconnect}>
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
