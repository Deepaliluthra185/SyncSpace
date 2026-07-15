import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Code2, Users, Zap, Share2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const isAuthenticated = !!user;
  const [, setLocation] = useLocation();
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    setIsCreating(true);
    
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("syncspace_token") || ""}`
        },
        body: JSON.stringify({ name: roomName.trim() })
      });
      
      const data = await res.json();
      
      if (res.ok && data.id) {
        toast.success("Room created successfully!");
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

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">SyncSpace</h1>
          </div>
          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">Welcome, {user.username}!</span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white lg:text-5xl">
                Real-Time Collaborative Coding
              </h2>
              <p className="text-lg text-slate-300">
                Write code together, see changes instantly. Built for modern development teams.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Users, label: "Live Collaboration", desc: "See who's editing in real-time" },
                { icon: Zap, label: "Instant Sync", desc: "CRDT-powered conflict-free updates" },
                { icon: Share2, label: "Easy Sharing", desc: "Share room links with your team" },
              ].map((feature) => (
                <div key={feature.label} className="flex gap-3">
                  <feature.icon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-white">{feature.label}</p>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Create Room Card */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-8 lg:p-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Create a Room</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Start a new collaborative session
                </p>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Room Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Frontend Sprint"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isCreating}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCreating || !roomName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Room
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="rounded-lg bg-blue-900/20 border border-blue-700/30 p-4">
                <p className="text-xs text-blue-300">
                  💡 Tip: You can share the room link with others to collaborate in real-time.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 mt-20 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-400">
          <p>SyncSpace — Real-time collaborative coding environment</p>
        </div>
      </div>
    </div>
  );
}
