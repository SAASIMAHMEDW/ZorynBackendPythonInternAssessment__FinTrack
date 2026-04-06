import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/60 dark:border-surface-800/60">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-ghost p-2"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-surface-900 dark:text-surface-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="btn-ghost p-2.5 rounded-xl"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-surface-500" />
          )}
        </button>
      </div>
    </header>
  );
}
