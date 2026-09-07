import React, { useState } from 'react';
import { Filter, ArrowDown, TrendingDown, CheckCircle, Info } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { calculateFunnelMetrics } from '../../analytics/funnel';
import { formatPercent, formatInteger } from '../../utils/formatters';

export const FunnelOverview: React.FC = () => {
  const { dataset, dateFilter, selectedBranchId } = useFilter();
  const [funnelMode, setFunnelMode] = useState<'cohort' | 'event'>('cohort');

  const funnelResult = calculateFunnelMetrics(
    dataset,
    dateFilter,
    funnelMode,
    selectedBranchId
  );

  const topStageCount = funnelResult.stages[0]?.count || 1;

  return (
    <div className="iq-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Lead Conversion Funnel & Leakage Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reconstructed from complete lead status histories. Inspect drop-off rates at each progressive milestone.
          </p>
        </div>

        {/* Funnel Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFunnelMode('cohort')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              funnelMode === 'cohort'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tracks leads created in this period through to their current stage"
          >
            Cohort Funnel
          </button>
          <button
            onClick={() => setFunnelMode('event')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              funnelMode === 'event'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Counts stage transitions that occurred during the selected period"
          >
            Period Throughput
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Funnel Stage Progression (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {funnelResult.stages.map((stage, idx) => {
            const widthPct = topStageCount > 0 ? (stage.count / topStageCount) * 100 : 0;
            const isDelivered = stage.stage === 'delivered';

            return (
              <div key={stage.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 w-4">{idx + 1}.</span>
                    <span className="font-semibold text-slate-200">{stage.label}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-white font-bold">{formatInteger(stage.count)}</span>
                    <span className="text-slate-400 text-[11px]">
                      ({formatPercent(stage.conversionFromFirst)} of top)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-5 rounded-md overflow-hidden p-0.5 border border-slate-800/80">
                  <div
                    className={`h-full rounded transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold ${
                      isDelivered
                        ? 'bg-emerald-500 text-emerald-950'
                        : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white'
                    }`}
                    style={{ width: `${Math.max(4, widthPct)}%` }}
                  >
                    {widthPct >= 18 && `${formatPercent(widthPct)}`}
                  </div>
                </div>

                {/* Drop-off from previous stage */}
                {idx > 0 && (
                  <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
                    <div className="flex items-center gap-1 text-amber-400/90">
                      <ArrowDown className="w-3 h-3" />
                      <span>{formatPercent(stage.conversionFromPrev)} conversion</span>
                    </div>
                    {stage.dropCount > 0 && (
                      <span className="text-rose-400/80">
                        -{formatInteger(stage.dropCount)} leads dropped
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Lost Reasons Breakdown & Overall Conversion (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Primary Loss Drivers
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {funnelResult.lostReasonsBreakdown.reduce((s, r) => s + r.count, 0)} Total Lost
              </span>
            </div>

            <div className="space-y-2.5">
              {funnelResult.lostReasonsBreakdown.slice(0, 6).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[200px]" title={item.reason}>
                      {item.reason}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {item.count} ({formatPercent(item.percentage)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-rose-500/80 h-full rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Net Conversion (Top to Delivery):</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {formatPercent(funnelResult.overallConversionRate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
        <span>
          <strong className="text-slate-200">Methodology:</strong> Funnel stages reflect strict forward progression (New → Contacted → Test Drive → Negotiation → Order Placed → Delivered). Leads exit to 'Lost' at any intermediate stage.
        </span>
      </div>
    </div>
  );
};

