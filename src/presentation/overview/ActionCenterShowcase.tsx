/**
 * LAYER 5: PRESENTATION - ACTION CENTER SHOWCASE
 * Refined to Vercel/Databricks alert and operational action standards:
 * - High-contrast priority badges with dot status indicators
 * - Code-like evidence blocks with monospace empirical parameters
 * - Sleek button actions with keyboard/navigation affordances
 */

import React from 'react';
import { ShieldAlert, ArrowRight, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';
import { DomainActionableInsight } from '../../domain/models';

interface ActionCenterProps {
  insights: DomainActionableInsight[];
  onViewAll: () => void;
  onNavigateAction: (url?: string) => void;
}

export const ActionCenterShowcase: React.FC<ActionCenterProps> = ({
  insights,
  onViewAll,
  onNavigateAction,
}) => {
  const topInsights = insights.slice(0, 3);

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Autonomous Intelligence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <span>Executive Action Center & Diagnostics</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1">
            Deterministic diagnostics isolating delivery delays, inquiry drop-offs, and order backlog bottlenecks requiring executive decisions.
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 shadow-subtle transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>View All ({insights.length}) Actions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {topInsights.map(insight => {
          const isCritical = insight.priority === 'critical';

          return (
            <div
              key={insight.id}
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-subtle transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Priority & Score Header */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      isCritical
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                    <span className="capitalize">{insight.priority} Priority</span>
                  </span>

                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 font-semibold">
                    Score: {insight.priorityScore}/100
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                  {insight.title}
                </h3>

                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4 line-clamp-2">
                  {insight.explanation}
                </p>

                {/* Evidence Code-like Callout */}
                <div className="p-3.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200 mb-4">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-sans font-bold block mb-1">
                    Empirical Proof
                  </span>
                  <span className="line-clamp-2">{insight.evidence}</span>
                </div>
              </div>

              {/* Recommended Action Footer */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 mt-auto">
                <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2 truncate font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{insight.recommendedAction}</span>
                </div>

                <button
                  onClick={() => onNavigateAction(insight.actionUrl)}
                  className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5 flex-shrink-0 transition-colors"
                >
                  <span>{insight.actionLabel || 'Inspect'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
