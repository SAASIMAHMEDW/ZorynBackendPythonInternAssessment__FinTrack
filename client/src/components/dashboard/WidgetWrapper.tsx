import React from 'react';
import { GripVertical, MoreVertical, Settings, Maximize2, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WidgetWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isEditing?: boolean;
  onRemove?: () => void;
  onSettings?: () => void;
  className?: string;
  handleClass?: string;
}

export const WidgetWrapper = React.forwardRef<HTMLDivElement, WidgetWrapperProps>(
  ({ id, title, children, isEditing, onRemove, onSettings, className, handleClass, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex flex-col h-full bg-surface-50/50 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-surface-200/50 dark:border-white/5 shadow-xl overflow-hidden transition-all duration-300',
          isEditing && 'ring-2 ring-sky-500/50 shadow-sky-500/10 scale-[0.99]',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-200/50 dark:border-white/5 bg-surface-100/30 dark:bg-slate-950/20">
          <div className="flex items-center gap-3">
            {isEditing && (
              <div className={cn('cursor-grab active:cursor-grabbing p-1 hover:bg-surface-200/50 dark:hover:bg-white/5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors', handleClass)}>
                <GripVertical size={18} />
              </div>
            )}
            <h3 className="font-bold text-slate-600 dark:text-slate-400 tracking-tight text-[10px] uppercase opacity-80">{title}</h3>
          </div>

          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSettings?.(); }}
                  className="p-1.5 hover:bg-sky-500/10 text-slate-400 hover:text-sky-400 rounded-lg transition-all"
                  title="Widget Settings"
                >
                  <Settings size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
                  className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                  title="Remove Widget"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Maximize2 size={14} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-hidden">
          {children}
        </div>

        {/* Edit Overlay */}
        {isEditing && (
          <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-sky-500/30 rounded-2xl" />
        )}
      </div>
    );
  }
);

WidgetWrapper.displayName = 'WidgetWrapper';
