import React from 'react';
import { FinancialMetrics } from '../types/financial.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { Activity, ArrowUpRight, ArrowDownRight, BarChart3, DollarSign } from 'lucide-react';

interface MetricsCardsProps {
  metrics: FinancialMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const { isDark } = useTheme();
  const isPos7d = metrics.change7d >= 0;
  const isPos30d = metrics.change30d >= 0;
  const curr = metrics.currency === 'INR' ? '₹' : '$';

  const cards = [
    {
      id: 'metric-curr-price',
      label: 'Current Price',
      value: `${curr}${metrics.currentPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      sub: `${metrics.currency} • ${metrics.exchange}`,
      icon: DollarSign,
      accentDark: 'border-cyan-500/30 text-cyan-400',
      accentLight: 'border-cyan-200 text-cyan-700'
    },
    {
      id: 'metric-7d-change',
      label: '7-Day Return',
      value: `${isPos7d ? '+' : ''}${metrics.change7d}%`,
      sub: isPos7d ? 'Short-term upward drift' : 'Short-term pullback',
      icon: isPos7d ? ArrowUpRight : ArrowDownRight,
      accentDark: isPos7d ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400',
      accentLight: isPos7d ? 'border-emerald-200 text-emerald-700' : 'border-rose-200 text-rose-700'
    },
    {
      id: 'metric-30d-change',
      label: '30-Day Return',
      value: `${isPos30d ? '+' : ''}${metrics.change30d}%`,
      sub: isPos30d ? 'Monthly momentum positive' : 'Monthly momentum negative',
      icon: isPos30d ? ArrowUpRight : ArrowDownRight,
      accentDark: isPos30d ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400',
      accentLight: isPos30d ? 'border-emerald-200 text-emerald-700' : 'border-rose-200 text-rose-700'
    },
    {
      id: 'metric-30d-high',
      label: '30-Day High',
      value: `${curr}${metrics.high30d.toLocaleString()}`,
      sub: `Spread: +${(((metrics.high30d - metrics.currentPrice) / metrics.currentPrice) * 100).toFixed(1)}%`,
      icon: BarChart3,
      accentDark: 'border-cyan-500/30 text-cyan-300',
      accentLight: 'border-slate-200 text-cyan-800'
    },
    {
      id: 'metric-30d-low',
      label: '30-Day Low',
      value: `${curr}${metrics.low30d.toLocaleString()}`,
      sub: `Drawdown: ${(((metrics.currentPrice - metrics.low30d) / metrics.currentPrice) * 100).toFixed(1)}%`,
      icon: BarChart3,
      accentDark: 'border-slate-700 text-slate-300',
      accentLight: 'border-slate-200 text-slate-700'
    },
    {
      id: 'metric-volatility',
      label: '30D Volatility (Ann.)',
      value: `${metrics.volatility}%`,
      sub: metrics.volatility > 30 ? 'High historical variance' : metrics.volatility > 20 ? 'Moderate variance' : 'Low volatility',
      icon: Activity,
      accentDark: metrics.volatility > 30 ? 'border-magenta-500/40 text-[#ff007f]' : 'border-cyan-500/30 text-cyan-400',
      accentLight: metrics.volatility > 30 ? 'border-rose-200 text-rose-700' : 'border-cyan-200 text-cyan-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.id}
            id={c.id}
            className={`border rounded p-3 relative overflow-hidden transition-all group ${
              isDark
                ? `bg-[#0b0f17]/90 ${c.accentDark} hover:bg-[#101622]`
                : `bg-white ${c.accentLight} shadow-sm hover:bg-slate-50`
            }`}
          >
            <div
              className={`flex items-center justify-between mb-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                {c.label}
              </span>
              <IconComponent className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div
              className={`text-lg sm:text-xl font-bold font-mono tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {c.value}
            </div>
            <div
              className={`text-[10px] font-mono truncate mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {c.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
};
