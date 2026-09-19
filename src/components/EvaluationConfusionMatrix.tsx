import React from 'react';
import { ClassificationMetrics } from '../types/evaluation.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { Grid } from 'lucide-react';

interface ConfusionMatrixProps {
  metrics: ClassificationMetrics;
  title: string;
}

export const EvaluationConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ metrics, title }) => {
  const { isDark } = useTheme();
  const { labels, matrix } = metrics.confusionMatrix;

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isDark
          ? 'bg-[#080c14] border-cyan-500/20 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Grid className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
            {title} (Confusion Matrix)
          </h4>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isDark
              ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
              : 'bg-cyan-50 text-cyan-700 border-cyan-200'
          }`}
        >
          {metrics.totalCases} Ground-Truth Cases
        </span>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-mono">
        Rows = Ground Truth Reference • Columns = Agent Prediction
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th
                className={`p-2 text-left border-b text-[10px] uppercase ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}
              >
                Actual \ Pred
              </th>
              {labels.map((lbl) => (
                <th
                  key={lbl}
                  className={`p-2 text-center border-b font-bold ${
                    isDark ? 'border-slate-800 text-cyan-300' : 'border-slate-200 text-cyan-700'
                  }`}
                >
                  {lbl}
                </th>
              ))}
              <th
                className={`p-2 text-center border-b text-[10px] uppercase ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}
              >
                Recall
              </th>
            </tr>
          </thead>
          <tbody>
            {labels.map((actualLabel, rowIdx) => {
              const classPerf = metrics.perClass[actualLabel];
              return (
                <tr key={actualLabel}>
                  <td
                    className={`p-2 font-bold border-b ${
                      isDark ? 'border-slate-800/60 text-slate-300' : 'border-slate-100 text-slate-700'
                    }`}
                  >
                    {actualLabel}
                  </td>
                  {labels.map((predLabel, colIdx) => {
                    const count = matrix[rowIdx][colIdx];
                    const isDiagonal = rowIdx === colIdx;
                    let cellBg = '';
                    if (isDiagonal && count > 0) {
                      cellBg = isDark ? 'bg-emerald-950/40 text-emerald-300' : 'bg-emerald-50 text-emerald-700 font-bold';
                    } else if (!isDiagonal && count > 0) {
                      cellBg = isDark ? 'bg-rose-950/40 text-rose-300' : 'bg-rose-50 text-rose-700 font-bold';
                    } else {
                      cellBg = isDark ? 'text-slate-600' : 'text-slate-400';
                    }

                    return (
                      <td
                        key={predLabel}
                        className={`p-2 text-center border-b ${
                          isDark ? 'border-slate-800/60' : 'border-slate-100'
                        } ${cellBg}`}
                      >
                        {count}
                      </td>
                    );
                  })}
                  <td
                    className={`p-2 text-center border-b font-semibold ${
                      isDark ? 'border-slate-800/60 text-emerald-400' : 'border-slate-100 text-emerald-600'
                    }`}
                  >
                    {classPerf?.recall ?? 0}%
                  </td>
                </tr>
              );
            })}
            {/* Precision Footer Row */}
            <tr className={isDark ? 'bg-slate-900/50' : 'bg-slate-50'}>
              <td className="p-2 font-bold text-[10px] uppercase text-slate-500">
                Precision
              </td>
              {labels.map((lbl) => {
                const perf = metrics.perClass[lbl];
                return (
                  <td
                    key={`prec-${lbl}`}
                    className={`p-2 text-center font-semibold ${
                      isDark ? 'text-cyan-400' : 'text-cyan-700'
                    }`}
                  >
                    {perf?.precision ?? 0}%
                  </td>
                );
              })}
              <td className="p-2 text-center font-bold text-amber-500">
                F1: {metrics.macroF1}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
