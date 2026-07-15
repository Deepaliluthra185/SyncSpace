import { ReactNode } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { GripVertical } from "lucide-react";

interface SplitPanelLayoutProps {
  leftPanel: {
    label: string;
    content: ReactNode;
  };
  rightPanel: {
    label: string;
    content: ReactNode;
  };
}

export function SplitPanelLayout({ leftPanel, rightPanel }: SplitPanelLayoutProps) {
  return (
    <PanelGroup direction="horizontal" className="h-full">
      {/* Left Panel */}
      <Panel defaultSize={50} minSize={20} className="flex flex-col bg-background">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
            {leftPanel.label}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden">{leftPanel.content}</div>
      </Panel>

      {/* Resize Handle */}
      <PanelResizeHandle className="group relative w-1 bg-border transition-colors hover:bg-primary/50">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-muted p-1 opacity-0 transition-opacity group-hover:opacity-100">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </PanelResizeHandle>

      {/* Right Panel */}
      <Panel defaultSize={50} minSize={20} className="flex flex-col bg-background">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent"></span>
            {rightPanel.label}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden">{rightPanel.content}</div>
      </Panel>
    </PanelGroup>
  );
}
