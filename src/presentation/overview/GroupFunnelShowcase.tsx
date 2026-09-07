/**
 * LAYER 5: PRESENTATION - GROUP FUNNEL SHOWCASE
 * Refined to Vercel/Databricks conversion analytics standards:
 * - Clean progressive milestone cards with stage-by-stage drop-off tracking
 * - Segmented cohort vs period toggle
 * - Opportunity exit attribution with structured breakdown bars
 */

import React from 'react';
import { Filter, ArrowDown } from 'lucide-react';
import { DomainFunnelAnalysis } from '../../domain/models';
import { formatPercent, formatInteger } from '../../infrastructure/formatters';

interface GroupFunnelProps {
  funnel: DomainFunnelAnalysis;
  currentMode: 'cohort' | 'event';
  onModeChange: (mode: 'cohort' | 'event') => void;
}

export const GroupFunnelShowcase: React.FC<GroupFunnelProps> = ({
  funnel,
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Pipeline Velocity
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight flex items-center gap-2.5">
            <Filter className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <span>Conversion Funnel & Drop-off Analysis</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1">
            Stage-by-stage progression tracking from initial inquiry to final vehicle delivery.
          </p>
        </div>

        {/* Segmented Toggle */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm self-start sm:self-auto">
          <button
            onClick={() => onModeChange('cohort')}
            className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
              currentMode === 'cohort'
                ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
            }`}
          >
            Cohort Funnel ({funnel.totalLeadsInScope})
          </button>
          <button
            onClick={() => onModeChange('event')}
            className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
              currentMode === 'event'
                ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
            }`}
          >
            Period Throughput
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Funnel Stages (8 cols) */}
        <div className="lg:col-span-8 space-y-2.5">
          {funnel.stages.map((stage, idx) => {
            const isLast = idx === funnel.stages.length - 1;
            const dropoff = funnel.stageDropoffs.find(d => d.fromStage === stage.label);

            return (
              <div key={stage.stage} className="space-y-1.5">
                <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 group">
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-bold flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shadow-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-base sm:text-lg text-neutral-950 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {stage.label}
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {idx === 0
                          ? 'Inbound showroom & digital customer inquiries'
                          : `${stage.conversionFromPrev.toFixed(1)}% conversion from previous stage`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 sm:text-right">
                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold block mb-0.5">Volume</span>
                      <span className="text-base sm:text-lg font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
                        {formatInteger(stage.count)}
                      </span>
                    </div>

                    <div className="w-24">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold block mb-0.5">Throughput</span>
                      <span
                        className={`text-base sm:text-lg font-bold tabular-nums ${
                          isLast ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-100'
                        }`}
                      >
                        {formatPercent(stage.conversionFromFirst / 100)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Drop-off connector */}
                {dropoff && dropoff.lostCount > 0 && (
                  <div className="flex items-center gap-2 pl-6 py-1 text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-semibold">
                    <ArrowDown className="w-4 h-4 text-rose-500" />
                    <span>
                      {dropoff.lostCount} leads dropped off ({dropoff.dropRate.toFixed(1)}% leakage)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Lost Reasons Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
              Leakage Breakdown
            </span>
            <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-neutral-100">
              Lost Opportunity Attribution
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Empirical categorization of why inquiries failed to convert.
            </p>
          </div>

          <div className="space-y-3 flex-1 pt-1">
            {funnel.lostReasonsBreakdown.map(r => (
              <div
                key={r.reason}
                className="p-3.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-xs"
              >
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{r.reason}</span>
                  <span className="font-bold text-neutral-950 dark:text-neutral-50 tabular-nums ml-2">
                    {r.count} <span className="text-neutral-400 dark:text-neutral-500 font-normal">({r.percentage.toFixed(0)}%)</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-950 dark:bg-neutral-100 rounded-full transition-all"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">Analysis:</span> Pricing and competitor selection drive 70%+ of drop-offs, while late-December records show high unrecorded attrition.
          </div>
        </div>
      </div>
    </div>
  );
};
