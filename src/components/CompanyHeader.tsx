import React from 'react';
import { FinancialMetrics } from '../types/financial.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { TrendingUp, TrendingDown, Clock, ShieldCheck, Database } from 'lucide-react';

interface CompanyHeaderProps {
  metrics: FinancialMetrics;
  isDemo: boolean;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ metrics, isDemo }) => {
  const { isDark } = useTheme();
  const isPositive = metrics.change30d >= 0;
  const updatedTime = new Date(metrics.retrievedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div
      className={`relative rounded-lg p-5 shadow-lg crt-grid-bg overflow-hidden border transition-colors ${
        isDark
          ? 'bg-[#0b0f17] border-cyan-500/30 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff007f]" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff007f]" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Company Identity */}
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`px-2 py-0.5 text-[11px] font-mono tracking-wider font-semibold rounded border ${
                isDark
                  ? 'bg-cyan-950/80 text-[#00f0ff] border-cyan-500/40'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-300'
              }`}
            >
              {metrics.exchange} : {metrics.ticker}
            </span>
            {metrics.isLiveData ? (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded flex items-center gap-1 border ${
                  isDark
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE DATA
              </span>
            ) : (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded flex items-center gap-1 border ${
                  isDark
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                DEMO DATA (Sample Model)
              </span>
            )}
            <span
              className={`flex items-center gap-1 text-[11px] font-mono ${
                isDark ? 'text-emerald-400' : 'text-emerald-600 font-semibold'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUDIT VERIFIED</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-['Chakra_Petch',sans-serif] uppercase">
            {metrics.companyName}
          </h1>

          <div
            className={`flex items-center gap-3 text-xs font-mono mt-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-cyan-500" />
              {metrics.dataSource}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Last Synced: {updatedTime}
            </span>
          </div>
        </div>

        {/* Current Price & Momentum Box */}
        <div
          className={`flex items-baseline md:items-end flex-col px-4 py-2.5 rounded border transition-colors ${
            isDark
              ? 'bg-[#06080d]/80 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div
            className={`text-[10px] font-mono tracking-wider uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            MARKET PRICE ({metrics.currency})
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span
              className={`text-3xl font-bold font-mono tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {metrics.currency === 'INR' ? '₹' : '$'}
              {metrics.currentPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold ${
                isPositive
                  ? isDark
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isDark
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {isPositive ? '+' : ''}
                {metrics.change30d}%
              </span>
              <span className="text-[10px] opacity-70 font-normal">30D</span>
            </div>
          </div>
          <div
            className={`text-[11px] font-mono mt-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Prev Close: {metrics.currency === 'INR' ? '₹' : '$'}
            {metrics.previousClose.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
