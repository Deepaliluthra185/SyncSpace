import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { FolderOpen, Star, UserPlus, Check, Radio, Code2, Video } from "lucide-react";

interface User {
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: Date;
}

interface RoomNavBarProps {
  roomName: string;
  roomId: string;
  connected: boolean;
  activeUsers: User[];
  currentUserId: string;
  roomCreator: string | null;
  meetLink?: string | null;
}

export function RoomNavBar({
  roomName,
  roomId,
  connected,
  activeUsers,
  currentUserId,
  roomCreator,
  meetLink,
}: RoomNavBarProps) {
  const [copied, setCopied] = useState(false);

  const handleShareRoom = async () => {
    const shareUrl = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Room link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy room link");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex justify-between items-center h-16 px-8 bg-[#0c0a10] border-b border-white/5 z-50">
      <div className="flex items-center gap-6">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="text-white h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight group-hover:opacity-90 transition-opacity hidden sm:block">SyncSpace</span>
          </div>
        </Link>
        <div className="h-6 w-px bg-white/10 mx-2"></div>
        <div className="flex items-center gap-3">
          <FolderOpen className="text-slate-400 h-4 w-4 hidden sm:block" />
          <span className="text-sm font-semibold text-white">{roomName}</span>
          <span className="text-xs text-slate-400 mx-2 px-2.5 py-1 bg-white/5 rounded-md border border-white/10 flex items-center gap-2">
            ID: <span className="font-mono text-purple-400 font-medium">{roomId}</span>
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${connected ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`}></span>
            {connected ? "LIVE" : "SYNCING"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        {/* Navigation Links (Contextual) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a className="text-purple-400 text-glow" href="#">Workspace</a>
          <a className="text-slate-400 hover:text-white transition-colors" href="#">Shared</a>
          <a className="text-slate-400 hover:text-white transition-colors" href="#">Templates</a>
        </nav>
        
        {/* Presence & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-2">
            {activeUsers.slice(0, 4).map((u, i) => {
              const isHost = u.userId === roomCreator;
              const avatarColors = [
                'from-orange-400 to-red-500', 
                'from-emerald-400 to-teal-500', 
                'from-fuchsia-400 to-purple-500'
              ];
              const colorClass = u.userId === currentUserId 
                ? 'from-purple-400 to-pink-500' 
                : avatarColors[i % 3];

              return (
                <div key={u.userId} className="relative z-10 hover:z-20 transition-transform hover:scale-110">
                  <div 
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-xs font-bold text-white border-2 border-[#050505] shadow-lg`}
                    title={`${u.userName} ${isHost ? '(Host)' : '(Participant)'}`}
                  >
                    {u.userId === currentUserId ? 'ME' : getInitials(u.userName)}
                  </div>
                  {isHost && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#050505] shadow-sm" title="Host">
                      <Star className="w-2.5 h-2.5" fill="currentColor" />
                    </div>
                  )}
                </div>
              );
            })}
            {activeUsers.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white z-10 shadow-lg">
                +{activeUsers.length - 4}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleShareRoom}
            className="flex items-center gap-2 px-3.5 py-2 glass-button text-white rounded-lg text-sm font-medium group">
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <UserPlus className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
            )}
            <span>Invite</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-95 border border-white/10">
            <Radio className="h-4 w-4 animate-pulse-gentle" />
            <span>Go Live</span>
          </button>
          
          {meetLink && (
            <button 
              onClick={() => window.open(meetLink, "_blank")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all active:scale-95 border border-white/10 ml-2">
              <Video className="h-4 w-4 animate-pulse-gentle" />
              <span>Join Meeting</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
