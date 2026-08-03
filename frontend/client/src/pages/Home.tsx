import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  LayoutDashboard, Users, LogOut, Plus, Search, Bell, 
  Layers, Code2, PenTool, Archive, ChevronsUpDown,
  Activity, Clock, ChevronRight, Settings, Grid, List, Tag, MoreHorizontal, Info,
  MessageSquare, UserPlus, User, Briefcase, CreditCard, Plug, Shield, Upload
} from "lucide-react";
import { CreateRoomDialog } from "@/components/CreateRoomDialog";
import { InviteMemberDialog } from "@/components/InviteMemberDialog";

// Placeholder data for Team Activity
const TEAM_ACTIVITY: any[] = [];

const TEAM_MEMBERS: any[] = [];

const CODE_FILES: any[] = [];

const WHITEBOARDS: any[] = [];

const ARCHIVED_ROOMS: any[] = [];

const NOTIFICATIONS: any[] = [];

const renderWhiteboardThumbnail = (type: string) => {
  switch (type) {
    case 'auth':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2 pt-6">
          <div className="flex gap-4">
            <div className="w-16 h-8 bg-purple-500 rounded"></div>
            <div className="w-16 h-8 bg-pink-400 rounded"></div>
          </div>
          <div className="w-16 h-8 bg-cyan-500 rounded mt-2"></div>
        </div>
      );
    case 'docs':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2 pt-6">
          <div className="w-24 h-3 bg-purple-500 rounded-full"></div>
          <div className="w-20 h-2 bg-white/10 rounded-full mt-2"></div>
          <div className="w-16 h-2 bg-white/10 rounded-full"></div>
        </div>
      );
    case 'circles':
      return (
        <div className="flex items-center justify-center h-full gap-4 pt-6">
          <div className="w-10 h-10 rounded-full bg-purple-500"></div>
          <div className="w-10 h-10 rounded-full bg-pink-400"></div>
          <div className="w-10 h-10 rounded-full bg-cyan-500"></div>
        </div>
      );
    case 'lines':
      return (
        <div className="flex flex-col justify-center h-full pl-20 gap-3 pt-6">
          <div className="w-32 h-3 bg-white/5 rounded-full"></div>
          <div className="w-24 h-4 bg-purple-500 rounded-full"></div>
          <div className="w-16 h-3 bg-pink-400 rounded-full"></div>
        </div>
      );
    case 'blocks':
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2 pt-6">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg"></div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg"></div>
          </div>
          <div className="w-12 h-12 bg-purple-500 rounded-lg"></div>
        </div>
      );
    case 'dots':
      return (
        <div className="flex items-center justify-center h-full gap-3 pt-6">
          <div className="w-8 h-8 rounded-full bg-purple-500"></div>
          <div className="w-8 h-8 rounded-full bg-pink-400"></div>
          <div className="w-8 h-8 rounded-full bg-cyan-500"></div>
          <div className="w-8 h-8 rounded-full bg-emerald-500"></div>
        </div>
      );
    default:
      return null;
  }
};

const getTimeString = (idx: number, isLive: boolean) => {
  if (isLive) return "Just now";
  if (idx === 1) return "1h ago";
  if (idx === 2) return "3h ago";
  if (idx === 3) return "Yesterday";
  if (idx === 4) return "2 days ago";
  if (idx === 5) return "3 days ago";
  if (idx === 6) return "4 days ago";
  return "1 week ago";
};

