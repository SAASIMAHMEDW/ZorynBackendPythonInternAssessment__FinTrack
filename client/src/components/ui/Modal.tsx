import React from 'react';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accentColor?: 'sky' | 'violet' | 'rose' | 'emerald';
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const accentGlow: Record<string, string> = {
  sky: 'bg-sky-500/10',
  violet: 'bg-violet-500/10',
  rose: 'bg-rose-500/10',
  emerald: 'bg-emerald-500/10',
};

export function BaseModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  accentColor = 'sky',
  footer 
}: BaseModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={cn(
          'w-full rounded-2xl shadow-2xl relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto',
          'bg-surface-50 dark:bg-slate-900 border border-surface-200 dark:border-white/10',
          sizeClasses[size]
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className={cn(
          'absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none',
          accentGlow[accentColor]
        )} />
        
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-white/5 relative z-10">
          <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-surface-100 dark:hover:bg-white/10 text-surface-400 hover:text-surface-600 dark:hover:text-white rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 relative z-10">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 p-6 border-t border-surface-200 dark:border-white/5 relative z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isPending?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  isPending = false,
  variant = 'danger'
}: ConfirmModalProps) {
  const variantConfig = {
    danger: {
      iconBg: 'bg-rose-500/10',
      iconBorder: 'border-rose-500/20',
      iconColor: 'text-rose-500 dark:text-rose-400',
      confirmBg: 'bg-rose-500 hover:bg-rose-600',
      confirmShadow: 'shadow-rose-500/20',
    },
    warning: {
      iconBg: 'bg-amber-500/10',
      iconBorder: 'border-amber-500/20',
      iconColor: 'text-amber-500 dark:text-amber-400',
      confirmBg: 'bg-amber-500 hover:bg-amber-600',
      confirmShadow: 'shadow-amber-500/20',
    },
    info: {
      iconBg: 'bg-sky-500/10',
      iconBorder: 'border-sky-500/20',
      iconColor: 'text-sky-500 dark:text-sky-400',
      confirmBg: 'bg-sky-500 hover:bg-sky-600',
      confirmShadow: 'shadow-sky-500/20',
    },
  };

  const config = variantConfig[variant];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-surface-50 dark:bg-slate-900 border border-surface-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className={cn('absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none', config.iconBg)} />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center border mb-6',
            config.iconBg, config.iconBorder, config.iconColor
          )}>
            {variant === 'danger' && (
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {variant === 'warning' && (
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {variant === 'info' && (
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-surface-500 dark:text-slate-400 mb-8 max-w-[260px]">
            {message}
          </p>
          
          <div className="flex w-full gap-4">
            <button 
              onClick={onClose} 
              className="flex-1 py-3 font-semibold text-surface-600 dark:text-slate-300 hover:text-surface-900 dark:hover:text-white bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className={cn(
                'flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center',
                config.confirmBg, config.confirmShadow
              )}
            >
              {isPending ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
