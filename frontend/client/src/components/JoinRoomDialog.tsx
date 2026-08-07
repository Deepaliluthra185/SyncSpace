import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface JoinRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinRoomDialog({ isOpen, onClose }: JoinRoomDialogProps) {
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [, setLocation] = useLocation();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    setIsJoining(true);
    
    // Validate that it looks like a valid room ID or just route directly to it
    setTimeout(() => {
      setIsJoining(false);
      onClose();
      setLocation(`/room/${roomId.trim()}`);
      toast.success("Joining room...");
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#13111a] border-white/10 text-white">
        <DialogTitle className="text-xl font-bold font-headings">Join Room</DialogTitle>
        <DialogDescription className="text-slate-400">
          Enter the Room ID provided by the host to join as a candidate.
        </DialogDescription>
        
        <form onSubmit={handleJoin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="e.g. cm0v..."
              className="w-full bg-[#1e1b27] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isJoining || !roomId.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-opacity"
            >
              {isJoining ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Join
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
