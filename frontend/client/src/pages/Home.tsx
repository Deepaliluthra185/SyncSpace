import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function Home() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const isAuthenticated = !!user;
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("syncspace_token") || ""}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      } finally {
        setIsLoadingRooms(false);
      }
    };
    
    fetchRooms();
  }, [isAuthenticated]);

  const createRoomWithPrompt = async () => {
    const name = window.prompt("Enter a name for your new session:");
    if (!name || !name.trim()) return;

    setIsCreating(true);
    
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("syncspace_token") || ""}`
        },
        body: JSON.stringify({ name: name.trim() })
      });
      
      const data = await res.json();
      
      if (res.ok && data.id) {
        toast.success("Room created successfully!");
        setLocation(`/room/${data.id}`);
      } else {
        toast.error(data.msg || data.error || "Failed to create room");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoomWithPrompt = () => {
    const roomId = window.prompt("Enter the Session ID to join:");
    if (!roomId || !roomId.trim()) return;
    setLocation(`/room/${roomId.trim()}`);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-lowest">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="dark bg-surface-lowest min-h-screen text-on-surface font-['Geist'] flex">
      {/* SideNavBar Anchor */}
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface-low border-r border-subtle flex flex-col py-space-lg z-50">
        <div className="px-space-lg mb-8">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">SyncSpace</h1>
          <p className="font-label-sm text-on-surface-variant">Enterprise Plan</p>
        </div>
        <button 
          onClick={createRoomWithPrompt}
          disabled={isCreating}
          className="mx-space-lg mb-8 bg-primary text-on-primary font-label-md py-space-sm px-space-md rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
          {isCreating ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <span className="material-symbols-outlined text-[18px]">add</span>
          )}
          New Session
        </button>
        <nav className="flex-1 space-y-1">
          {/* Active Tab: Dashboard */}
          <a className="flex items-center px-space-lg py-2 text-primary border-l-2 border-primary bg-primary/10 font-body-md transition-colors" href="#">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            Dashboard
          </a>
          <a className="flex items-center px-space-lg py-2 text-on-surface-variant hover:bg-surface-mid transition-colors font-body-md" href="#">
            <span className="material-symbols-outlined mr-3">tactic</span>
            Workspace
          </a>
          <a className="flex items-center px-space-lg py-2 text-on-surface-variant hover:bg-surface-mid transition-colors font-body-md" href="#">
            <span className="material-symbols-outlined mr-3">history</span>
            History
          </a>
          <a className="flex items-center px-space-lg py-2 text-on-surface-variant hover:bg-surface-mid transition-colors font-body-md" href="#">
            <span className="material-symbols-outlined mr-3">group</span>
            Team
          </a>
        </nav>
        <div className="mt-auto border-t border-subtle pt-space-lg px-space-sm space-y-1">
          <a className="flex items-center px-space-lg py-2 text-on-surface-variant hover:bg-surface-mid transition-colors font-body-md" href="#">
            <span className="material-symbols-outlined mr-3">settings</span>
            Settings
          </a>
          <a className="flex items-center px-space-lg py-2 text-on-surface-variant hover:bg-surface-mid transition-colors font-body-md" href="#">
            <span className="material-symbols-outlined mr-3">help</span>
            Support
          </a>
          <div className="flex items-center gap-3 px-space-lg py-space-md">
            <div className="w-8 h-8 rounded-full border-2 border-primary bg-surface-mid flex items-center justify-center font-bold text-primary uppercase">
              {user?.username?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-label-md text-on-surface truncate">{user?.username || 'User'}</p>
              <p className="font-caption text-on-surface-variant truncate">Developer</p>
            </div>
            <button onClick={() => logout()} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors cursor-pointer ml-auto" title="Logout">
              logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="ml-[240px] flex flex-col flex-1 min-h-screen">
        {/* TopNavBar Anchor */}
        <header className="h-12 px-space-lg flex justify-between items-center bg-surface-low border-b border-subtle sticky top-0 z-40">
          <div className="flex items-center gap-space-xl">
            <nav className="flex gap-space-lg">
              <a className="font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Projects</a>
              <a className="font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Shared</a>
              <a className="font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Templates</a>
            </nav>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">search</span>
              <input className="w-full bg-surface-lowest border border-subtle rounded px-10 py-1.5 font-body-sm focus:outline-none focus:border-primary transition-all group-focus-within:scale-[1.02]" placeholder="Search sessions, users, or tags..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">account_tree</button>
            <div className="h-4 w-[1px] bg-subtle mx-1"></div>
            <button className="font-label-md px-3 py-1 bg-surface-mid border border-subtle rounded hover:bg-surface-variant transition-colors cursor-pointer">Invite</button>
            <button onClick={createRoomWithPrompt} disabled={isCreating} className="font-label-md px-3 py-1 bg-secondary text-on-secondary rounded hover:opacity-90 transition-opacity cursor-pointer">Go Live</button>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="p-space-xl flex-1 max-w-[1400px] mx-auto w-full">
          <div className="flex justify-between items-end mb-space-xl">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Session Dashboard</h2>
              <p className="font-body-md text-on-surface-variant">Manage your collaborative technical workspaces.</p>
            </div>
            <div className="flex gap-space-sm">
              <div className="flex items-center bg-surface-low border border-subtle rounded-lg px-2">
                <button className="p-2 text-primary cursor-pointer"><span className="material-symbols-outlined">grid_view</span></button>
                <button className="p-2 text-on-surface-variant hover:text-primary cursor-pointer"><span className="material-symbols-outlined">view_list</span></button>
              </div>
            </div>
          </div>

          {/* Bento Grid of Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            
            {/* Create Session Card replacing the mock ones */}
            <div 
              onClick={createRoomWithPrompt}
              className="group bg-surface-low border border-subtle border-dashed rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[220px] cursor-pointer items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-mid group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                 <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">add</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Create New Session</h3>
              <p className="font-body-sm text-on-surface-variant mt-2 max-w-[200px]">Start a new real-time collaborative workspace.</p>
            </div>

            {/* Join Session Card */}
            <div 
              onClick={joinRoomWithPrompt}
              className="group bg-surface-low border border-subtle border-dashed rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[220px] cursor-pointer items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-mid group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                 <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">login</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Join Existing Session</h3>
              <p className="font-body-sm text-on-surface-variant mt-2 max-w-[200px]">Enter a Session ID to join an active workspace.</p>
            </div>
            
            {/* Rooms List */}
            {isLoadingRooms ? (
              <div className="group bg-surface-low border border-subtle rounded-lg p-space-lg opacity-50 flex flex-col min-h-[220px] items-center justify-center">
                <Spinner className="h-8 w-8 text-primary mb-4" />
                <p className="font-body-sm text-on-surface-variant text-center">Loading sessions...</p>
              </div>
            ) : rooms.length > 0 ? (
              rooms.map((room: any) => {
                const isHost = room.creator?._id === user?.id;
                return (
                  <div 
                    key={room._id}
                    onClick={() => setLocation(`/room/${room.roomId}`)}
                    className="group bg-surface-low border border-subtle rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[220px] cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">folder</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${isHost ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                        {isHost ? "Host" : "Participant"}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mb-1">{room.name}</h3>
                    <p className="font-body-sm text-on-surface-variant flex-1">
                      ID: {room.roomId} <br/>
                      Host: {room.creator?.username || 'Unknown'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-subtle flex justify-between items-center text-xs text-on-surface-variant">
                      <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="group bg-surface-low border border-subtle rounded-lg p-space-lg opacity-50 flex flex-col min-h-[220px] items-center justify-center">
                <p className="font-body-sm text-on-surface-variant text-center">No past sessions to display.</p>
              </div>
            )}
            
            {/* Activity Feed Empty State (Bento expansion) */}
            <div className="md:col-span-2 lg:col-span-1 bg-surface-container-low border border-subtle rounded-lg p-space-lg">
              <h4 className="font-label-md text-on-surface mb-space-md flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                Recent Activity
              </h4>
              <div className="py-8 flex items-center justify-center">
                 <p className="font-body-sm text-on-surface-variant">No recent activity.</p>
              </div>
              <button disabled className="w-full mt-space-lg py-2 border border-subtle rounded font-label-sm text-on-surface-variant opacity-50 transition-all">View Full History</button>
            </div>

            {/* Collaborative Overview Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-surface-low to-surface-container border border-subtle rounded-lg p-space-lg flex items-center gap-space-xl overflow-hidden relative">
              <div className="relative z-10 flex-1">
                <h3 className="font-headline-md text-headline-md text-primary mb-2">Team Collaboration Pulse</h3>
                <p className="font-body-sm text-on-surface-variant mb-space-lg max-w-md">Your team has not completed any sessions this week. Start a new session to begin collaborating!</p>
                <div className="flex gap-space-xl">
                  <div>
                    <p className="font-headline-md text-secondary">0m</p>
                    <p className="font-caption text-on-surface-variant uppercase tracking-wider">Avg Session</p>
                  </div>
                  <div className="border-l border-subtle pl-space-xl">
                    <p className="font-headline-md text-primary">0</p>
                    <p className="font-caption text-on-surface-variant uppercase tracking-wider">Active Rooms</p>
                  </div>
                  <div className="border-l border-subtle pl-space-xl">
                    <p className="font-headline-md text-tertiary">0%</p>
                    <p className="font-caption text-on-surface-variant uppercase tracking-wider">Storage Used</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block relative z-10 w-48 h-32 bg-surface-lowest border border-subtle rounded-lg overflow-hidden shadow-2xl opacity-50">
                <div className="p-2 border-b border-subtle flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-error"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                </div>
                <div className="p-2 space-y-2">
                  <div className="h-1 bg-primary/20 rounded w-full"></div>
                  <div className="h-1 bg-primary/10 rounded w-3/4"></div>
                  <div className="h-1 bg-primary/20 rounded w-5/6"></div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Floating Action Button (Contextual) */}
        <button 
          onClick={createRoomWithPrompt}
          className="fixed bottom-space-xl right-space-xl w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group cursor-pointer">
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform">add</span>
        </button>
      </main>
    </div>
  );
}
