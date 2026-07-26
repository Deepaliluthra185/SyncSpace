import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { RoomNavBar } from "@/components/RoomNavBar";
import { SyncSpaceWhiteboard } from "@/components/SyncSpaceWhiteboard";
import { useSocketRoom, type UserPresence } from "@/hooks/useSocketRoom";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

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
          <button onClick={() => setLocation('/')} className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg" title="Dashboard">
            <span className="material-symbols-outlined">dashboard</span>
          </button>
          <button onClick={() => toast.info('History tracking is coming soon!')} className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg" title="History">
            <span className="material-symbols-outlined">history</span>
          </button>
          <button onClick={() => toast.info(`There are ${activeUsers.length} active users in this room.`)} className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg" title="Active Users">
            <span className="material-symbols-outlined">group</span>
          </button>
          <div className="mt-auto flex flex-col gap-space-lg">
            <button onClick={() => toast.info('Shortcuts and help panel coming soon!')} className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg" title="Help">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button onClick={() => toast.info('Room settings coming soon!')} className="p-2 text-on-surface-variant hover:bg-surface-mid transition-colors rounded-lg" title="Settings">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Canvas */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-surface-lowest">
          <SyncSpaceWhiteboard />
        </main>
      </div>
    </div>
  );
}
