import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, DUMMY_CREDENTIALS } from "../lib/auth";
import { Button } from "../components/ui/button";
import { ShieldAlert, Activity, UserCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const isValid = DUMMY_CREDENTIALS.some(c => c.email === email && c.password === password);
    if (isValid) {
      login(email);
      navigate("/");
    } else {
      setError("Invalid credentials. Use the quick login buttons below.");
    }
  };

  const fastLogin = (idx: number) => {
    const creds = DUMMY_CREDENTIALS[idx];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-100/50 dark:from-blue-900/20 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10">
        
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950/50 px-8 py-10 flex flex-col items-center justify-center text-center border-b border-transparent dark:border-slate-800">
          <div className="h-16 w-16 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-inner">
            <Activity className="h-8 w-8 text-emerald-400 dark:text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AegisIV System</h1>
          <p className="text-slate-400 mt-2 text-sm">Secure Central Monitoring Portal</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800/30 flex items-center gap-2">
                <ShieldAlert size={16} />
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="emailInput" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <input 
                id="emailInput"
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent transition-all shadow-sm"
                placeholder="doctor@aegis.com"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="passwordInput" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input 
                id="passwordInput"
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full py-6 text-base font-semibold shadow-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 transition-all hover:scale-[1.02]">
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4 font-medium uppercase tracking-wider">Demo Quick Access</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" onClick={() => fastLogin(0)} className="flex items-center gap-2 h-auto py-3 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 hover:scale-[1.02] transition-transform">
                <UserCircle size={18} />
                <div className="text-left flex flex-col">
                  <span className="text-xs font-bold leading-tight">Doctor Role</span>
                  <span className="text-[10px] font-normal opacity-80 leading-tight">Full Access</span>
                </div>
              </Button>
              <Button variant="outline" type="button" onClick={() => fastLogin(1)} className="flex items-center gap-2 h-auto py-3 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 hover:scale-[1.02] transition-transform">
                <UserCircle size={18} />
                <div className="text-left flex flex-col">
                  <span className="text-xs font-bold leading-tight">Nurse Role</span>
                  <span className="text-[10px] font-normal opacity-80 leading-tight">Monitor Only</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
