import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { RoomNavBar } from "@/components/RoomNavBar";
import { SplitPanelLayout } from "@/components/SplitPanelLayout";
import { ArchitectureWhiteboard } from "@/components/ArchitectureWhiteboard";
import { CollaborativeCodeEditor } from "@/components/CollaborativeCodeEditor";
import { useSocketRoom, type UserPresence } from "@/hooks/useSocketRoom";
import { Spinner } from "@/components/ui/spinner";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [roomName, setRoomName] = useState("Loading...");
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState(false);

  // Fetch room details
  useEffect(() => {
    if (!roomId) return;
    
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("syncspace_token") || ""}`
          }
        });
        const data = await res.json();
        
        if (res.ok && data.id) {
          setRoomName(data.name);
        } else {
          setRoomError(true);
        }
      } catch (err) {
        setRoomError(true);
      } finally {
        setRoomLoading(false);
      }
    };
    
    fetchRoom();
  }, [roomId]);

  // Initialize Socket.io connection
  const { connected, broadcastCodeChange, broadcastUserActive } = useSocketRoom({
    roomId,
    userId: user?.id || "",
    userName: user?.username || "Anonymous",
    userEmail: user?.email || "unknown@example.com",
    onUsersUpdated: (users) => {
      setActiveUsers(users);
    },
    onError: (error) => {
      console.error("Socket.io error:", error);
    },
  });



  // Broadcast user activity periodically
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => {
      broadcastUserActive();
    }, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [connected, broadcastUserActive]);

  if (authLoading || roomLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">Loading room...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Authentication Required</p>
          <p className="text-sm text-muted-foreground">Please sign in to access this room.</p>
        </div>
      </div>
    );
  }

  if (roomError) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Room Not Found</p>
          <p className="text-sm text-muted-foreground">The room you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Navigation Bar */}
      <RoomNavBar
        roomName={roomName}
        roomId={roomId}
        connected={connected}
        activeUsers={activeUsers}
        currentUserId={user.id}
      />

      {/* Split Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <SplitPanelLayout
          leftPanel={{
            label: "Architecture Whiteboard",
            content: (
              <ArchitectureWhiteboard
                roomId={roomId}
                onBroadcast={(data) => {
                  // Broadcast whiteboard updates via Socket.io
                  console.log("Whiteboard update:", data);
                }}
              />
            ),
          }}
          rightPanel={{
            label: "Collaborative Code Editor",
            content: (
              <CollaborativeCodeEditor
                roomId={roomId}
                userId={user.id}
                userName={user.username || "Anonymous"}
                onBroadcast={(data) => {
                  if (data.type === "code") {
                    broadcastCodeChange(data);
                  }
                }}
              />
            ),
          }}
        />
      </div>
    </div>
  );
}
