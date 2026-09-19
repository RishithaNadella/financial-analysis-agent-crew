import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { HistoricalDataPoint } from '../types/financial.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { Calendar } from 'lucide-react';

interface PriceChartProps {
  historicalData: HistoricalDataPoint[];
  currency: string;
  ticker: string;
}

type Timeframe = '7D' | '30D' | '90D';

export const PriceChart: React.FC<PriceChartProps> = ({ historicalData, currency, ticker }) => {
  const { isDark } = useTheme();
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');

  const filteredData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];
    const count = timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 90;
    return historicalData.slice(Math.max(0, historicalData.length - count));
  }, [historicalData, timeframe]);

  const { minPrice, maxPrice, priceDiff, pctChange } = useMemo(() => {
    if (filteredData.length === 0) return { minPrice: 0, maxPrice: 0, priceDiff: 0, pctChange: 0 };
    const prices = filteredData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const first = filteredData[0].price;
    const last = filteredData[filteredData.length - 1].price;
    const diff = last - first;
    const pct = first > 0 ? (diff / first) * 100 : 0;
    return {
      minPrice: Number((min * 0.985).toFixed(2)),
      maxPrice: Number((max * 1.015).toFixed(2)),
      priceDiff: Number(diff.toFixed(2)),
      pctChange: Number(pct.toFixed(2))
    };
  }, [filteredData]);

  const currSymbol = currency === 'INR' ? '₹' : '$';

  return (
    <div
      className={`rounded-lg p-4 sm:p-5 shadow-lg relative overflow-hidden border transition-colors ${
        isDark
          ? 'bg-[#0b0f17] border-cyan-500/20 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider">
              Historical Price Action
            </h3>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border ${
                isDark
                  ? 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30'
                  : 'text-cyan-800 bg-cyan-50 border-cyan-300 font-semibold'
              }`}
            >
              {ticker}
            </span>
          </div>
          <div
            className={`text-xs font-mono mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Range Performance:{' '}
            <span
              className={
                pctChange >= 0
                  ? isDark ? 'text-emerald-400 font-bold' : 'text-emerald-600 font-bold'
                  : isDark ? 'text-rose-400 font-bold' : 'text-rose-600 font-bold'
              }
            >
              {pctChange >= 0 ? '+' : ''}
              {pctChange}% ({currSymbol}
              {priceDiff >= 0 ? '+' : ''}
              {priceDiff})
            </span>
          </div>
        </div>

        {/* Timeframe selector tabs */}
        <div
          className={`flex items-center p-1 rounded border self-start sm:self-auto ${
            isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {(['7D', '30D', '90D'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              id={`btn-timeframe-${tf.toLowerCase()}`}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-all cursor-pointer ${
                timeframe === tf
                  ? isDark
                    ? 'bg-cyan-500/20 text-[#00f0ff] border border-cyan-500/50 shadow-sm'
                    : 'bg-white text-cyan-800 border border-slate-300 shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradientCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? '#00f0ff' : '#0284c7'} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={isDark ? '#00f0ff' : '#0284c7'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke={isDark ? '#64748b' : '#94a3b8'}
                tick={{
                  fill: isDark ? '#64748b' : '#475569',
                  fontSize: 10,
                  fontFamily: 'monospace'
                }}
                tickLine={false}
                axisLine={{ stroke: isDark ? '#1e293b' : '#cbd5e1' }}
                tickFormatter={(str) => {
                  const parts = str.split('-');
                  return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : str;
                }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke={isDark ? '#64748b' : '#94a3b8'}
                tick={{
                  fill: isDark ? '#64748b' : '#475569',
                  fontSize: 10,
                  fontFamily: 'monospace'
                }}
                tickLine={false}
                axisLine={{ stroke: isDark ? '#1e293b' : '#cbd5e1' }}
                tickFormatter={(val) =>
                  `${currSymbol}${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`
                }
                orientation="right"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as HistoricalDataPoint;
                    return (
                      <div
                        className={`p-2.5 rounded shadow-xl font-mono text-xs z-50 border ${
                          isDark
                            ? 'bg-[#05070a] border-cyan-500/50 text-white'
                            : 'bg-white border-cyan-600 text-slate-900 shadow-md'
                        }`}
                      >
                        <div
                          className={`text-[10px] mb-1 flex items-center gap-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          <Calendar className="w-3 h-3 text-cyan-500" />
                          {data.date}
                        </div>
                        <div className="text-sm font-bold mb-1">
                          Close: {currSymbol}
                          {data.price.toLocaleString()}
                        </div>
                        {data.high && data.low && (
                          <div
                            className={`text-[10px] flex gap-3 ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            <span>
                              High:{' '}
                              <span className={isDark ? 'text-cyan-300' : 'text-cyan-700 font-bold'}>
                                {currSymbol}
                                {data.high}
                              </span>
                            </span>
                            <span>
                              Low:{' '}
                              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                {currSymbol}
                                {data.low}
                              </span>
                            </span>
                          </div>
                        )}
                        {data.volume && data.volume > 0 && (
                          <div
                            className={`text-[10px] mt-1 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            Vol: {data.volume.toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isDark ? '#00f0ff' : '#0284c7'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#priceGradientCyan)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: isDark ? '#00f0ff' : '#0284c7',
                  stroke: isDark ? '#06080d' : '#ffffff',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 font-mono text-sm">
            No historical price data loaded
          </div>
        )}
      </div>
    </div>
  );
};
