import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS } from '../ui/constants';

interface CategoryBreakdownProps {
  categoryData: any[];
}

export function CategoryBreakdown({ categoryData }: CategoryBreakdownProps) {
  const isDark = () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  
  const categoryChart = (categoryData || [])
    .reduce<{ category: string; total: number }[]>((acc, item) => {
      const existing = acc.find((c) => c.category === item.category);
      if (existing) {
        existing.total += item.total;
      } else {
        acc.push({ category: item.category, total: item.total });
      }
      return acc;
    }, [])
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const colors = {
    text: isDark() ? '#94a3b8' : '#64748b',
    grid: isDark() ? '#334155' : '#e2e8f0',
    tooltip: isDark() ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tooltipText: isDark() ? '#f8fafc' : '#1e293b',
  };

  return (
    <div className="bg-surface-50/50 dark:bg-slate-900/40 backdrop-blur-xl border border-surface-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <h3 className="text-lg font-display font-semibold text-surface-700 dark:text-white mb-6 tracking-tight relative z-10">
        Top Categories
      </h3>
      {categoryChart.length === 0 ? (
        <p className="text-sm text-surface-500 dark:text-slate-400 text-center py-10 relative z-10">No data yet</p>
      ) : (
        <div className="relative z-10">
          <ResponsiveContainer width="100%" height={288}>
            <BarChart data={categoryChart} layout="vertical" margin={{ left: 10, top: 0, right: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} opacity={0.5} />
              <XAxis 
                type="number" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: colors.text }} 
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} 
              />
              <YAxis 
                type="category" 
                dataKey="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: colors.text }} 
                width={90} 
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} 
                contentStyle={{ 
                  backgroundColor: colors.tooltip,
                  borderRadius: '12px', 
                  border: `1px solid ${colors.tooltipBorder}`,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                  color: colors.tooltipText,
                }} 
                cursor={{fill: isDark() ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={20}>
                {categoryChart.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
