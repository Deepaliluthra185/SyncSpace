import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const isAuthenticated = !!user;
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createRoomName, setCreateRoomName] = useState("");
  
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
          projectId: activeProject ? activeProject._id : null 
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.id) {
        toast.success("Room created successfully!");
        setIsCreateModalOpen(false);
        setCreateRoomName("");
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
      <div className="flex h-screen items-center justify-center bg-surface-lowest">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="dark bg-surface-lowest min-h-screen text-on-surface font-['Geist'] flex">
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface-low border-r border-subtle flex flex-col py-space-lg z-50">
        <div className="px-space-lg mb-8">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">SyncSpace</h1>
          <p className="font-label-sm text-on-surface-variant">Enterprise Plan</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
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
          <a onClick={() => { setActiveTab("Dashboard"); setTopNavTab("Dashboard"); }} className={`flex items-center px-space-lg py-2 cursor-pointer font-body-md transition-colors ${activeTab === "Dashboard" ? "text-primary border-l-2 border-primary bg-primary/10" : "text-on-surface-variant hover:bg-surface-mid"}`}>
            <span className="material-symbols-outlined mr-3">dashboard</span>
            Dashboard
          </a>
          <a onClick={() => setActiveTab("Workspace")} className={`flex items-center px-space-lg py-2 cursor-pointer font-body-md transition-colors ${activeTab === "Workspace" ? "text-primary border-l-2 border-primary bg-primary/10" : "text-on-surface-variant hover:bg-surface-mid"}`}>
            <span className="material-symbols-outlined mr-3">tactic</span>
            Workspace
          </a>
          <a onClick={() => setActiveTab("History")} className={`flex items-center px-space-lg py-2 cursor-pointer font-body-md transition-colors ${activeTab === "History" ? "text-primary border-l-2 border-primary bg-primary/10" : "text-on-surface-variant hover:bg-surface-mid"}`}>
            <span className="material-symbols-outlined mr-3">history</span>
            History
          </a>
          <a onClick={() => setActiveTab("Team")} className={`flex items-center px-space-lg py-2 cursor-pointer font-body-md transition-colors ${activeTab === "Team" ? "text-primary border-l-2 border-primary bg-primary/10" : "text-on-surface-variant hover:bg-surface-mid"}`}>
            <span className="material-symbols-outlined mr-3">group</span>
            Team
          </a>
        </nav>
        <div className="mt-auto border-t border-subtle pt-space-lg px-space-sm space-y-1">
          <div className="flex items-center gap-3 px-space-lg py-space-md">
            <div className="w-8 h-8 rounded-full border-2 border-primary bg-surface-mid flex items-center justify-center font-bold text-primary uppercase">
              {user?.username?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-label-md text-on-surface truncate">{user?.username || 'User'}</p>
            </div>
            <button onClick={() => logout()} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors cursor-pointer ml-auto" title="Logout">
              logout
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-[240px] flex flex-col flex-1 min-h-screen">
        <header className="h-12 px-space-lg flex justify-between items-center bg-surface-low border-b border-subtle sticky top-0 z-40">
          <div className="flex items-center gap-space-xl">
            <nav className="flex gap-space-lg">
              <a className={`font-label-md cursor-pointer transition-colors ${topNavTab === "Projects" ? "text-primary" : "text-on-surface-variant hover:text-primary"}`} onClick={() => { setTopNavTab("Projects"); setActiveProject(null); setActiveTab("Workspace"); }}>Projects</a>
              <a className="font-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer" onClick={() => toast.info('Shared sessions coming soon')}>Shared</a>
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <button onClick={() => setIsCreateModalOpen(true)} disabled={isCreating} className="font-label-md px-3 py-1 bg-secondary text-on-secondary rounded hover:opacity-90 transition-opacity cursor-pointer">Go Live</button>
          </div>
        </header>

        <section className="p-space-xl flex-1 max-w-[1400px] mx-auto w-full overflow-y-auto">
          {topNavTab === "Projects" ? (
            <>
              {activeProject ? (
                <div>
                  <div className="flex items-center gap-4 mb-space-xl text-on-surface-variant">
                    <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors" onClick={() => setActiveProject(null)}>arrow_back</span>
                    <span className="font-label-lg cursor-pointer hover:text-primary transition-colors" onClick={() => setActiveProject(null)}>Projects</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">{activeProject.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    <div onClick={() => setIsCreateModalOpen(true)} className="group bg-surface-low border border-subtle border-dashed rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[220px] cursor-pointer items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-surface-mid group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                         <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">add</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Create New Session</h3>
                    </div>
                    {rooms.filter((r) => r.project === activeProject._id).map((room: any) => (
                      <div key={room._id} onClick={() => setLocation(`/room/${room.roomId}`)} className="group bg-surface-low border border-subtle rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[220px] cursor-pointer">
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors mb-1">{room.name}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-end mb-space-xl">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Your Projects</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    <div onClick={() => setIsCreateProjectModalOpen(true)} className="group bg-surface-low border border-subtle border-dashed rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[160px] cursor-pointer items-center justify-center text-center">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">create_new_folder</span>
                      <h3 className="font-headline-md mt-2 text-on-surface group-hover:text-primary transition-colors">Create Project</h3>
                    </div>
                    {projects.map((project: any) => (
                      <div key={project._id} onClick={() => setActiveProject(project)} className="group bg-surface-low border border-subtle rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[160px] cursor-pointer">
                        <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">{project.name}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {activeTab === "Dashboard" && (
                <>
                  <div onClick={() => setIsCreateModalOpen(true)} className="group bg-surface-low border border-subtle border-dashed rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[220px] cursor-pointer items-center justify-center text-center">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">add</span>
                    <h3 className="font-headline-md text-on-surface">Create New Session</h3>
                  </div>
                  <div onClick={() => setIsJoinModalOpen(true)} className="group bg-surface-low border border-subtle border-dashed rounded-lg p-space-lg hover:border-primary hover:bg-surface-mid transition-all duration-300 flex flex-col min-h-[220px] cursor-pointer items-center justify-center text-center">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">login</span>
                    <h3 className="font-headline-md text-on-surface">Join Existing Session</h3>
                  </div>
                </>
              )}
              {displayRooms.map((room: any) => (
                <div key={room._id} onClick={() => setLocation(`/room/${room.roomId}`)} className="group bg-surface-low border border-subtle rounded-lg p-space-lg hover:border-primary cursor-pointer">
                  <h3 className="font-headline-md text-on-surface">{room.name}</h3>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogTitle>Create New Session</DialogTitle>
          <Input value={createRoomName} onChange={(e) => setCreateRoomName(e.target.value)} placeholder="Session Name" />
          <Button onClick={handleCreateRoom}>Create</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent>
          <DialogTitle>Join Existing Session</DialogTitle>
          <Input value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} placeholder="Session ID" />
          <Button onClick={handleJoinRoom}>Join</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateProjectModalOpen} onOpenChange={setIsCreateProjectModalOpen}>
        <DialogContent>
          <DialogTitle>Create Project</DialogTitle>
          <form onSubmit={handleCreateProject} className="grid gap-4 py-4">
            <Input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Project Name" autoFocus />
            <Button type="submit" disabled={isCreatingProject}>
               {isCreatingProject ? <Spinner className="h-4 w-4 mr-2" /> : null}
               Create Project
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
