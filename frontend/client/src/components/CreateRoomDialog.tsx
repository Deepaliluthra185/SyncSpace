import React from 'react';
import { Share2, X, Loader2 } from 'lucide-react';

interface CreateRoomDialogProps {
  createRoomName: string;
  setCreateRoomName: (name: string) => void;
  generateMeetLink: boolean;
  setGenerateMeetLink: (checked: boolean) => void;
  handleCreateRoom: () => void;
  onClose: () => void;
  isCreating: boolean;
}

export function CreateRoomDialog({
  createRoomName,
  setCreateRoomName,
  generateMeetLink,
  setGenerateMeetLink,
  handleCreateRoom,
  onClose,
  isCreating
}: CreateRoomDialogProps) {
  return (
    <div className="w-full flex-1 items-center theme-dialog text-foreground font-sans rounded-xl relative overflow-hidden">
      {/* Background gradient from user's snippet */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background -z-10"></div>
      
      <section className="grid w-full overflow-hidden rounded-xl border border-border bg-card/80 shadow-lg backdrop-blur-xl lg:grid-cols-5 shadow-theme">
        <aside className="border-b border-border bg-gradient-to-br from-primary to-tertiary p-8 lg:col-span-2 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-card/20 text-primary-foreground">
                <Share2 className="text-2xl" />
              </span>
              <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                Live workspace
              </p>
              <h1 className="mt-3 font-heading text-2xl font-bold text-primary-foreground leading-tight">
                Bring the right people into the room.
              </h1>
              <p className="mt-4 text-sm leading-6 text-primary-foreground/90">
                Your teammates can co-create in real time—without losing the context behind every decision.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-2">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" className="h-9 w-9 rounded-full border-2 border-primary" alt="Maya" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" className="h-9 w-9 rounded-full border-2 border-primary" alt="Theo" />
              <img src="https://randomuser.me/api/portraits/women/65.jpg" className="h-9 w-9 rounded-full border-2 border-primary" alt="Sofia" />
              <span className="ml-2 text-xs font-medium text-primary-foreground">
                8 collaborators online
              </span>
            </div>
          </div>
        </aside>
        
        <div className="p-8 lg:col-span-3 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="text-lg" />
          </button>
          
          <div className="flex items-start justify-between gap-4 mt-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-tertiary">New Session</p>
              <h2 className="mt-2 font-heading text-lg font-semibold">Create a Workspace</h2>
              <p className="mt-2 text-sm text-muted-foreground">Start a new whiteboard and code editor session.</p>
            </div>
            <span className="rounded-full bg-tertiary/20 px-3 py-1 text-xs font-bold text-tertiary border border-tertiary/30">
              Live now
            </span>
          </div>

          <label className="mt-7 block text-sm font-medium text-foreground">Session Name</label>
          <div className="mt-2 flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="e.g., Q3 Product Map"
              className="flex flex-1 items-center gap-3 rounded-lg border border-input bg-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
              value={createRoomName}
              onChange={(e) => setCreateRoomName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mt-6 flex items-center gap-3 bg-secondary/50 p-4 rounded-lg border border-border">
            <input 
              type="checkbox"
              id="generate-meet"
              checked={generateMeetLink}
              onChange={(e) => setGenerateMeetLink(e.target.checked)}
              className="h-4 w-4 rounded border-input bg-secondary text-primary focus:ring-ring cursor-pointer"
            />
            <label htmlFor="generate-meet" className="text-sm font-medium text-foreground cursor-pointer flex-1">
              Generate Video Meeting Link (Jitsi Meet)
            </label>
          </div>

          <div className="mt-7 flex justify-end gap-3 border-t border-border pt-6">
            <button 
              onClick={onClose} 
              className="rounded-lg px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateRoom} 
              disabled={isCreating}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:scale-105 hover:shadow-lg flex items-center justify-center min-w-[130px] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Room"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
