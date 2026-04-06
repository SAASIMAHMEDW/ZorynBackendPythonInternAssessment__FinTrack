import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'analyst' | 'viewer') => {
    const creds = {
      admin: { email: 'admin@fintrack.com', password: 'Admin@123' },
      analyst: { email: 'analyst@fintrack.com', password: 'Analyst@123' },
      viewer: { email: 'viewer@fintrack.com', password: 'Viewer@123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[150px] bg-sky-500 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[150px] bg-indigo-500 pointer-events-none" />

      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative border-r border-white/5 items-center justify-center p-12 bg-slate-900/30 backdrop-blur-3xl z-10">
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(14,165,233,0.1)]">
            <TrendingUp className="text-sky-400" size={32} />
          </div>
          <h1 className="text-5xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400 mb-6 leading-[1.1]">
            Master your wealth.
          </h1>
           <h2 className="text-3xl font-display font-medium text-slate-400 mb-6 leading-tight">
            The professional ledger for modern teams.
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-sm">
            Secure, role-based access to your financial truth. Experience real-time insights with zero compromise.
          </p>

          <div className="mt-16 flex items-center gap-4">
              <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center shrink-0`}>
                          <span className="text-xs font-bold text-slate-400">{i}</span>
                      </div>
                  ))}
              </div>
              <p className="text-sm font-semibold text-slate-400">Trusted by 10k+ professionals</p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <TrendingUp className="text-sky-400" size={20} />
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-tight">FinTrack</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                Welcome back
            </h2>
            <p className="text-slate-400 font-medium">
                Sign in to your private vault
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-inner transition-all font-medium"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-inner transition-all font-medium letter-spacing-wider"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 size={20} className="animate-spin text-slate-900" /> : null}
              {loading ? 'Authenticating...' : 'Secure Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-10 p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
              Quick Connect Demo
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {(['admin', 'analyst', 'viewer'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => fillDemo(role)}
                  className="flex-1 px-4 py-2.5 text-xs font-bold rounded-lg capitalize bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white transition-all shadow-inner"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-8 font-medium">
            New to FinTrack?{' '}
            <Link to="/register" className="font-bold text-sky-400 hover:text-sky-300 transition-colors">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