const RoomCard = ({ room, idx, onClick, isLiveOverride }: any) => {
  const types = ["Whiteboard", "Code", "Mixed"];
  const type = types[idx % 3];
  const isLive = isLiveOverride !== undefined ? isLiveOverride : (idx % 4 === 0);
  const avatarCount = (idx % 3) + 1;
  
  const bgColors: any = {
    "Whiteboard": "bg-[#25143a]",
    "Code": "bg-[#0c282f]",
    "Mixed": "bg-[#351515]"
  };
  
  const iconColors: any = {
    "Whiteboard": "text-[#9d4edd]",
    "Code": "text-[#06b6d4]",
    "Mixed": "text-[#f97316]"
  };

  const Icon = type === "Whiteboard" ? PenTool : type === "Code" ? Code2 : Layers;
  
  return (
    <div 
      onClick={onClick} 
      className="bg-[#1a1721] border border-white/5 rounded-xl overflow-hidden cursor-pointer group hover:border-white/10 transition-all shadow-lg"
    >
      <div className={`h-[140px] ${bgColors[type]} relative flex items-center justify-center`}>
        {isLive && (
          <div className="absolute top-4 left-4 bg-[#0a2e22]/80 backdrop-blur text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Live
          </div>
        )}
        <button className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-white/50 hover:text-white transition-colors hover:bg-black/40">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        
        <Icon className={`h-9 w-9 ${iconColors[type]} opacity-90`} strokeWidth={1.5} />
      </div>
      <div className="p-4 bg-[#1e1b27]">
        <h4 className="font-bold text-white text-[13px] mb-1 truncate group-hover:text-purple-300 transition-colors">{room.name}</h4>
        <div className="flex items-center gap-1.5 mb-5">
          <Tag className={`w-3.5 h-3.5 ${iconColors[type]}`} />
          <span className={`text-[11px] font-medium ${iconColors[type]}`}>
            {type === "Code" ? "Code Editor" : type}
          </span>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex -space-x-1.5">
            {Array.from({length: avatarCount }).map((_, i) => (
              <img key={i} src={`https://i.pravatar.cc/150?img=${(idx * 3 + i) % 70}`} className="w-6 h-6 rounded-full border-2 border-[#1e1b27] relative z-10" alt="Avatar" />
            ))}
            {avatarCount > 1 && (
              <div className="w-6 h-6 rounded-full border-2 border-[#1e1b27] bg-[#2a2438] flex items-center justify-center text-[9px] text-white font-medium relative z-0">
                +{avatarCount}
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {getTimeString(idx, isLive)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const isAuthenticated = !!user;
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
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
              <button onClick={() => setActiveTab("Settings")} className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
                <Settings className="h-4 w-4" />
              </button>
              <button onClick={() => logout()} className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-400/10 cursor-pointer" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 bg-[#07050a]">
        
        {activeTab === "Dashboard" && (
          <>
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
                
                <button onClick={() => setActiveTab("Notifications")} className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer">
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
                    {filteredRooms.map((room, idx) => (
                      <RoomCard key={room._id || idx} room={room} idx={rooms.indexOf(room)} onClick={() => setLocation(`/room/${room.roomId}`)} />
                    ))}
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
          </>
        )}

        {activeTab === "My Rooms" && (
          <>
            <header className="h-24 shrink-0 px-10 flex justify-between items-center bg-[#07050a]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
              <div>
                <h2 className="text-[28px] font-headings font-bold text-white tracking-tight">My Rooms</h2>
                <p className="text-sm text-[#7e85a0] font-medium mt-1">All your workspaces in one place</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search rooms..."
                    className="bg-[#120f18] border border-white/5 rounded-lg pl-9 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium font-mono">
                    ⌘K
                  </div>
                </div>
                
                <button className="relative p-2.5 rounded-full bg-[#120f18] hover:bg-white/5 border border-white/5 transition-colors">
                  <Bell className="h-4 w-4 text-slate-300" />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-[#07050a] flex items-center justify-center text-[8px] font-bold text-white">3</span>
                </button>
                
                <button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="text-sm font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-purple-500/20"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Room
                </button>
              </div>
            </header>

            <section className="p-10 flex-1 max-w-[1600px] w-full mx-auto space-y-10 pb-20">
              {/* Filters & Search */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {["All", "Whiteboard", "Code", "Mixed", "Live"].map(f => (
                    <button 
                      key={f}
                      onClick={() => setRoomFilter(f)}
                      className={`px-4 py-1.5 rounded-md text-[13px] font-semibold border transition-colors ${
                        roomFilter === f 
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' 
                          : 'bg-transparent text-slate-400 border-white/5 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search rooms..."
                      className="bg-[#120f18] border border-white/5 rounded-md pl-9 pr-4 py-1.5 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-56"
                    />
                  </div>
                  <div className="flex bg-[#120f18] p-1 rounded-md border border-white/5 gap-1">
                    <button className="p-1 rounded bg-purple-500/20 text-purple-300">
                      <Grid className="w-4 h-4" />
                    </button>
                    <button className="p-1 rounded text-slate-500 hover:text-white">
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {isLoadingRooms ? (
                <div className="flex justify-center py-12"><Spinner className="text-purple-500 h-8 w-8" /></div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl bg-[#0f0c16]">No rooms found. Create one to get started!</div>
              ) : (
                <>
                  {/* Active Now Section */}
                  {(roomFilter === "All" || roomFilter === "Live") && (
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-5">ACTIVE NOW</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         {rooms.slice(0, 2).map((room, idx) => (
                            <RoomCard key={room._id || idx} room={room} idx={idx} isLiveOverride={true} onClick={() => setLocation(`/room/${room.roomId}`)} />
                         ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Section */}
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-5">RECENT</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {rooms.slice(2).filter((r) => {
                         if(roomFilter === "All" || roomFilter === "Live") return true;
                         const type = ["Whiteboard", "Code", "Mixed"][rooms.indexOf(r) % 3];
                         return type === roomFilter;
                       }).map((room) => {
                          const actualIdx = rooms.indexOf(room);
                          return (
                            <RoomCard key={room._id || actualIdx} room={room} idx={actualIdx} isLiveOverride={false} onClick={() => setLocation(`/room/${room.roomId}`)} />
                          );
                       })}
                    </div>
                  </div>
                </>
              )}
            </section>
          </>
        )}

        {activeTab === "Team" && (
          <>
            <header className="h-24 shrink-0 px-10 flex justify-between items-center bg-[#07050a]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
              <div>
                <h2 className="text-[28px] font-headings font-bold text-white tracking-tight">Team</h2>
                <p className="text-sm text-[#7e85a0] font-medium mt-1">Nova Studio · 12 members</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search rooms..."
                    className="bg-[#120f18] border border-white/5 rounded-lg pl-9 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium font-mono">
                    ⌘K
                  </div>
                </div>
                
                <button className="relative p-2.5 rounded-full bg-[#120f18] hover:bg-white/5 border border-white/5 transition-colors">
                  <Bell className="h-4 w-4 text-slate-300" />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-[#07050a] flex items-center justify-center text-[8px] font-bold text-white">3</span>
                </button>
                
                <button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="text-sm font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-purple-500/20"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Room
                </button>
              </div>
            </header>

            <section className="p-10 flex-1 max-w-[1600px] w-full mx-auto pb-20">
              {/* Top Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search members..."
                      className="bg-[#15121c] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                    />
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-[#15121c] border border-white/5 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer">
                      <option>All roles</option>
                      <option>Admin</option>
                      <option>Member</option>
                      <option>Viewer</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="text-[13px] font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-purple-500/10"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)' }}
                >
                  <Users className="h-4 w-4" />
                  Invite Member
                </button>
              </div>

              {/* Table */}
              <div className="bg-[#15121c] border border-white/5 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                  <div className="col-span-4">Member</div>
                  <div className="col-span-3">Role</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2 text-right pr-6">Actions</div>
                </div>
                
                <div className="divide-y divide-white/5">
                  {TEAM_MEMBERS.map((member) => (
                    <div key={member.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group">
                      {/* Member Info */}
                      <div className="col-span-4 flex items-center gap-4">
                        <div className="relative">
                          <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover" />
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#15121c] ${member.status === 'Online' ? 'bg-emerald-500' : member.status === 'Away' ? 'bg-orange-500' : 'bg-slate-500'}`}></div>
                        </div>
                        <div>
                          <div className="font-bold text-white text-[13px] flex items-center gap-2">
                            {member.name}
                            {member.name === "Kai Patel" && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">{member.email}</div>
                        </div>
                      </div>
                      
                      {/* Role */}
                      <div className="col-span-3 flex items-center">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          member.role === 'Admin' ? 'bg-purple-500/10 text-purple-400' : 
                          member.role === 'Member' ? 'bg-white/5 text-slate-400' : 
                          'bg-white/5 text-slate-500'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-3 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Online' ? 'bg-emerald-500' : member.status === 'Away' ? 'bg-orange-500' : 'bg-slate-500'}`}></div>
                        <span className={`text-[12px] ${member.status === 'Online' ? 'text-slate-300' : 'text-slate-500'}`}>{member.status}</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1.5 rounded-md border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                          Manage
                        </button>
                        <button className="p-1.5 rounded-md border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "Code Spaces" && (
          <div className="flex flex-col h-[calc(100vh-theme(space.6)-theme(space.6))]">
            <header className="h-24 shrink-0 px-10 flex justify-between items-center bg-[#07050a]/80 backdrop-blur-md border-b border-white/5">
              <div>
                <h2 className="text-[28px] font-headings font-bold text-white tracking-tight">Code Spaces</h2>
                <p className="text-sm text-[#7e85a0] font-medium mt-1">API Gateway — v2</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search rooms..."
                    className="bg-[#120f18] border border-white/5 rounded-lg pl-9 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium font-mono">
                    ⌘K
                  </div>
                </div>
                
                <button className="relative p-2.5 rounded-full bg-[#120f18] hover:bg-white/5 border border-white/5 transition-colors">
                  <Bell className="h-4 w-4 text-slate-300" />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-[#07050a] flex items-center justify-center text-[8px] font-bold text-white">3</span>
                </button>
                
                <button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="text-sm font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-purple-500/20"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Room
                </button>
              </div>
            </header>

            <div className="flex flex-1 overflow-hidden h-full">
              {/* Left Sidebar */}
              <div className="w-72 flex flex-col bg-[#110e15] border-r border-white/5 shrink-0 h-full">
                <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
                  <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Files</h3>
                  <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  {CODE_FILES.map((file, idx) => (
                    <div 
                      key={file.id} 
                      className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-colors ${idx === 0 ? 'bg-purple-500/10 border-l-2 border-purple-500' : 'hover:bg-white/[0.02] border-l-2 border-transparent'}`}
                    >
                      <div className={`p-1.5 rounded bg-white/5 ${idx === 0 ? 'text-purple-400' : 'text-slate-400'}`}>
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-[13px] font-semibold ${idx === 0 ? 'text-white' : 'text-slate-300'}`}>{file.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{file.lines} lines</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor Area */}
              <div className="flex-1 flex flex-col bg-[#0b0810] h-full">
                {/* Editor Tabs */}
                <div className="flex bg-[#0f0c16] border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-2 px-5 py-3 border-b-2 border-purple-500 bg-white/[0.02]">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-[13px] font-bold text-white">auth.ts</span>
                    <button className="text-slate-400 hover:text-white ml-2 cursor-pointer"><span className="text-[10px]">✕</span></button>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 border-b-2 border-transparent hover:bg-white/[0.01] cursor-pointer">
                    <Code2 className="w-4 h-4 text-slate-500" />
                    <span className="text-[13px] font-medium text-slate-400">routes.ts</span>
                    <button className="text-slate-500 hover:text-white ml-2 cursor-pointer"><span className="text-[10px]">✕</span></button>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-auto relative p-6">
                  <div className="flex font-mono text-[13px] leading-relaxed">
                    <div className="text-slate-600 select-none pr-6 text-right w-12 flex flex-col">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))}
                    </div>
                    <div className="whitespace-pre flex flex-col">
                      <span className="text-blue-400">import <span className="text-slate-300">{"{ Router }"}</span> from <span className="text-green-400">'express'</span>;</span>
                      <span className="text-blue-400">import <span className="text-slate-300">{"{ authenticate }"}</span> from <span className="text-green-400">'./middleware'</span>;</span>
                      <span className="text-blue-400">import <span className="text-slate-300">{"{ UserController }"}</span> from <span className="text-green-400">'./controllers/user'</span>;</span>
                      <span></span>
                      <span className="text-blue-400">const <span className="text-slate-300">router</span> = <span className="text-yellow-200">Router</span>();</span>
                      <span></span>
                      <span className="text-slate-500">// Auth routes</span>
                      <span className="text-slate-300">router.<span className="text-yellow-200">post</span>(<span className="text-green-400">'/auth/login'</span>, UserController.login);</span>
                      <span className="text-slate-300">router.<span className="text-yellow-200">post</span>(<span className="text-green-400">'/auth/register'</span>, UserController.register);</span>
                      <span className="text-slate-300">router.<span className="text-yellow-200">post</span>(<span className="text-green-400">'/auth/logout'</span>, authenticate, UserController.logout);</span>
                      <span></span>
                      <span className="text-slate-500">// User routes</span>
                      <span className="text-slate-300">router.<span className="text-yellow-200">get</span>(<span className="text-green-400">'/users/me'</span>, authenticate, UserController.getMe);</span>
                      <span className="text-slate-300">router.<span className="text-yellow-200">put</span>(<span className="text-green-400">'/users/me'</span>, authenticate, UserController.updateMe);</span>
                      <span></span>
                      <span className="text-blue-400">export default <span className="text-slate-300">router</span>;</span>
                    </div>
                  </div>
                </div>

                {/* Editor Status Bar */}
                <div className="h-12 bg-[#0f0c16] border-t border-white/5 flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-500 font-semibold">TypeScript</span>
                    <span className="text-xs text-slate-500 font-semibold">UTF-8</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-emerald-500 font-semibold">2 collaborators</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <img src="https://i.pravatar.cc/150?u=mia" alt="Mia" className="w-6 h-6 rounded-full border-2 border-[#0f0c16]" />
                      <img src="https://i.pravatar.cc/150?u=kai" alt="Kai" className="w-6 h-6 rounded-full border-2 border-[#0f0c16]" />
                    </div>
                    <button 
                      className="text-xs font-bold px-4 py-1.5 rounded text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-purple-500/20"
                      style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      Run
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Whiteboards" && (
          <>
            <header className="h-24 shrink-0 px-10 flex justify-between items-center bg-[#07050a]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
              <div>
                <h2 className="text-[28px] font-headings font-bold text-white tracking-tight">Whiteboards</h2>
                <p className="text-sm text-[#7e85a0] font-medium mt-1">Visual collaboration boards</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search rooms..."
                    className="bg-[#120f18] border border-white/5 rounded-lg pl-9 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium font-mono">
                    ⌘K
                  </div>
                </div>
                
                <button className="relative p-2.5 rounded-full bg-[#120f18] hover:bg-white/5 border border-white/5 transition-colors">
                  <Bell className="h-4 w-4 text-slate-300" />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-[#07050a] flex items-center justify-center text-[8px] font-bold text-white">3</span>
                </button>
                
                <button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="text-sm font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-purple-500/20"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Room
                </button>
              </div>
            </header>

            <section className="p-10 flex-1 max-w-[1600px] w-full mx-auto pb-20">
              {/* Top Controls */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search boards..."
                      className="bg-[#15121c] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-[#15121c] border border-white/5 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors text-slate-300 text-[13px] font-semibold cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    Filter
                  </button>
                </div>
                <button 
                  className="text-[13px] font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-purple-500/10"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Board
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WHITEBOARDS.map((board) => (
                  <div key={board.id} className="group bg-[#15121c] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer flex flex-col">
                    <div className="h-48 bg-[#1a1625] relative">
                      <button className="absolute top-4 right-4 p-1.5 rounded-full bg-[#15121c]/50 text-slate-400 hover:text-white hover:bg-[#15121c] transition-colors opacity-0 group-hover:opacity-100 backdrop-blur cursor-pointer z-10">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {renderWhiteboardThumbnail(board.shapes)}
                    </div>
                    <div className="p-5 flex justify-between items-end">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{board.title}</h3>
                        <p className="text-[11px] text-slate-500">{board.edited}</p>
                      </div>
                      <div className="flex -space-x-2">
                        {board.avatars?.map((avatar: string, i: number) => (
                          <img key={i} src={avatar} alt="Collaborator" className="w-6 h-6 rounded-full border-2 border-[#15121c]" />
                        ))}
                        {board.extraCount > 0 && (
                          <div className="w-6 h-6 rounded-full border-2 border-[#15121c] bg-purple-500/20 text-purple-400 flex items-center justify-center text-[9px] font-bold">
                            +{board.extraCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "Archived" && (
          <>
            <header className="h-24 shrink-0 px-10 flex justify-between items-center bg-[#07050a]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
              <div>
                <h2 className="text-[28px] font-headings font-bold text-white tracking-tight">Archived</h2>
                <p className="text-sm text-[#7e85a0] font-medium mt-1">Rooms you've archived</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search rooms..."
                    className="bg-[#120f18] border border-white/5 rounded-lg pl-9 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium font-mono">
                    ⌘K
                  </div>
                </div>
                
                <button className="relative p-2.5 rounded-full bg-[#120f18] hover:bg-white/5 border border-white/5 transition-colors">
                  <Bell className="h-4 w-4 text-slate-300" />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-[#07050a] flex items-center justify-center text-[8px] font-bold text-white">3</span>
                </button>
                
                <button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="text-sm font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-purple-500/20"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Room
                </button>
              </div>
            </header>

            <section className="p-10 flex-1 max-w-[1600px] w-full mx-auto pb-20">
              {/* Top Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search archived..."
                    className="bg-[#15121c] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-72"
                  />
                </div>
                <div className="relative">
                  <select className="appearance-none bg-[#15121c] border border-white/5 rounded-lg pl-4 pr-10 py-2.5 text-[13px] text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer">
                    <option>All types</option>
                    <option>Code Editor</option>
                    <option>Whiteboard</option>
                    <option>Mixed</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Notice Banner */}
              <div className="bg-[#15121c] border border-white/5 rounded-xl p-4 flex items-center gap-3 mb-8">
                <Info className="w-5 h-5 text-slate-400" />
                <p className="text-[13px] text-slate-400">Archived rooms are read-only. Restore a room to edit it again.</p>
              </div>

              {/* Table */}
              <div className="bg-[#15121c] border border-white/5 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                  <div className="col-span-5">Room Name</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2">Archived On</div>
                  <div className="col-span-2 text-right pr-2">Actions</div>
                </div>
                
                <div className="divide-y divide-white/5">
                  {ARCHIVED_ROOMS.map((room) => (
                    <div key={room.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group">
                      {/* Room Name */}
                      <div className="col-span-5 flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg border border-white/5 ${room.bgIcon} ${room.typeColor}`}>
                          <room.typeIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-[14px]">{room.title}</div>
                          <div className="text-slate-500 text-[12px] mt-0.5">{room.members}</div>
                        </div>
                      </div>
                      
                      {/* Type */}
                      <div className="col-span-3 flex items-center gap-2">
                        <room.typeIcon className={`w-4 h-4 ${room.typeColor}`} />
                        <span className={`text-[13px] font-medium ${room.typeColor}`}>{room.type}</span>
                      </div>
                      
                      {/* Date */}
                      <div className="col-span-2 flex items-center">
                        <span className="text-[13px] text-slate-400">{room.date}</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button className="px-4 py-1.5 rounded-md border border-purple-500/30 text-[12px] font-bold text-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer">
                          Restore
                        </button>
                        <button className="px-4 py-1.5 rounded-md border border-white/10 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "Notifications" && (
          <>
            <header className="h-24 shrink-0 px-10 flex justify-between items-center bg-[#07050a]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
              <div>
                <h2 className="text-[28px] font-headings font-bold text-white tracking-tight">Notifications</h2>
                <p className="text-sm text-[#7e85a0] font-medium mt-1">3 unread notifications</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search rooms..."
                    className="bg-[#120f18] border border-white/5 rounded-lg pl-9 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium font-mono">
                    ⌘K
                  </div>
                </div>
                
                <button className="relative p-2.5 rounded-full bg-[#120f18] hover:bg-white/5 border border-white/5 transition-colors cursor-pointer">
                  <Bell className="h-4 w-4 text-slate-300" />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-[#07050a] flex items-center justify-center text-[8px] font-bold text-white">3</span>
                </button>
                
                <button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="text-sm font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-purple-500/20"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Room
                </button>
              </div>
            </header>

            <section className="p-10 flex-1 max-w-[1600px] w-full mx-auto pb-20">
              {/* Sub-header / Tabs */}
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-6">
                  <button className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[13px] font-bold">All</button>
                  <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-300 transition-colors">Unread</button>
                  <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-300 transition-colors">Mentions</button>
                </div>
                <button className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors cursor-pointer">
                  Mark all as read
                </button>
              </div>

              {/* Notifications List */}
              <div className="bg-[#15121c] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                {NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className={`p-3 rounded-xl border border-white/5 ${notif.bgIcon}`}>
                      <notif.icon className={`w-4 h-4 ${notif.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold text-white mb-0.5 group-hover:text-purple-300 transition-colors">{notif.text}</h4>
                      <p className="text-[12px] text-slate-500">{notif.subtext}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-slate-500 font-medium">{notif.time}</span>
                      {notif.unread ? (
                        <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "Settings" && (
          <>
            <header className="h-24 shrink-0 px-10 flex justify-between items-center bg-[#07050a]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
              <div>
                <h2 className="text-[28px] font-headings font-bold text-white tracking-tight">Settings</h2>
                <p className="text-sm text-[#7e85a0] font-medium mt-1">Manage your account and workspace</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search rooms..."
                    className="bg-[#120f18] border border-white/5 rounded-lg pl-9 pr-12 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-64"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 rounded px-1.5 py-0.5 text-[10px] text-slate-400 font-medium font-mono">
                    ⌘K
                  </div>
                </div>
                
                <button onClick={() => setActiveTab("Notifications")} className="relative p-2.5 rounded-full bg-[#120f18] hover:bg-white/5 border border-white/5 transition-colors cursor-pointer">
                  <Bell className="h-4 w-4 text-slate-300" />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 rounded-full border-2 border-[#07050a] flex items-center justify-center text-[8px] font-bold text-white">3</span>
                </button>
                
                <button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  className="text-sm font-semibold px-4 py-2.5 rounded-lg text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-purple-500/20"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Room
                </button>
              </div>
            </header>

            <section className="flex-1 flex w-full h-[calc(100vh-96px)] pb-20 relative">
              {/* Settings Sidebar */}
              <div className="w-64 shrink-0 p-8 border-r border-white/5 h-full overflow-y-auto">
                <nav className="flex flex-col gap-2">
                  <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-purple-500/10 text-purple-400 font-medium text-[13px] text-left">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium text-[13px] text-left cursor-pointer">
                    <Briefcase className="w-4 h-4" />
                    Workspace
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium text-[13px] text-left cursor-pointer">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium text-[13px] text-left cursor-pointer mt-4">
                    <CreditCard className="w-4 h-4" />
                    Billing
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium text-[13px] text-left cursor-pointer">
                    <Plug className="w-4 h-4" />
                    Integrations
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors font-medium text-[13px] text-left cursor-pointer">
                    <Shield className="w-4 h-4" />
                    Security
                  </button>
                </nav>
              </div>

              {/* Main Profile Settings */}
              <div className="flex-1 p-8 max-w-4xl h-full overflow-y-auto">
                <h3 className="text-[16px] font-bold text-white mb-8">Profile Settings</h3>

                {/* Profile Photo */}
                <div className="bg-[#15121c] border border-white/5 rounded-2xl p-6 mb-6">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Profile Photo</h4>
                  <div className="flex items-center gap-6">
                    <img src="https://i.pravatar.cc/150?u=mia" alt="Mia Tanaka" className="w-16 h-16 rounded-full border-2 border-[#1a1625]" />
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors text-[13px] font-bold border border-purple-500/20 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload photo
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors text-[13px] font-bold border border-white/5 cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-[#15121c] border border-white/5 rounded-2xl p-6 mb-6">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-6">Personal Info</h4>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-2">First name</label>
                      <input 
                        type="text" 
                        defaultValue="Mia"
                        className="w-full bg-[#1a1721] border border-white/5 rounded-lg px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-2">Last name</label>
                      <input 
                        type="text" 
                        defaultValue="Tanaka"
                        className="w-full bg-[#1a1721] border border-white/5 rounded-lg px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-[11px] text-slate-400 mb-2">Email address</label>
                    <input 
                      type="email" 
                      defaultValue="mia@nova.io"
                      className="w-full bg-[#1a1721] border border-white/5 rounded-lg px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-2">Job title</label>
                    <input 
                      type="text" 
                      defaultValue="Product Designer"
                      className="w-full bg-[#1a1721] border border-white/5 rounded-lg px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-[#15121c] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                  <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-4 ml-1">Danger Zone</h4>
                  <div className="flex items-center justify-between ml-1">
                    <div>
                      <h5 className="text-[14px] font-bold text-white mb-1">Delete account</h5>
                      <p className="text-[12px] text-slate-500">Permanently delete your account and all data.</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-[13px] font-bold hover:bg-red-500/10 transition-colors cursor-pointer">
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Save Changes button */}
              <div className="absolute bottom-8 right-8 z-50">
                <button 
                  className="px-6 py-2.5 rounded-xl text-white text-[13px] font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)' }}
                >
                  Save changes
                </button>
              </div>
            </section>
          </>
        )}
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

      <InviteMemberDialog 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
