import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  LayoutDashboard, Users, LogOut, Plus, Search, Bell, 
  Layers, Code2, PenTool, Archive, ChevronsUpDown,
  Activity, Clock, ChevronRight, Settings
} from "lucide-react";
import { CreateRoomDialog } from "@/components/CreateRoomDialog";

// Placeholder data for Team Activity
const TEAM_ACTIVITY = [
  { id: 1, user: "Kai Patel", avatar: "https://i.pravatar.cc/150?u=kai", action: "edited auth.ts in", target: "API Gateway — v2", time: "2 min ago" },
  { id: 2, user: "Sofia Chen", avatar: "https://i.pravatar.cc/150?u=sofia", action: "added a diagram to", target: "Auth Flow Redesign", time: "15 min ago" },
  { id: 3, user: "James Carter", avatar: "https://i.pravatar.cc/150?u=james", action: "commented on", target: "Q3 Sprint Planning", time: "1h ago" },
  { id: 4, user: "Amara Osei", avatar: "https://i.pravatar.cc/150?u=amara", action: "created", target: "Onboarding Flows", time: "3h ago" }
];

export default function Home() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const isAuthenticated = !!user;
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createRoomName, setCreateRoomName] = useState("");
  const [generateMeetLink, setGenerateMeetLink] = useState(false);
  
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [roomFilter, setRoomFilter] = useState("All");

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

  const handleCreateRoom = async () => {
    if (!createRoomName.trim()) return;

    setIsCreating(true);
    
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("syncspace_token") || ""}`
        },
        body: JSON.stringify({ 
          name: createRoomName.trim(),
          projectId: null,
          generateMeetLink
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.id) {
        toast.success("Room created successfully!");
        setIsCreateModalOpen(false);
        setCreateRoomName("");
        setGenerateMeetLink(false);
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

  // Assign random types to existing rooms just for visual flair if they don't have one
  const getRoomVisualData = (room: any, index: number) => {
    const types = ["Whiteboard", "Code", "Mixed"];
    const type = types[index % 3];
    return {
      type,
      isLive: index % 4 === 0,
      avatarCount: (index % 3) + 1
    };
  };

  const filteredRooms = rooms.filter(room => {
    if (roomFilter === "All") return true;
    const { type } = getRoomVisualData(room, rooms.indexOf(room));
    return type === roomFilter;
  });

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#07050a]">
        <Spinner className="h-8 w-8 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#07050a] text-slate-200 font-body flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 bg-[#0c0a10] border-r border-white/5 flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Layers className="text-white h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">SyncSpace</h1>
        </div>
        
        <nav className="flex-1 space-y-1 px-4 mt-4">
          <a onClick={() => setActiveTab("Dashboard")} className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "Dashboard" ? "text-white bg-purple-500/10 border border-purple-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <LayoutDashboard className={`mr-3 h-4 w-4 ${activeTab === "Dashboard" ? "text-purple-400" : ""}`} />
            Dashboard
          </a>
          <a onClick={() => setActiveTab("My Rooms")} className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "My Rooms" ? "text-white bg-purple-500/10 border border-purple-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <Layers className={`mr-3 h-4 w-4 ${activeTab === "My Rooms" ? "text-purple-400" : ""}`} />
            My Rooms
          </a>
          <a onClick={() => setActiveTab("Team")} className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "Team" ? "text-white bg-purple-500/10 border border-purple-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <Users className={`mr-3 h-4 w-4 ${activeTab === "Team" ? "text-purple-400" : ""}`} />
            Team
          </a>
          
          <div className="pt-4 pb-2 px-3">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Workspaces</p>
          </div>
          
          <a onClick={() => setActiveTab("Code Spaces")} className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "Code Spaces" ? "text-white bg-purple-500/10 border border-purple-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <Code2 className={`mr-3 h-4 w-4 ${activeTab === "Code Spaces" ? "text-purple-400" : ""}`} />
            Code Spaces
          </a>
          <a onClick={() => setActiveTab("Whiteboards")} className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "Whiteboards" ? "text-white bg-purple-500/10 border border-purple-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <PenTool className={`mr-3 h-4 w-4 ${activeTab === "Whiteboards" ? "text-purple-400" : ""}`} />
            Whiteboards
          </a>
          <a onClick={() => setActiveTab("Archived")} className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "Archived" ? "text-white bg-purple-500/10 border border-purple-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <Archive className={`mr-3 h-4 w-4 ${activeTab === "Archived" ? "text-purple-400" : ""}`} />
            Archived
          </a>
        </nav>
        
        <div className="mt-auto px-4 pb-6">
          {/* Team Selector */}
          <div className="mb-4 bg-[#15121c] border border-white/5 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-[#1a1622] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-sm">N</div>
              <div>
                <p className="text-sm font-semibold text-white">Nova Studio</p>
                <p className="text-xs text-slate-400">12 members</p>
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-slate-500" />
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${user?.username || 'Mia+Tanaka'}&background=6366f1&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-white truncate">{user?.username || 'Mia Tanaka'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'mia@nova.io'}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                <Settings className="h-4 w-4" />
              </button>
              <button onClick={() => logout()} className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-400/10" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 bg-[#07050a]">
        
        {/* Header */}
        <header className="h-20 shrink-0 px-10 flex justify-between items-center bg-[#07050a]/80 backdrop-blur-md sticky top-0 z-40">
          <div>
            <h2 className="text-2xl font-headings font-bold text-white tracking-tight">Dashboard</h2>
            <p className="text-sm text-slate-400 mt-1">Good morning, {user?.username?.split(' ')[0] || 'Mia'} 👋</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search rooms..."
                className="bg-[#120f18] border border-white/5 rounded-lg pl-9 pr-12 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium font-mono">
                ⌘K
              </div>
            </div>
            
            <button className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
              <Bell className="h-4 w-4 text-slate-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border border-[#07050a]"></span>
            </button>
            
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
              style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)', boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)' }}
            >
              <Plus className="h-4 w-4" />
              New Room
            </button>
          </div>
        </header>

        <section className="p-10 flex-1 max-w-[1600px] w-full mx-auto space-y-10 pb-20">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-[#0f0c16] border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Layers className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{rooms.length > 0 ? rooms.length : 14}</h3>
                <p className="text-xs text-slate-400">Total Rooms</p>
              </div>
            </div>
            <div className="bg-[#0f0c16] border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                <Users className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">12</h3>
                <p className="text-xs text-slate-400">Team Members</p>
              </div>
            </div>
            <div className="bg-[#0f0c16] border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Activity className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">3</h3>
                <p className="text-xs text-slate-400">Active Now</p>
              </div>
            </div>
            <div className="bg-[#0f0c16] border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">48h</h3>
                <p className="text-xs text-slate-400">Hours This Week</p>
              </div>
            </div>
          </div>

          {/* Create Room Banner */}
          <div className="rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'linear-gradient(90deg, rgba(30,15,45,1) 0%, rgba(45,15,35,1) 100%)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Create a new room</h3>
                <p className="text-sm text-slate-300">Start with a blank whiteboard, a code editor, or a mixed workspace. Invite your team in seconds.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <button onClick={() => setIsCreateModalOpen(true)} className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
                <PenTool className="h-4 w-4 text-slate-400" />
                Whiteboard
              </button>
              <button onClick={() => setIsCreateModalOpen(true)} className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Code2 className="h-4 w-4 text-slate-400" />
                Code Space
              </button>
              <button onClick={() => setIsCreateModalOpen(true)} className="cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}>
                <Layers className="h-4 w-4" />
                Mixed Room
              </button>
            </div>
          </div>

          {/* Recent Rooms */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Rooms</h3>
              <div className="flex items-center gap-3">
                <div className="flex bg-[#120f18] p-1 rounded-lg border border-white/5">
                  {["All", "Whiteboard", "Code", "Mixed"].map(f => (
                    <button 
                      key={f}
                      onClick={() => setRoomFilter(f)}
                      className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${roomFilter === f ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer">
                  View all <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {isLoadingRooms ? (
              <div className="flex justify-center py-12"><Spinner className="text-purple-500 h-8 w-8" /></div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl bg-[#0f0c16]">No rooms found in this category.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRooms.map((room, idx) => {
                  const visual = getRoomVisualData(room, idx);
                  return (
                    <div 
                      key={room._id || idx} 
                      onClick={() => setLocation(`/room/${room.roomId}`)} 
                      className="bg-[#120f1a] border border-white/5 rounded-2xl overflow-hidden cursor-pointer group hover:border-purple-500/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/50"
                    >
                      <div className="h-32 bg-[#1a1625] relative flex items-center justify-center">
                        {visual.isLive && (
                          <div className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live
                          </div>
                        )}
                        {visual.type === "Whiteboard" && <PenTool className="h-10 w-10 text-purple-400/50 group-hover:scale-110 transition-transform" />}
                        {visual.type === "Code" && <Code2 className="h-10 w-10 text-cyan-400/50 group-hover:scale-110 transition-transform" />}
                        {visual.type === "Mixed" && <Layers className="h-10 w-10 text-pink-400/50 group-hover:scale-110 transition-transform" />}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-white text-sm truncate pr-2 group-hover:text-purple-300 transition-colors">{room.name}</h4>
                          <button className="text-slate-500 hover:text-white bg-white/5 rounded p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-1 mb-4 text-[10px] font-semibold">
                          {visual.type === "Whiteboard" && <PenTool className="h-3 w-3 text-purple-400" />}
                          {visual.type === "Code" && <Code2 className="h-3 w-3 text-cyan-400" />}
                          {visual.type === "Mixed" && <Layers className="h-3 w-3 text-pink-400" />}
                          <span className={visual.type === "Whiteboard" ? "text-purple-400" : visual.type === "Code" ? "text-cyan-400" : "text-pink-400"}>
                            {visual.type === "Code" ? "Code Editor" : visual.type}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                          <div className="flex -space-x-2">
                            {Array.from({length: visual.avatarCount }).map((_, i) => (
                              <img key={i} src={`https://i.pravatar.cc/150?img=${(idx * 3 + i) % 70}`} className="w-6 h-6 rounded-full border-2 border-[#120f1a] relative z-10" alt="Avatar" />
                            ))}
                            {visual.avatarCount > 1 && (
                              <div className="w-6 h-6 rounded-full border-2 border-[#120f1a] bg-[#2a2438] flex items-center justify-center text-[8px] text-white relative z-0">
                                +1
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {visual.isLive ? 'Just now' : '2 hours ago'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Team Activity */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Team Activity</h3>
            <div className="bg-[#0f0c16] border border-white/5 rounded-2xl overflow-hidden">
              {TEAM_ACTIVITY.map((activity, index) => (
                <div key={activity.id} className={`flex items-center justify-between p-4 px-6 hover:bg-white/[0.02] transition-colors ${index !== TEAM_ACTIVITY.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-center gap-4">
                    <img src={activity.avatar} className="w-8 h-8 rounded-full" alt={activity.user} />
                    <p className="text-sm">
                      <span className="font-bold text-white">{activity.user}</span>{' '}
                      <span className="text-slate-400">{activity.action}</span>{' '}
                      <span className="font-semibold text-purple-400">{activity.target}</span>
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
          
        </section>
      </main>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none [&>button]:hidden sm:max-w-4xl lg:max-w-5xl">
          <DialogTitle className="sr-only">Create New Session</DialogTitle>
          <CreateRoomDialog
            createRoomName={createRoomName}
            setCreateRoomName={setCreateRoomName}
            generateMeetLink={generateMeetLink}
            setGenerateMeetLink={setGenerateMeetLink}
            handleCreateRoom={handleCreateRoom}
            onClose={() => setIsCreateModalOpen(false)}
            isCreating={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
