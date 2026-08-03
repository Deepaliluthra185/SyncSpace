import React, { useState } from 'react';
import { X, Loader2, PenTool, Code2, Layers, UserPlus } from 'lucide-react';

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
  const [roomType, setRoomType] = useState('Whiteboard');

  return (
    <div className="w-full max-w-[460px] mx-auto flex-1 items-center font-sans rounded-[20px] relative overflow-hidden bg-[#110e17] border border-white/5 shadow-2xl">
      <div className="p-8">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div>
          <h2 className="text-[22px] font-bold text-white tracking-tight">Create a new room</h2>
          <p className="mt-1.5 text-sm text-[#7e85a0]">Choose a type and give it a name</p>
        </div>

        <div className="mt-8">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Room Type</label>
          <div className="mt-3 flex flex-col gap-3">
            {/* Whiteboard Option */}
            <div 
              onClick={() => setRoomType('Whiteboard')}
              className={`flex items-center justify-between p-4 rounded-[14px] border cursor-pointer transition-all ${
                roomType === 'Whiteboard' 
                  ? 'border-purple-500 bg-purple-500/5' 
                  : 'border-white/5 bg-[#15121c] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1e152e] flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white mb-0.5">Whiteboard</h4>
                  <p className="text-[11px] text-[#7e85a0]">Visual diagrams, wireframes, and brainstorming</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                roomType === 'Whiteboard' ? 'border-purple-400' : 'border-slate-600'
              }`}>
                {roomType === 'Whiteboard' && <div className="w-2 h-2 bg-purple-400 rounded-full"></div>}
              </div>
            </div>

            {/* Code Space Option */}
            <div 
              onClick={() => setRoomType('Code Space')}
              className={`flex items-center justify-between p-4 rounded-[14px] border cursor-pointer transition-all ${
                roomType === 'Code Space' 
                  ? 'border-purple-500 bg-purple-500/5' 
                  : 'border-white/5 bg-[#15121c] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#101b2a] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white mb-0.5">Code Space</h4>
                  <p className="text-[11px] text-[#7e85a0]">Collaborative code editing with live sync</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                roomType === 'Code Space' ? 'border-purple-400' : 'border-slate-600'
              }`}>
                {roomType === 'Code Space' && <div className="w-2 h-2 bg-purple-400 rounded-full"></div>}
              </div>
            </div>

            {/* Mixed Room Option */}
            <div 
              onClick={() => setRoomType('Mixed Room')}
              className={`flex items-center justify-between p-4 rounded-[14px] border cursor-pointer transition-all ${
                roomType === 'Mixed Room' 
                  ? 'border-purple-500 bg-purple-500/5' 
                  : 'border-white/5 bg-[#15121c] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2a1711] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-white mb-0.5">Mixed Room</h4>
                  <p className="text-[11px] text-[#7e85a0]">Combine a whiteboard and code editor in one room</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                roomType === 'Mixed Room' ? 'border-purple-400' : 'border-slate-600'
              }`}>
                {roomType === 'Mixed Room' && <div className="w-2 h-2 bg-purple-400 rounded-full"></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Room Name</label>
          <div className="mt-2">
            <input 
              type="text" 
              placeholder="e.g. Auth Flow Redesign"
              className="w-full bg-[#15121c] border border-white/5 rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
              value={createRoomName}
              onChange={(e) => setCreateRoomName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Invite Team Members (Optional)</label>
          <div className="mt-2 relative">
            <input 
              type="text" 
              placeholder="Add by name or email..."
              className="w-full bg-[#15121c] border border-white/5 rounded-xl pl-4 pr-10 py-3 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
            />
            <UserPlus className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 rounded-xl bg-[#1a1722] py-3 text-[13px] font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreateRoom} 
            disabled={isCreating}
            className="flex-1 rounded-xl py-3 text-[13px] font-bold text-white shadow-lg shadow-purple-500/20 transition hover:opacity-90 disabled:opacity-70 flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)' }}
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
