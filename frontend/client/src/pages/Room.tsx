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
  const [roomCreator, setRoomCreator] = useState<string | null>(null);
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
          setRoomCreator(data.creator);
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
    <div className="bg-surface-lowest text-on-surface font-body-md overflow-hidden h-screen flex flex-col">
      {/* Navigation Bar */}
      <RoomNavBar
        roomName={roomName}
        roomId={roomId || ""}
        connected={connected}
        activeUsers={activeUsers}
        currentUserId={user?.id || ""}
        roomCreator={roomCreator}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* SideNav (Collapsed or Minimal for Workspace) */}
        <aside className="w-[64px] bg-surface-low border-r border-subtle flex flex-col items-center py-space-lg gap-space-lg">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>tactic</span>
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg">
            <span className="material-symbols-outlined">dashboard</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg">
            <span className="material-symbols-outlined">history</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg">
            <span className="material-symbols-outlined">group</span>
          </button>
          <div className="mt-auto flex flex-col gap-space-lg">
            <button className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Canvas */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-surface-lowest">
          <div className="flex flex-1 overflow-hidden">
            <SplitPanelLayout
              leftPanel={{
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

          {/* Bottom Replay Toolbar */}
          <footer className="h-14 bg-surface-low border-t border-subtle flex items-center px-space-lg gap-space-xl">
            <div className="flex items-center gap-space-sm">
              <button className="p-2 text-primary hover:bg-surface-mid transition-colors rounded-full">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-full">
                <span className="material-symbols-outlined">replay_10</span>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col gap-1 px-4">
              <div className="flex justify-between text-[10px] font-mono text-on-surface-variant uppercase">
                <span>Replay Timeline</span>
                <span>00:00 / 00:00</span>
              </div>
              <div className="relative h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden group cursor-pointer">
                <div className="absolute top-0 left-0 h-full w-[0%] bg-primary"></div>
                <div className="absolute top-0 left-[0%] -translate-x-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full -translate-y-0.5 shadow-lg group-hover:scale-125 transition-transform"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-space-lg">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-secondary flex items-center gap-1 uppercase">
                  <span className={`w-1 h-1 rounded-full ${connected ? 'bg-secondary' : 'bg-red-500'}`}></span>
                  {connected ? 'In Sync' : 'Offline'}
                </span>
                <span className="text-[9px] text-on-surface-variant font-mono">12ms latency</span>
              </div>
              <div className="h-8 w-px bg-subtle"></div>
              <button className="flex items-center gap-2 p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">videocam</span>
              </button>
              <button className="flex items-center gap-2 p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
