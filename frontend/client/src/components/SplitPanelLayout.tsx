import { ReactNode } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { GripVertical } from "lucide-react";

interface SplitPanelLayoutProps {
  leftPanel: {
    label?: string;
    content: ReactNode;
  };
  rightPanel: {
    label?: string;
    content: ReactNode;
  };
}

export function SplitPanelLayout({ leftPanel, rightPanel }: SplitPanelLayoutProps) {
  return (
    <PanelGroup direction="horizontal" className="h-full">
      {/* Left Panel */}
      <Panel defaultSize={50} minSize={20} className="flex flex-col">
        <div className="flex-1 overflow-hidden flex flex-col">{leftPanel.content}</div>
      </Panel>

      {/* Resize Handle */}
      <PanelResizeHandle className="group relative w-[1px] bg-subtle transition-colors hover:bg-primary/50 z-50 cursor-col-resize">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface-mid p-1 opacity-0 transition-opacity group-hover:opacity-100">
          <GripVertical className="h-4 w-4 text-on-surface-variant" />
        </div>
      </PanelResizeHandle>

      {/* Right Panel */}
      <Panel defaultSize={50} minSize={20} className="flex flex-col">
        <div className="flex-1 overflow-hidden flex flex-col">{rightPanel.content}</div>
      </Panel>
    </PanelGroup>
  );
}
