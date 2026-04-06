import { useAuth } from '../contexts/AuthContext';
import { DashboardGridLayout } from '../components/dashboard/DashboardGridLayout';
import { Activity, Layout } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in relative min-h-screen pb-20">
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full opacity-10 blur-[120px] bg-sky-500 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full opacity-10 blur-[120px] bg-indigo-500 animate-pulse delay-700" />
      </div>

      <div className="flex items-center gap-4 relative z-10 p-2">
        <div className="p-3 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 dark:from-sky-500/20 dark:to-indigo-500/20 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl backdrop-blur-md">
           <Activity size={28} className="text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight text-surface-900 dark:text-surface-50 drop-shadow-sm">
              FinTrack Dashboard
          </h1>
          <p className="text-surface-500 dark:text-surface-400 font-medium ml-1 flex items-center gap-2">
            <Layout size={14} />
            Welcome back, {user?.firstName}
          </p>
        </div>
      </div>

      <DashboardGridLayout userRole={user?.role || 'VIEWER'} />

      <div className="text-center text-surface-400 dark:text-surface-600 text-xs mt-10 pt-10 border-t border-black/5 dark:border-white/5">
        &copy; 2026 FinTrack Dashboard &bull; All financial data is encrypted and secure.
      </div>
    </div>
  );
}
