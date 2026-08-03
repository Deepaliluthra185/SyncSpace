import React, { useState } from 'react';
import { X, Loader2, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberDialog({ isOpen, onClose }: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to send invite');
      }

      toast.success('Invite sent successfully!');
      if (data.previewUrl) {
        // Log the preview URL for ethereal email so developer can see it in client console
        console.log('Email preview URL:', data.previewUrl);
        toast.info('Check console for email preview URL!');
      }
      setEmail('');
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 border border-white/5 bg-[#07050a] shadow-2xl">
        <DialogTitle className="sr-only">Invite Team Member</DialogTitle>
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="mb-6">
            <h2 className="text-[22px] font-headings font-bold text-white tracking-tight">Invite Member</h2>
            <p className="text-[13px] text-slate-400 mt-1">Send an email invitation to collaborate in your workspace.</p>
          </div>

          <form onSubmit={handleInvite} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full bg-[#15121c] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-[14px] text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Invite'
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
