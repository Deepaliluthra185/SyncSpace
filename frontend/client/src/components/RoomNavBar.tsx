import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

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
}

export function RoomNavBar({
  roomName,
  roomId,
  connected,
  activeUsers,
  currentUserId,
  roomCreator,
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
    <header className="flex justify-between items-center h-12 px-space-lg bg-surface-low border-b border-subtle z-50">
      <div className="flex items-center gap-space-lg">
        <Link href="/">
          <span className="font-headline-md text-headline-md font-bold text-primary cursor-pointer hover:opacity-80">SyncSpace</span>
        </Link>
        <div className="h-4 w-px bg-outline-variant mx-2"></div>
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">folder_open</span>
          <span className="font-label-md text-label-md text-on-surface">{roomName}</span>
          <span className="text-on-surface-variant text-label-sm mx-2 px-2 py-0.5 bg-surface-container-high rounded border border-subtle">ID: <span className="font-mono text-primary font-bold">{roomId}</span></span>
          <span className="bg-surface-container px-1.5 py-0.5 rounded text-[10px] font-bold text-secondary uppercase tracking-wider">
            {connected ? "LIVE" : "SYNCING"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-space-xl">
        {/* Navigation Links (Contextual) */}
        <nav className="hidden md:flex items-center gap-space-lg font-label-md text-label-md">
          <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#">Workspace</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Shared</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Templates</a>
        </nav>
        
        {/* Presence & Actions */}
        <div className="flex items-center gap-space-md">
          <div className="flex -space-x-2 mr-2">
            {activeUsers.slice(0, 4).map((u, i) => {
              const isHost = u.userId === roomCreator;
              return (
                <div key={u.userId} className="relative z-10 hover:z-20">
                  <div 
                    className="w-7 h-7 rounded-full border-2 border-[#adc6ff] bg-surface-container flex items-center justify-center text-[10px] font-bold text-primary transition-all" 
                    title={`${u.userName} ${isHost ? '(Host)' : '(Participant)'}`}
                    style={{ 
                      borderColor: u.userId === currentUserId ? '#adc6ff' : ['#ffb95f', '#4edea3', '#C586C0'][i % 3],
                      color: u.userId === currentUserId ? '#adc6ff' : ['#ffb95f', '#4edea3', '#C586C0'][i % 3]
                    }}
                  >
                    {u.userId === currentUserId ? 'ME' : getInitials(u.userName)}
                  </div>
                  {isHost && (
                    <div className="absolute -top-1 -right-1 bg-primary text-on-primary rounded-full w-3.5 h-3.5 flex items-center justify-center border border-surface-low" title="Host">
                      <span className="material-symbols-outlined text-[10px] leading-none">star</span>
                    </div>
                  )}
                </div>
              );
            })}
            {activeUsers.length > 4 && (
              <div className="w-7 h-7 rounded-full border-2 border-surface-mid bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant z-10">
                +{activeUsers.length - 4}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleShareRoom}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-mid border border-subtle rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'person_add'}
            </span>
            <span>Invite</span>
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary-container rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">sensors</span>
            <span>Go Live</span>
          </button>
        </div>
      </div>
    </header>
  );
}
