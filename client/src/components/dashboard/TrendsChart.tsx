import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendsChartProps {
  loading: boolean;
  trendData: any[];
}

export function TrendsChart({ loading, trendData }: TrendsChartProps) {
  return (
    <div className="xl:col-span-2 bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Ambient glow behind chart */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent pointer-events-none" />
      <h3 className="text-lg font-display font-semibold text-white mb-6 tracking-tight relative z-10">
        Monthly Cash Flow
      </h3>
      {loading ? (
        <div className="h-72 flex items-center justify-center relative z-10">
          <div className="w-8 h-8 border-4 border-sky-500/30 border-t-sky-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="relative z-10">
            <ResponsiveContainer width="100%" height={288}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickFormatter={(v) => {
                    const [, m] = v.split('-');
                    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m) - 1];
                }}
                dy={10}
                />
                <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} 
                />
                <Tooltip
                contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                    color: '#f8fafc'
                }}
                itemStyle={{ color: '#f8fafc' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                labelFormatter={(label) => {
                    const [y, m] = label.split('-');
                    return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m) - 1]} ${y}`;
                }}
                />
                <Area type="monotone" dataKey="income" stroke="#34d399" fill="url(#incomeGrad)" strokeWidth={3} name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#fb7185" fill="url(#expenseGrad)" strokeWidth={3} name="Expenses" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
