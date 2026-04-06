import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ firstName, lastName, email, password });
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[150px] bg-emerald-500 pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[150px] bg-indigo-500 pointer-events-none" />

      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative border-r border-white/5 items-center justify-center p-12 bg-slate-900/30 backdrop-blur-3xl z-10">
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
             <TrendingUp className="text-indigo-400" size={32} />
          </div>
          <h1 className="text-5xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400 mb-6 leading-[1.1]">
            Join the elite.
          </h1>
          <h2 className="text-3xl font-display font-medium text-slate-400 mb-6 leading-tight">
            Elevate your financial tracking.
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-sm">
            Create an account in seconds and unlock features designed for serious professionals.
          </p>

          <div className="mt-16 flex items-center gap-4">
              <div className="flex space-x-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
              </div>
              <p className="text-sm font-semibold text-slate-400">Secure & Encrypted</p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <TrendingUp className="text-indigo-400" size={20} />
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-tight">FinTrack</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                Create Account
            </h2>
            <p className="text-slate-400 font-medium">
                Set up your personal vault
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner transition-all font-medium"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner transition-all font-medium"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner transition-all font-medium"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner transition-all font-medium letter-spacing-wider"
                  placeholder="••••••••"
                  required
                  minLength={6}
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
              className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? 'Setting up Vault...' : 'Initialize Vault'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-8 font-medium">
            Already have access?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
