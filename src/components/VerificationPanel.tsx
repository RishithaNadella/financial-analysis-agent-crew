import React from 'react';
import { VerificationOutput } from '../types/financial.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { CheckCircle, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface VerificationPanelProps {
  verification: VerificationOutput;
  onSimulateRetry?: () => void;
  isRunning?: boolean;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  verification,
  onSimulateRetry,
  isRunning = false
}) => {
  const { isDark } = useTheme();
  const isVerified = verification.status === 'VERIFIED';

  return (
    <div
      className={`rounded-lg p-4 sm:p-5 shadow-lg border transition-colors ${
        isDark
          ? 'bg-[#0b0f17] border-cyan-500/20 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck
            className={`w-5 h-5 ${
              isVerified
                ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                : isDark ? 'text-amber-400' : 'text-amber-600'
            }`}
          />
          <div>
            <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider">
              Verification Agent Audit Engine
            </h3>
            <p className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Cross-agent mathematical reconciliation & integrity checks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {verification.retriesAttempted > 0 && (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 border ${
                isDark
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              Recalculations: {verification.retriesAttempted}
            </span>
          )}

          <span
            className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
              isVerified
                ? isDark
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 glow-cyan'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : isDark
                ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {isVerified ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            STATUS: {verification.status}
          </span>

          {onSimulateRetry && (
            <button
              id="btn-simulate-retry"
              onClick={onSimulateRetry}
              disabled={isRunning}
              title="Demonstrate the verification agent detecting an intentional discrepancy and autonomously triggering a data recalculation"
              className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded border transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer ${
                isDark
                  ? 'bg-[#06080d] text-cyan-400 border-cyan-500/40 hover:bg-cyan-950/40 hover:border-cyan-400'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-300 hover:bg-cyan-100 hover:border-cyan-400'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              <span>Test Discrepancy & Recalculate</span>
            </button>
          )}
        </div>
      </div>

      {/* Issues if any */}
      {verification.issues && verification.issues.length > 0 && (
        <div
          className={`mb-4 p-3 rounded text-xs font-mono space-y-1 border ${
            isDark
              ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Audit Findings / Corrective Action:
          </div>
          {verification.issues.map((issue, idx) => (
            <div key={idx} className="pl-5">
              • {issue}
            </div>
          ))}
        </div>
      )}

      {/* Checks Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {verification.checks.map((chk) => (
          <div
            key={chk.id}
            className={`p-2.5 rounded border font-mono text-xs transition-colors ${
              chk.passed
                ? isDark
                  ? 'bg-[#080c14] border-slate-800/80 hover:border-emerald-500/40'
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
                : isDark
                ? 'bg-rose-950/30 border-rose-500/40'
                : 'bg-rose-50 border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500 font-bold">{chk.id}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  chk.passed
                    ? isDark
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isDark
                    ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {chk.passed ? 'PASSED' : 'RETRY'}
              </span>
            </div>

            <div
              className={`font-bold text-xs mb-1 truncate ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
              title={chk.name}
            >
              {chk.name}
            </div>

            <div
              className={`text-[11px] space-y-0.5 mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <div className="flex justify-between">
                <span className="text-slate-500">Expected:</span>
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  {String(chk.expectedValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Computed:</span>
                <span
                  className={
                    chk.passed
                      ? isDark ? 'text-emerald-400 font-semibold' : 'text-emerald-700 font-semibold'
                      : isDark ? 'text-rose-400 font-semibold' : 'text-rose-700 font-semibold'
                  }
                >
                  {String(chk.computedValue)}
                </span>
              </div>
            </div>

            <div
              className={`text-[10px] italic truncate ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
              title={chk.notes}
            >
              {chk.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
