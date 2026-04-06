import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-200 dark:bg-slate-700',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded',
        variant === 'rectangular' && 'rounded-xl',
        className
      )}
      style={{ width, height }}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <Skeleton className="h-6 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface-50 dark:bg-slate-900 backdrop-blur-xl border border-surface-200 dark:border-white/5 rounded-2xl p-6 animate-pulse shadow-xl">
      <Skeleton className="h-4 w-20 mb-3" variant="text" />
      <Skeleton className="h-8 w-32 mb-2" variant="text" />
      <Skeleton className="h-3 w-24" variant="text" />
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-surface-50 dark:bg-slate-900 border border-surface-200 dark:border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex gap-4 mt-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}
