import { useRef, useState } from "react";
import { Code2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useYjsCodeEditor } from "@/hooks/useYjsCodeEditor";

interface CollaborativeCodeEditorProps {
  roomId: string;
  userId: string;
  userName: string;
  onBroadcast?: (data: any) => void;
}

export function CollaborativeCodeEditor({
  roomId,
  userId,
  userName,
  onBroadcast,
}: CollaborativeCodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const { code, connected, updateCode } = useYjsCodeEditor({
    roomId,
    userId,
    userName,
    onCodeChange: (newCode) => {
      // Code is already updated via Yjs
    },
  });
  const [lineCount, setLineCount] = useState(1);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setLineCount(newCode.split("\n").length);
    updateCode(newCode);

    // Broadcast code change
    onBroadcast?.({ type: "code", content: newCode });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const handleClearCode = () => {
    updateCode("");
    setLineCount(1);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0f172a]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-2 text-slate-300">
          <Code2 className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-medium font-mono text-slate-200">userService.ts</span>
        </div>
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
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 h-8"
          >
            Clear
          </Button>
          <Button
            size="sm"
            className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1 rounded text-[11px] font-bold transition-colors h-8"
          >
            RUN CODE
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex flex-1 overflow-hidden relative bg-[#000000]">
        {/* Line Numbers */}
        <div className="flex w-12 flex-col items-center border-r border-slate-800 bg-[#0a0a0a] px-2 py-4 text-right text-xs text-slate-600 font-mono select-none">
          {Array.from({ length: Math.max(20, lineCount) }, (_, i) => (
            <div key={i + 1} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <textarea
          ref={editorRef}
          value={code}
          onChange={handleCodeChange}
          placeholder="// Start typing your code here...&#10;// Changes will be synced in real-time"
          className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-slate-200 outline-none placeholder:text-slate-600"
          spellCheck="false"
          style={{
            lineHeight: "1.5rem",
            tabSize: 2,
          }}
        />

        {/* Typing Indicator Overlay (Simulated for visual flair) */}
        {connected && code.length > 0 && (
          <div className="absolute right-4 top-4 flex items-center gap-2 pointer-events-none opacity-50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Live Sync Active</span>
          </div>
        )}
      </div>

      {/* Terminal Panel */}
      <div className="h-1/3 bg-[#0a0a0a] border-t border-slate-800 flex flex-col">
        <div className="h-8 bg-slate-900/50 px-4 flex items-center border-b border-slate-800/50">
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">TERMINAL</span>
        </div>
        <div className="p-3 text-xs font-mono text-emerald-400 bg-transparent flex-1 overflow-auto">
          <div className="flex gap-2">
            <span className="text-slate-500">$</span>
            <span>npm test</span>
          </div>
          <div className="text-slate-400 mt-1">
            &gt; sync-space-v1@1.0.0 test<br/>
            &gt; jest<br/><br/>
            <span className="text-emerald-400">PASS</span> ./userService.test.ts<br/>
            ✓ createUser (12ms)<br/>
            ✓ getUserById (4ms)<br/><br/>
            Test Suites: 1 passed, 1 total<br/>
            Tests:       2 passed, 2 total<br/>
            Time:        0.84s
          </div>
          <div className="flex gap-2 mt-2">
            <span className="text-slate-500">$</span>
            <span className="inline-block w-2 h-4 bg-emerald-500/50 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-slate-800 bg-slate-900/80 px-4 py-2 text-[11px] text-slate-500 font-mono">
        <div className="flex justify-between items-center">
          <span>{code.length} chars</span>
          <span>{code.split("\n").length} lines</span>
          <div className="flex items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-red-500"}`}></span>
            <span>Room: {roomId.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
