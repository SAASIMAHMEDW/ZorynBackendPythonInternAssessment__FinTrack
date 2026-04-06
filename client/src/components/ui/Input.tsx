import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export function Select({ 
  options, 
  placeholder, 
  error,
  className,
  ...props 
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'w-full appearance-none bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-700 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-medium text-sm',
          error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="text-surface-400">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-surface-400 dark:text-slate-500">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className,
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-700 dark:text-white placeholder-surface-400',
            'focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-medium',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  ...props
}: TextareaProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-3 text-surface-700 dark:text-white placeholder-surface-400',
          'focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-medium resize-none min-h-[100px]',
          error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
