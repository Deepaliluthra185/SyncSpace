import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Github, Zap, Shield, Users, TrendingUp, Loader2, Check } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');
  const [agreed, setAgreed] = useState(false);
  
  const [, setLocation] = useLocation();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      setLocation("/dashboard");
    }
  }, [token, setLocation]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !agreed) {
      toast.error("Please agree to the terms and privacy policy");
      return;
    }
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            email: formData.email, 
            password: formData.password, 
            // Generate a username for the backend since the design omits it
            username: formData.email.split('@')[0] + Math.floor(Math.random() * 1000) 
          };

      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        toast.success(`Successfully ${isLogin ? 'logged in' : 'registered'}!`);
      } else {
        toast.error(data.msg || "Authentication failed");
      }
    } catch (err) {
      toast.error("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07050a] flex items-center justify-center font-body relative overflow-hidden p-6">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Auth Form Container */}
        <div 
          className="w-full max-w-md mx-auto p-10 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, rgba(18,15,26,0.95) 0%, rgba(13,11,18,0.95) 100%)',
            border: '1px solid rgba(168,85,247,0.15)',
            boxShadow: '0 0 40px rgba(168,85,247,0.1), 0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-headings font-bold text-white mb-2 tracking-tight">
              Welcome to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                SyncSpace
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-3">
              {isLogin ? "Sign in to your account to continue collaborating." : "Create your account and start collaborating in real time."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {!isLogin && (
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Choose your plan</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setSelectedPlan('free')}
                    className={`cursor-pointer rounded-xl p-4 border transition-all ${selectedPlan === 'free' ? 'bg-purple-500/10 border-purple-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <div className="text-sm font-semibold text-white text-center">Free</div>
                    <div className="text-2xl font-bold text-cyan-400 text-center my-1">$0</div>
                    <div className="text-[10px] text-slate-400 text-center">3 projects, 5GB</div>
                  </div>
                  <div 
                    onClick={() => setSelectedPlan('pro')}
                    className={`cursor-pointer rounded-xl p-4 border transition-all ${selectedPlan === 'pro' ? 'bg-purple-500/10 border-purple-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <div className="text-sm font-semibold text-white text-center">Pro</div>
                    <div className="text-2xl font-bold text-purple-400 text-center my-1">$15</div>
                    <div className="text-[10px] text-slate-400 text-center">Unlimited, priority support</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-white">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="you@company.com"
                    className="w-full bg-[#13111a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-white">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-[#13111a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${agreed ? 'bg-purple-600' : 'bg-[#13111a] border border-white/20'}`}
                >
                  {agreed && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
                <span className="text-sm text-slate-400">
                  I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">terms</a> and <a href="#" className="text-purple-400 hover:text-purple-300">privacy policy</a>
                </span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
                boxShadow: '0 0 20px rgba(168,85,247,0.4)'
              }}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#100d18] px-4 text-slate-500">or</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors">
              <Github className="h-4 w-4" /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors">
              <Mail className="h-4 w-4" /> Google
            </button>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setAgreed(false); }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-purple-400 font-medium">{isLogin ? "Sign up" : "Sign in"}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Features List (hidden on mobile) */}
        <div className="hidden lg:block w-full max-w-md mx-auto">
          <div 
            className="p-10 rounded-3xl"
            style={{
              background: 'rgba(15,12,25,0.6)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <h2 className="text-3xl font-headings font-bold text-white mb-4 leading-tight">
              Why teams love<br/>SyncSpace
            </h2>
            <p className="text-slate-400 text-sm mb-10">
              Everything you need to ship faster with your team.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Get started in 30s</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">No setup needed. Start collaborating instantly after signup.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/20">
                  <Shield className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Enterprise security</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">SOC 2 Type II certified. End-to-end encrypted collaboration.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/20">
                  <Users className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Invite your team</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Add teammates with one link. Works with any workspace size.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                  <TrendingUp className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Track productivity</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Real-time presence and activity insights for teams.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
