import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface UserPresence {
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: Date;
}

interface UseSocketRoomOptions {
  roomId: string;
  userId: string;
  userName: string;
  userEmail: string;
  onUsersUpdated?: (users: UserPresence[]) => void;
  onCodeChange?: (update: any) => void;
  onCursorMove?: (data: { userId: string; line: number; column: number }) => void;
  onError?: (error: any) => void;
}

export function useSocketRoom({
  roomId,
  userId,
  userName,
  userEmail,
  onUsersUpdated,
  onCodeChange,
  onCursorMove,
  onError,
}: UseSocketRoomOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);

  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io(import.meta.env.VITE_API_URL || window.location.origin, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket.io] Connected");
      setConnected(true);

      // Join the room
      socket.emit("join-room", {
        roomId,
        userId,
        userName,
        userEmail,
      });
    });

    socket.on("disconnect", () => {
      console.log("[Socket.io] Disconnected");
      setConnected(false);
    });

    socket.on("users-updated", (data: { users: UserPresence[] }) => {
      console.log("[Socket.io] Users updated:", data.users);
      setActiveUsers(data.users);
      onUsersUpdated?.(data.users);
    });

    socket.on("code-change", (data: { update: any }) => {
      onCodeChange?.(data.update);
    });

    socket.on("cursor-move", (data: { userId: string; line: number; column: number }) => {
      onCursorMove?.(data);
    });

    socket.on("error", (error: any) => {
      console.error("[Socket.io] Error:", error);
      onError?.(error);
    });

    return () => {
      if (socket.connected) {
        socket.emit("leave-room", { roomId, userId });
      }
      socket.disconnect();
    };
  }, [roomId, userId, userName, userEmail, onUsersUpdated, onCodeChange, onCursorMove, onError]);

  const broadcastCodeChange = useCallback(
    (update: any) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("code-change", { roomId, update });
      }
    },
    [roomId]
  );

  const broadcastCursorMove = useCallback(
    (line: number, column: number) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("cursor-move", { roomId, userId, line, column });
      }
    },
    [roomId, userId]
  );

  const broadcastUserActive = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("user-active", { roomId, userId });
    }
  }, [roomId, userId]);

  return {
    connected,
    activeUsers,
    broadcastCodeChange,
    broadcastCursorMove,
    broadcastUserActive,
  };
}
