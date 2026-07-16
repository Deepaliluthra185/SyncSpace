import { useEffect, useRef, useState, useCallback } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface UseYjsCodeEditorOptions {
  roomId: string;
  userId: string;
  userName: string;
  onCodeChange?: (code: string) => void;
}

export function useYjsCodeEditor({
  roomId,
  userId,
  userName,
  onCodeChange,
}: UseYjsCodeEditorOptions) {
  const ydocRef = useRef<Y.Doc | null>(null);
  const yTextRef = useRef<Y.Text | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const [code, setCode] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Create shared text type
    const yText = ydoc.getText("shared-code");
    yTextRef.current = yText;

    // Initialize WebSocket provider for Yjs
    const defaultWsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`;
    const wsUrl = import.meta.env.VITE_WS_URL || defaultWsUrl;

    const provider = new WebsocketProvider(
      wsUrl,
      `room-${roomId}`,
      ydoc,
      {
        connect: true,
        resyncInterval: 5000,
      }
    );

    providerRef.current = provider;

    // Set up awareness (presence)
    const awareness_ = provider.awareness;
    if (awareness_) {
      awareness_.setLocalState({
        user: {
          name: userName,
          userId,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        },
      });
    }

    // Listen to connection events
    provider.on("sync", (isSynced: boolean) => {
      console.log("[Yjs] Sync status:", isSynced);
      setConnected(isSynced);
    });

    provider.on("connection-close", () => {
      console.log("[Yjs] Connection closed");
      setConnected(false);
    });

    provider.on("connection-error", (error: any) => {
      console.error("[Yjs] Connection error:", error);
      setConnected(false);
    });

    // Listen to text changes
    const handleYTextChange = (event: Y.YTextEvent) => {
      const newCode = yText.toString();
      setCode(newCode);
      onCodeChange?.(newCode);
    };

    yText.observe(handleYTextChange);

    // Set initial code
    setCode(yText.toString());

    return () => {
      yText.unobserve(handleYTextChange);
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomId, userId, userName]); // Removed onCodeChange to prevent reconnect loops

  const updateCode = useCallback((newCode: string) => {
    if (!yTextRef.current) return;

    const yText = yTextRef.current;
    const currentCode = yText.toString();

    if (currentCode === newCode) return;

    // Calculate the difference and apply it
    const ydoc = ydocRef.current;
    if (ydoc) {
      ydoc.transact(() => {
        // Simple approach: delete all and insert new
        // In production, use a more efficient diff algorithm
        if (currentCode.length > 0) {
          yText.delete(0, currentCode.length);
        }
        if (newCode.length > 0) {
          yText.insert(0, newCode);
        }
      });
    }
  }, []);

  const insertText = useCallback((index: number, text: string) => {
    if (!yTextRef.current) return;
    const ydoc = ydocRef.current;
    if (ydoc) {
      ydoc.transact(() => {
        yTextRef.current!.insert(index, text);
      });
    }
  }, []);

  const deleteText = useCallback((index: number, length: number) => {
    if (!yTextRef.current) return;
    const ydoc = ydocRef.current;
    if (ydoc) {
      ydoc.transact(() => {
        yTextRef.current!.delete(index, length);
      });
    }
  }, []);

  return {
    code,
    connected,
    updateCode,
    insertText,
    deleteText,
  };
}
