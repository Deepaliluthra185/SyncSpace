import { useRef, useState, useEffect } from "react";
import { Code2, Copy, Check, Terminal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useYjsCodeEditor } from "@/hooks/useYjsCodeEditor";
import Editor, { useMonaco } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";

interface UserPresence {
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: Date;
}

interface CollaborativeCodeEditorProps {
  roomId: string;
  userId: string;
  userName: string;
  activeUsers?: UserPresence[];
  roomCreator?: string | null;
}

export function CollaborativeCodeEditor({
  roomId,
  userId,
  userName,
  activeUsers = [],
  roomCreator = null,
}: CollaborativeCodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "participants">("code");
  const [editorInstance, setEditorInstance] = useState<any>(null);
  
  const { code, connected, yText, provider } = useYjsCodeEditor({
    roomId,
    userId,
    userName,
  });

  const monaco = useMonaco();

  useEffect(() => {
    if (editorInstance && yText && provider && monaco) {
      // Bind Yjs to Monaco Editor
      const binding = new MonacoBinding(
        yText,
        editorInstance.getModel(),
        new Set([editorInstance]),
        provider.awareness
      );

      return () => {
        binding.destroy();
      };
    }
  }, [yText, provider, monaco, editorInstance]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setEditorInstance(editor);
  };

  const handleCopyCode = async () => {
    try {
      const currentCode = editorInstance?.getValue() || code;
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const handleClearCode = () => {
    if (yText) {
      yText.delete(0, yText.length);
    }
    if (editorInstance) {
      editorInstance.focus();
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0f0c16] overflow-hidden">
      {/* Top Bar with Tabs */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#07050a] px-4">
        <div className="flex items-center">
          <button 
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "code" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-400 hover:text-white"}`}
          >
            <Code2 className="h-4 w-4" />
            Code Editor
          </button>
          <button 
            onClick={() => setActiveTab("participants")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "participants" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-400 hover:text-white"}`}
          >
            <Users className="h-4 w-4" />
            Participants ({activeUsers.length})
          </button>
        </div>
        
        {activeTab === "code" && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 h-8"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCode}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-8 transition-colors"
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1 rounded text-[11px] font-bold transition-colors h-8 ml-2"
            >
              RUN
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative bg-[#000000]">
        
        {activeTab === "code" ? (
          <div className="w-full h-full">
            <Editor
              height="100%"
              theme="vs-dark"
              language="javascript"
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderWhitespace: "selection",
              }}
            />
            {/* Live indicator overlay */}
            <div className="absolute right-6 top-4 flex items-center gap-2 pointer-events-none opacity-60 z-10 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700/50">
              <span className="relative flex h-2 w-2">
                {connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? "bg-emerald-500" : "bg-red-500"}`}></span>
              </span>
              <span className={`text-[10px] font-mono ${connected ? "text-emerald-400" : "text-red-400"}`}>
                {connected ? "LIVE SYNC" : "OFFLINE"}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-[#07050a] p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Room Participants
            </h3>
            <div className="grid gap-3">
              {activeUsers.map(u => {
                const isHost = u.userId === roomCreator;
                const isMe = u.userId === userId;
                return (
                  <div key={u.userId} className="glass-panel p-4 rounded-xl flex items-center justify-between border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner bg-gradient-to-br ${isHost ? 'from-amber-400 to-orange-500' : 'from-purple-400 to-pink-500'}`}>
                        {u.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-200">{u.userName}</p>
                          {isMe && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">YOU</span>}
                        </div>
                        <p className="text-xs text-slate-500">{u.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isHost ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                        {isHost ? 'HOST' : 'CANDIDATE'}
                      </span>
                    </div>
                  </div>
                );
              })}
              {activeUsers.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  <p>No active participants found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Terminal Panel (Only show when code tab is active) */}
      {activeTab === "code" && (
        <div className="h-1/3 bg-[#07050a] border-t border-white/5 flex flex-col">
          <div className="h-8 bg-white/5 px-4 flex items-center border-b border-white/5 gap-2">
            <Terminal className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">TERMINAL</span>
          </div>
          <div className="p-3 text-xs font-mono text-emerald-400 bg-transparent flex-1 overflow-auto">
            <div className="flex gap-2">
              <span className="text-slate-500">$</span>
              <span>npm start</span>
            </div>
            <div className="text-slate-400 mt-1">
              &gt; syncspace@1.0.0 start<br/>
              &gt; node index.js<br/><br/>
              <span className="text-emerald-400">Ready</span> Listening on port 3000...<br/>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-slate-500">$</span>
              <span className="inline-block w-2 h-4 bg-emerald-500/50 animate-pulse"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
