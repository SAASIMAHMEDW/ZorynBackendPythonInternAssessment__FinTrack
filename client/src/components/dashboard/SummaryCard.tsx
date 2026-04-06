import { TrendingUp, TrendingDown, Wallet, Receipt, LucideIcon } from 'lucide-react';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export type SummaryType = 'income' | 'expense' | 'balance' | 'records';

interface SummaryCardProps {
  type: SummaryType;
  value: number;
  subValue?: string | number;
  loading?: boolean;
}

const CONFIG: Record<SummaryType, { 
  title: string; 
  icon: LucideIcon; 
  subTitle: string;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  iconBorderClass: string;
  iconClass: string;
  valueClass: string;
}> = {
  income: {
    title: 'Total Income',
    icon: TrendingUp,
    subTitle: 'transactions',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/20',
    iconBgClass: 'bg-emerald-500/10',
    iconBorderClass: 'border-emerald-500/20',
    iconClass: 'text-emerald-500 dark:text-emerald-400',
    valueClass: 'text-emerald-600 dark:text-emerald-400',
  },
  expense: {
    title: 'Total Expenses',
    icon: TrendingDown,
    subTitle: 'transactions',
    bgClass: 'bg-rose-500/10',
    borderClass: 'border-rose-500/20',
    iconBgClass: 'bg-rose-500/10',
    iconBorderClass: 'border-rose-500/20',
    iconClass: 'text-rose-500 dark:text-rose-400',
    valueClass: 'text-rose-600 dark:text-rose-400',
  },
  balance: {
    title: 'Net Balance',
    icon: Wallet,
    subTitle: 'Income − Expenses',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/20',
    iconBgClass: 'bg-sky-500/10',
    iconBorderClass: 'border-sky-500/20',
    iconClass: 'text-sky-500 dark:text-sky-400',
    valueClass: 'text-sky-600 dark:text-sky-400',
  },
  records: {
    title: 'Total Records',
    icon: Receipt,
    subTitle: 'Active entries',
    bgClass: 'bg-indigo-500/10',
    borderClass: 'border-indigo-500/20',
    iconBgClass: 'bg-indigo-500/10',
    iconBorderClass: 'border-indigo-500/20',
    iconClass: 'text-indigo-500 dark:text-indigo-400',
    valueClass: 'text-indigo-600 dark:text-indigo-400',
  },
};

export function SummaryCard({ type, value, subValue, loading }: SummaryCardProps) {
  const conf = CONFIG[type];

  if (loading || !conf) {
    return (
      <div className="bg-surface-50 dark:bg-slate-900 backdrop-blur-xl border border-surface-200 dark:border-white/5 rounded-2xl p-6 animate-pulse shadow-xl h-full flex flex-col justify-center">
        <div className="w-20 h-4 bg-surface-200 dark:bg-slate-700 rounded mb-3" />
        <div className="w-32 h-8 bg-surface-200 dark:bg-slate-700 rounded" />
      </div>
    );
  }

  const Icon = conf.icon;

  return (
    <div className="h-full relative overflow-hidden bg-surface-50 dark:bg-slate-900 backdrop-blur-xl border border-surface-200 dark:border-white/5 rounded-2xl p-6 group hover:bg-surface-100 dark:hover:bg-slate-800/50 transition-all duration-300 shadow-xl">
      <div className={`absolute top-0 right-0 w-32 h-32 ${conf.bgClass} rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none`} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">
          {conf.title}
        </span>
        <div className={`w-10 h-10 rounded-xl ${conf.iconBgClass} flex items-center justify-center border ${conf.iconBorderClass}`}>
          <Icon size={18} className={conf.iconClass} />
        </div>
      </div>

      <div className="relative z-10">
        <p className={`text-3xl font-display font-bold tracking-tight transition-colors ${conf.valueClass}`}>
          {type === 'records' ? value : fmt(value)}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {subValue !== undefined ? `${subValue} ` : ''}{conf.subTitle}
        </p>
      </div>
    </div>
  );
}
