import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  Users,
  LogOut,
  TrendingUp,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/records', icon: Receipt, label: 'Records' },
];

const adminItems = [
  { to: '/users', icon: Users, label: 'Users' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm'
        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-surface-50 dark:bg-surface-950 border-r border-surface-200 dark:border-surface-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="text-lg font-bold gradient-text">FinTrack</span>
          </div>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 mb-2 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={onClose}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}

          {user?.role === 'ADMIN' && (
            <>
              <p className="px-4 mt-6 mb-2 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                Admin
              </p>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={linkClass}
                  onClick={onClose}
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
