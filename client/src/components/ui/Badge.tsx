import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'indigo';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-100 dark:bg-slate-800 text-surface-600 dark:text-slate-300 border-surface-200 dark:border-slate-700',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md text-xs font-semibold tracking-wide border',
        size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1',
        badgeVariantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20',
  secondary: 'bg-surface-100 dark:bg-white/5 text-surface-700 dark:text-slate-200 hover:bg-surface-200 dark:hover:bg-white/10 border border-surface-200 dark:border-white/10',
  ghost: 'bg-transparent hover:bg-surface-100 dark:hover:bg-white/5 text-surface-600 dark:text-slate-300',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20',
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
