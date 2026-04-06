import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';
import type { ChartConfig } from '../../types';
import { CHART_COLORS } from '../ui/constants';

interface ChartRendererProps {
  config: ChartConfig;
  data: any[];
  isLoading?: boolean;
}

const isDark = () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

const colors = {
  text: isDark() ? '#94a3b8' : '#64748b',
  grid: isDark() ? '#334155' : '#e2e8f0',
  tooltip: isDark() ? '#1e293b' : '#ffffff',
  tooltipBorder: isDark() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
};

export function ChartRenderer({ config, data, isLoading }: ChartRendererProps) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-surface-500 dark:text-slate-400 text-sm">
        No data available for this chart
      </div>
    );
  }

  const getColors = () => ({
    text: isDark() ? '#94a3b8' : '#64748b',
    grid: isDark() ? '#334155' : '#e2e8f0',
    tooltip: isDark() ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tooltipText: isDark() ? '#f8fafc' : '#1e293b',
    income: isDark() ? '#34d399' : '#10b981',
    expense: isDark() ? '#fb7185' : '#ef4444',
  });

  const c = getColors();

  const tooltipStyle = {
    backgroundColor: c.tooltip,
    border: `1px solid ${c.tooltipBorder}`,
    borderRadius: '12px',
    color: c.tooltipText,
  };

  const renderChart = () => {
    switch (config.type) {
      case 'LINE':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke={c.text} 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: c.text }}
            />
            <YAxis 
              stroke={c.text} 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: c.text }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              itemStyle={{ fontSize: '12px' }}
            />
            {config.showLegend && <Legend verticalAlign="top" height={36}/>}
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke={c.income} 
              strokeWidth={3} 
              dot={{ r: 4, fill: c.income, strokeWidth: 2, stroke: c.tooltip }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke={c.expense} 
              strokeWidth={3} 
              dot={{ r: 4, fill: c.expense, strokeWidth: 2, stroke: c.tooltip }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        );

      case 'BAR':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
            <XAxis dataKey="month" stroke={c.text} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={c.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="income" fill={c.income} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill={c.expense} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'PIE':
        return (
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="total"
              nameKey="category"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            {config.showLegend && <Legend layout="vertical" align="right" verticalAlign="middle" />}
          </PieChart>
        );

      case 'AREA':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.income} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={c.income} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
            <XAxis dataKey="month" stroke={c.text} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={c.text} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="income" stroke={c.income} fillOpacity={1} fill="url(#colorIncome)" />
          </AreaChart>
        );

      default:
        return <div className="text-surface-500 dark:text-slate-400">Unsupported chart type: {config.type}</div>;
    }
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
