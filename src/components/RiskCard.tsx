import React from 'react';
import { RiskOutput } from '../types/financial.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { ShieldAlert, AlertOctagon, Info } from 'lucide-react';

interface RiskCardProps {
  risk: RiskOutput;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk }) => {
  const { isDark } = useTheme();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return {
          text: isDark ? 'text-[#ff007f]' : 'text-rose-700',
          bg: isDark ? 'bg-rose-950/80' : 'bg-rose-100',
          border: isDark ? 'border-rose-500/50' : 'border-rose-300',
          bar: 'bg-rose-500'
        };
      case 'Medium':
        return {
          text: isDark ? 'text-amber-400' : 'text-amber-700',
          bg: isDark ? 'bg-amber-950/80' : 'bg-amber-100',
          border: isDark ? 'border-amber-500/50' : 'border-amber-300',
          bar: 'bg-amber-500'
        };
      default:
        return {
          text: isDark ? 'text-emerald-400' : 'text-emerald-700',
          bg: isDark ? 'bg-emerald-950/80' : 'bg-emerald-100',
          border: isDark ? 'border-emerald-500/50' : 'border-emerald-300',
          bar: 'bg-emerald-500'
        };
    }
  };

  const style = getRiskColor(risk.overallRisk);

  return (
    <div
      className={`rounded-lg p-4 sm:p-5 shadow-lg flex flex-col h-full border transition-colors ${
        isDark
          ? 'bg-[#0b0f17] border-cyan-500/20 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-4 pb-3 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#ff007f]" />
          <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider">
            Risk & Exposure Assessment
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${style.bg} ${style.text} ${style.border}`}>
            {risk.overallRisk.toUpperCase()} RISK
          </span>
        </div>
      </div>

      {/* Risk Score Meter */}
      <div
        className={`p-3 rounded border mb-4 ${
          isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Risk Severity Metric
          </span>
          <span className={`font-bold ${style.text}`}>{risk.riskScore} / 100</span>
        </div>
        <div
          className={`h-2 w-full rounded-full overflow-hidden ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        >
          <div
            style={{ width: `${risk.riskScore}%` }}
            className={`h-full ${style.bar} transition-all duration-500`}
          />
        </div>
        <div
          className={`flex justify-between text-[9px] font-mono mt-1 ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          <span>0 (Minimal)</span>
          <span>50 (Moderate)</span>
          <span>100 (Severe)</span>
        </div>
      </div>

      {/* Synthesis explanation */}
      <div
        className={`text-xs font-mono leading-relaxed mb-3 p-2.5 rounded border ${
          isDark
            ? 'bg-[#080b12] border-slate-800/60 text-slate-300'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        {risk.explanation}
      </div>

      {/* Itemized Risk Factors */}
      <div className="flex-1 overflow-y-auto pr-1 mb-3">
        <div
          className={`text-[11px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          <AlertOctagon className="w-3 h-3 text-rose-500" />
          <span>Vulnerability Factors</span>
        </div>
        <ul className="space-y-1.5">
          {risk.riskFactors.map((factor, idx) => (
            <li
              key={idx}
              className={`text-xs font-mono flex items-start gap-2 p-2 rounded border transition-colors ${
                isDark
                  ? 'bg-[#080b12] border-slate-800/60 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <span className="text-[#ff007f] font-bold">›</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div
        className={`text-[10px] font-mono p-2 rounded border flex items-start gap-1.5 ${
          isDark
            ? 'text-slate-500 bg-slate-900/40 border-slate-800'
            : 'text-slate-600 bg-slate-100 border-slate-200'
        }`}
      >
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>{risk.disclaimer}</span>
      </div>
    </div>
  );
};
