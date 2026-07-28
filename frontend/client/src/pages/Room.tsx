import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { RoomNavBar } from "@/components/RoomNavBar";
import { SyncSpaceWhiteboard } from "@/components/SyncSpaceWhiteboard";
import { CollaborativeCodeEditor } from "@/components/CollaborativeCodeEditor";
import { SplitPanelLayout } from "@/components/SplitPanelLayout";
import { useSocketRoom, type UserPresence } from "@/hooks/useSocketRoom";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { 
  LayoutDashboard, History, Users, HelpCircle, Settings, Code2 
} from "lucide-react";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [roomName, setRoomName] = useState("Loading...");
  const [roomCreator, setRoomCreator] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);
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
          setMeetLink(data.meetLink || null);
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
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-blue-500" />
          <p className="text-sm text-slate-400 font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="text-center glass-panel p-8 rounded-2xl max-w-md">
          <p className="text-xl font-bold text-white mb-2">Authentication Required</p>
          <p className="text-sm text-slate-400 mb-6">Please sign in to access this workspace.</p>
          <button onClick={() => setLocation('/')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (roomError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="text-center glass-panel p-8 rounded-2xl max-w-md">
          <p className="text-xl font-bold text-white mb-2">Workspace Not Found</p>
          <p className="text-sm text-slate-400 mb-6">The session you're looking for doesn't exist or you don't have access.</p>
          <button onClick={() => setLocation('/')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-slate-200 font-['Geist'] overflow-hidden h-screen flex flex-col relative">
      {/* Background gradients similar to Home.tsx for a cohesive feel */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-indigo-600/5 rounded-full mix-blend-screen filter blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation Bar */}
        <RoomNavBar
          roomName={roomName}
          roomId={roomId || ""}
          connected={connected}
          activeUsers={activeUsers}
          currentUserId={user?.id || ""}
          roomCreator={roomCreator}
          meetLink={meetLink}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* SideNav (Collapsed or Minimal for Workspace) */}
          <aside className="w-[64px] bg-white/[0.02] backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 gap-6 z-20">
            <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl text-blue-400 border border-blue-500/20 shadow-inner mb-2 cursor-pointer hover:bg-blue-500/30 transition-colors">
              <Code2 className="h-5 w-5" />
            </div>
            <button onClick={() => setLocation('/')} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors rounded-xl group relative" title="Dashboard">
              <LayoutDashboard className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={() => toast.info('History tracking is coming soon!')} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors rounded-xl group relative" title="History">
              <History className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={() => toast.info(`There are ${activeUsers.length} active users in this room.`)} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors rounded-xl group relative" title="Active Users">
              <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {activeUsers.length > 1 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-[#050505]"></span>
              )}
            </button>
            <div className="mt-auto flex flex-col gap-4">
              <button onClick={() => toast.info('Shortcuts and help panel coming soon!')} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors rounded-xl group relative" title="Help">
                <HelpCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
              <button onClick={() => toast.info('Room settings coming soon!')} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors rounded-xl group relative" title="Settings">
                <Settings className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </aside>

          {/* Main Workspace Canvas */}
          <main className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
            <SplitPanelLayout
              leftPanel={{
                content: (
                  <div className="w-full h-full glass-panel border-0 border-l border-t rounded-tl-2xl overflow-hidden relative">
                    <SyncSpaceWhiteboard />
                  </div>
                )
              }}
              rightPanel={{
                content: (
                  <div className="w-full h-full glass-panel border-0 border-t overflow-hidden relative border-l border-white/10">
                    <CollaborativeCodeEditor 
                      roomId={roomId || ""}
                      userId={user.id}
                      userName={user.username || "Anonymous"}
                      activeUsers={activeUsers}
                      roomCreator={roomCreator}
                    />
                  </div>
                )
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
