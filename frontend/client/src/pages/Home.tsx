import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  LayoutDashboard, Layout, History, Users, LogOut, 
  Plus, FolderPlus, FolderKanban, ChevronRight, ArrowLeft, LogIn, Code2
} from "lucide-react";

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
  const [topNavTab, setTopNavTab] = useState("Dashboard");

  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const today = new Date().toDateString();
  const todayRooms = rooms.filter((r) => !r.project && new Date(r.createdAt).toDateString() === today);
  const historyRooms = rooms.filter((r) => !r.project && new Date(r.createdAt).toDateString() !== today);
  const displayRooms = activeTab === "Dashboard" ? todayRooms : historyRooms;

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

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("syncspace_token") || ""}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    
    fetchProjects();
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
          projectId: activeProject ? activeProject._id : null,
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

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (!joinRoomId.trim()) return;
    setIsJoining(true);

    try {
      const res = await fetch(`/api/rooms/${joinRoomId.trim()}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("syncspace_token") || ""}`
        }
      });
      
      const data = await res.json();
      
      if (res.ok && data.id) {
        toast.success("Joined session successfully!");
        setIsJoinModalOpen(false);
        setJoinRoomId("");
        setLocation(`/room/${data.id}`);
      } else {
        toast.error(data.error || data.msg || "Session not found or failed to join");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsJoining(false);
    }
  };


  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }
    
    setIsCreatingProject(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("syncspace_token") || ""}`
        },
        body: JSON.stringify({ name: newProjectName })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || data.error || 'Failed to create project');
      }
      
      toast.success("Project created successfully!");
      setProjects([data, ...projects]);
      setIsCreateProjectModalOpen(false);
      setNewProjectName("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreatingProject(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <Spinner className="h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="dark bg-[#050505] min-h-screen text-slate-200 font-['Geist'] flex relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-gentle"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-gentle" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white/[0.02] backdrop-blur-xl border-r border-white/10 flex flex-col py-8 z-50">
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code2 className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SyncSpace</h1>
            <p className="text-xs text-blue-400 font-medium">Enterprise Plan</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isCreating}
          className="mx-6 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all group cursor-pointer border border-white/10">
          {isCreating ? (
            <Spinner className="h-4 w-4 text-white" />
          ) : (
            <Plus className="h-5 w-5 opacity-90 group-hover:scale-110 transition-transform" />
          )}
          New Session
        </button>
        
        <nav className="flex-1 space-y-1.5 px-3">
          <a onClick={() => { setActiveTab("Dashboard"); setTopNavTab("Dashboard"); }} className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "Dashboard" ? "text-white bg-white/10 shadow-sm border border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <LayoutDashboard className={`mr-3 h-4 w-4 ${activeTab === "Dashboard" ? "text-blue-400" : ""}`} />
            Dashboard
          </a>
          <a onClick={() => setActiveTab("Workspace")} className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "Workspace" ? "text-white bg-white/10 shadow-sm border border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <Layout className={`mr-3 h-4 w-4 ${activeTab === "Workspace" ? "text-blue-400" : ""}`} />
            Workspace
          </a>
          <a onClick={() => setActiveTab("History")} className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "History" ? "text-white bg-white/10 shadow-sm border border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <History className={`mr-3 h-4 w-4 ${activeTab === "History" ? "text-blue-400" : ""}`} />
            History
          </a>
          <a onClick={() => setActiveTab("Team")} className={`flex items-center px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${activeTab === "Team" ? "text-white bg-white/10 shadow-sm border border-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <Users className={`mr-3 h-4 w-4 ${activeTab === "Team" ? "text-blue-400" : ""}`} />
            Team
          </a>
        </nav>
        
        <div className="mt-auto px-6">
          <div className="glass-panel rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-inner">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.username || 'User'}</p>
            </div>
            <button onClick={() => logout()} className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-400/10" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] flex flex-col flex-1 min-h-screen relative z-10">
        
        <header className="h-16 px-8 flex justify-between items-center bg-white/[0.01] backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              <a className={`text-sm font-medium cursor-pointer transition-all ${topNavTab === "Projects" ? "text-white text-glow" : "text-slate-400 hover:text-white"}`} onClick={() => { setTopNavTab("Projects"); setActiveProject(null); setActiveTab("Workspace"); }}>Projects</a>
              <a className="text-sm font-medium text-slate-400 hover:text-white transition-all cursor-pointer" onClick={() => toast.info('Shared sessions coming soon')}>Shared</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCreateModalOpen(true)} disabled={isCreating} className="text-sm font-medium px-4 py-1.5 glass-button text-white rounded-lg cursor-pointer flex items-center gap-2 border border-white/10">
              <Plus className="h-4 w-4 text-blue-400" />
              Go Live
            </button>
          </div>
        </header>

        <section className="p-8 md:p-12 flex-1 max-w-[1400px] mx-auto w-full overflow-y-auto">
          {topNavTab === "Projects" ? (
            <>
              {activeProject ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-8 text-slate-400">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer" onClick={() => setActiveProject(null)}>
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-medium cursor-pointer hover:text-white transition-colors" onClick={() => setActiveProject(null)}>Projects</span>
                    <ChevronRight className="h-4 w-4" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">{activeProject.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div onClick={() => setIsCreateModalOpen(true)} className="glass-card rounded-2xl p-6 flex flex-col min-h-[220px] cursor-pointer items-center justify-center text-center group border-dashed border-white/20">
                      <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-all duration-300 shadow-inner border border-white/5">
                         <Plus className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">New Session</h3>
                    </div>
                    {rooms.filter((r) => r.project === activeProject._id).map((room: any) => (
                      <div key={room._id} onClick={() => setLocation(`/room/${room.roomId}`)} className="glass-card rounded-2xl p-6 flex flex-col min-h-[220px] cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                          <Code2 className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{room.name}</h3>
                        <p className="text-xs text-slate-400 mt-auto flex items-center gap-1">
                           <History className="h-3 w-3" /> Updated recently
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Your Projects</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div onClick={() => setIsCreateProjectModalOpen(true)} className="glass-card rounded-2xl p-6 flex flex-col min-h-[180px] cursor-pointer items-center justify-center text-center group border-dashed border-white/20">
                      <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-indigo-500/20 flex items-center justify-center mb-3 transition-all duration-300 shadow-inner border border-white/5">
                        <FolderPlus className="h-6 w-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">Create Project</h3>
                    </div>
                    {projects.map((project: any) => (
                      <div key={project._id} onClick={() => setActiveProject(project)} className="glass-card rounded-2xl p-6 flex flex-col min-h-[180px] cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
                          <FolderKanban className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{project.name}</h3>
                        <p className="text-xs text-slate-400 mt-auto">{rooms.filter((r) => r.project === project._id).length} sessions</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-8">
                {activeTab === "Dashboard" ? "Recent Sessions" : `${activeTab} Sessions`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeTab === "Dashboard" && (
                  <>
                    <div onClick={() => setIsCreateModalOpen(true)} className="glass-card rounded-2xl p-6 flex flex-col min-h-[220px] cursor-pointer items-center justify-center text-center group border-dashed border-white/20">
                      <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-all duration-300 shadow-inner border border-white/5">
                        <Plus className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">New Session</h3>
                    </div>
                    <div onClick={() => setIsJoinModalOpen(true)} className="glass-card rounded-2xl p-6 flex flex-col min-h-[220px] cursor-pointer items-center justify-center text-center group border-dashed border-white/20">
                      <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-purple-500/20 flex items-center justify-center mb-4 transition-all duration-300 shadow-inner border border-white/5">
                        <LogIn className="h-6 w-6 text-slate-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">Join Session</h3>
                    </div>
                  </>
                )}
                {displayRooms.map((room: any) => (
                  <div key={room._id} onClick={() => setLocation(`/room/${room.roomId}`)} className="glass-card rounded-2xl p-6 flex flex-col min-h-[220px] cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                      <Code2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{room.name}</h3>
                    <p className="text-xs text-slate-400 mt-auto flex items-center gap-1">
                      <History className="h-3 w-3" /> {new Date(room.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="glass-panel border-white/10 text-white sm:max-w-md">
          <DialogTitle className="text-xl font-bold tracking-tight">Create New Session</DialogTitle>
          <div className="py-4 space-y-4">
            <Input 
              value={createRoomName} 
              onChange={(e) => setCreateRoomName(e.target.value)} 
              placeholder="Session Name" 
              className="bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="generate-meet" 
                checked={generateMeetLink}
                onCheckedChange={(checked) => setGenerateMeetLink(checked as boolean)}
              />
              <Label htmlFor="generate-meet" className="text-sm font-medium text-slate-300 cursor-pointer">
                Generate Video Meeting Link (Jitsi Meet)
              </Label>
            </div>
          </div>
          <Button onClick={handleCreateRoom} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg h-11 border-0">
            Create
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent className="glass-panel border-white/10 text-white sm:max-w-md">
          <DialogTitle className="text-xl font-bold tracking-tight">Join Existing Session</DialogTitle>
          <div className="py-4">
            <Input 
              value={joinRoomId} 
              onChange={(e) => setJoinRoomId(e.target.value)} 
              placeholder="Session ID" 
              className="bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
              autoFocus
            />
          </div>
          <Button onClick={handleJoinRoom} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg h-11 border-0">
            Join
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateProjectModalOpen} onOpenChange={setIsCreateProjectModalOpen}>
        <DialogContent className="glass-panel border-white/10 text-white sm:max-w-md">
          <DialogTitle className="text-xl font-bold tracking-tight">Create Project</DialogTitle>
          <form onSubmit={handleCreateProject} className="grid gap-4 py-4">
            <Input 
              value={newProjectName} 
              onChange={(e) => setNewProjectName(e.target.value)} 
              placeholder="Project Name" 
              className="bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
              autoFocus 
            />
            <Button type="submit" disabled={isCreatingProject} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg h-11 border-0">
               {isCreatingProject ? <Spinner className="h-4 w-4 mr-2" /> : null}
               Create Project
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
