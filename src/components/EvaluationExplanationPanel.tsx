import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { HelpCircle, AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';

export const EvaluationExplanationPanel: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-lg border p-5 transition-colors ${
        isDark
          ? 'bg-[#080c14] border-cyan-500/20 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
        <h3 className="text-sm sm:text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
          How should these metrics be interpreted?
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
        <div
          className={`p-3 rounded border ${
            isDark ? 'bg-[#0c101a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1 text-cyan-400 dark:text-cyan-400 light:text-cyan-700">
            <Info className="w-3.5 h-3.5" />
            <span>ACCURACY</span>
          </div>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
            Percentage of test cases classified correctly out of total evaluated samples:
            <br />
            <span className="text-[11px] text-slate-500">(Correct Predictions ÷ Total Labeled Cases)</span>
          </p>
        </div>

        <div
          className={`p-3 rounded border ${
            isDark ? 'bg-[#0c101a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>PRECISION & RECALL</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            <strong>Precision:</strong> How often predicted cases were truly of that class.
            <br />
            <strong>Recall:</strong> How many of the ground-truth cases the agent successfully identified.
          </p>
        </div>

        <div
          className={`p-3 rounded border ${
            isDark ? 'bg-[#0c101a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-400">
            <Info className="w-3.5 h-3.5" />
            <span>F1 SCORE (MACRO-AVERAGED)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Harmonic mean balancing precision and recall across all classes equally:
            <br />
            <span className="text-[11px] text-slate-500">2 × (Precision × Recall) / (Precision + Recall)</span>
          </p>
        </div>

        <div
          className={`p-3 rounded border ${
            isDark ? 'bg-[#0c101a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1 text-purple-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>VERIFICATION DETECTION RATE</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Percentage of intentionally correct and incorrect audit vectors that the Verification Agent correctly identified, confirming cross-agent consistency.
          </p>
        </div>

        <div
          className={`p-3 rounded border md:col-span-2 ${
            isDark ? 'bg-[#0c101a] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1 text-blue-400">
            <Info className="w-3.5 h-3.5" />
            <span>FINANCIAL CALCULATION VALIDATION</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Direct deterministic audit checking whether numerical calculations (returns, volatility, extreme envelopes) agree with independently calculated reference values within strict mathematical tolerance (±0.05% for returns).
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div
        className={`mt-4 p-3.5 rounded border flex items-start gap-3 ${
          isDark
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}
      >
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono leading-relaxed">
          <strong className="uppercase font-bold tracking-wide block mb-0.5">
            Statistical & Empirical Disclaimer
          </strong>
          These evaluation metrics measure agent behavior on the selected benchmark test cases. They do not guarantee future financial performance. Evaluation benchmarks measure agent behavior on controlled test cases. Live analysis uses external market and news telemetry.
        </div>
      </div>
    </div>
  );
};
