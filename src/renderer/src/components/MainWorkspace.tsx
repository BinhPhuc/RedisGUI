import { useState } from "react"
import Editor from "@monaco-editor/react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import {
  Database,
  Search,
  Server,
  Star,
  History,
  Code2,
  ArrowDownToLine,
  Clock,
  ChevronDown,
  Menu
} from "lucide-react"

interface MainWorkspaceProps {
  onDisconnect: () => void
}

export default function MainWorkspace({ onDisconnect }: MainWorkspaceProps) {
  const [query, setQuery] = useState("Vào mục kết nối và gõ\n\nGET my_key")

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
        {/* Activity Bar (Thin leftmost) */}
        <div className="w-14 bg-card flex flex-col items-center py-4 gap-6 shrink-0 border-r border-border z-10 shadow-sm relative">
          <div className="cursor-pointer text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </div>
          <div className="cursor-pointer text-foreground bg-muted p-2 rounded-lg">
            <Server className="w-5 h-5" />
          </div>
          <div className="cursor-pointer text-muted-foreground hover:text-foreground">
            <Star className="w-5 h-5" />
          </div>
          <div className="cursor-pointer text-muted-foreground hover:text-foreground">
            <History className="w-5 h-5" />
          </div>
          <div
            className="mt-auto cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={onDisconnect}
          >
            <Database className="w-5 h-5" />
          </div>
        </div>

        <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
          {/* Inner Sidebar: Entities Navigation */}
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            maxSize={40}
            className="flex flex-col bg-muted/20"
          >
            {/* Top Connection Name Selector */}
            <div className="p-3 border-b border-border flex items-center justify-between cursor-pointer font-bold text-foreground hover:bg-muted/50 transition-colors">
              <span>Local Redis</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
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

      {/* Status Bar (Cyan/Blue Theme like Beekeeper's bottom status) */}
      <div className="h-8 bg-[#06b6d4] text-black border-t border-[#0891b2] shrink-0 flex justify-between items-center px-3 text-[11px] font-bold font-sans">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 uppercase tracking-wide">
            <span className="bg-black/20 px-1.5 py-0.5 rounded shadow-sm text-cyan-50">
              ✓ [DEV] LOCAL REDIS
            </span>
          </div>
          <span className="opacity-75">redis 7.2</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black/10 rounded overflow-hidden">
            <span className="px-2 py-0.5 border-r border-black/10">Result 1 ▼</span>
          </div>
          <div className="flex items-center gap-1 opacity-80">
            <span className="opacity-50">#</span> 1000
          </div>
          <div className="flex items-center gap-1 opacity-80">
            <Clock className="w-3 h-3 ml-2" /> 0.045 seconds
          </div>
          <button className="flex items-center gap-1.5 ml-4 bg-black/20 hover:bg-black/30 transition-colors px-2 py-0.5 rounded text-white shadow-sm">
            Download <ArrowDownToLine className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
