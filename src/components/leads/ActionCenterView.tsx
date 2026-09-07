import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Info,
  Clock,
  Target,
  Truck,
  TrendingDown,
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { generateActionableInsights } from '../../analytics/insights';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { InsightCategory } from '../../types';

export const ActionCenterView: React.FC = () => {
  const { dataset, dateFilter, selectedBranchId, navigateTo } = useFilter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allInsights = generateActionableInsights(dataset, dateFilter, selectedBranchId);

  const filteredInsights = allInsights.filter(i => {
    if (selectedCategory === 'all') return true;
    return i.category === selectedCategory;
  });

  const criticalCount = allInsights.filter(i => i.priority === 'critical').length;
  const highCount = allInsights.filter(i => i.priority === 'high').length;

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: 'Action Center' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Action Center: Operational Bottlenecks & Executive Alerts
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic risk detection engine. Every alert is grounded in verified dealership data with quantitative evidence and direct operational directives.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            {criticalCount} Critical
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-semibold">
            {highCount} High Priority
          </span>
        </div>
      </div>

      {/* Methodology Explainer Banner */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white font-semibold">Deterministic Scoring Engine: </strong>
          Alerts are prioritized (0–100 score) based on quota variance, revenue impact, unfulfilled fulfillment duration, and funnel leak severity. No arbitrary thresholds or black-box predictions are used.
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: `All Alerts (${allInsights.length})` },
          { id: 'attainment', label: 'Target Crises' },
          { id: 'bottleneck', label: 'Funnel Drops' },
          { id: 'fulfillment', label: 'Delivery Delays & Backlog' },
          { id: 'aging', label: 'Stale High-Value Deals' },
          { id: 'channel', label: 'Channel Efficiency' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Insight Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInsights.map(insight => (
          <div
            key={insight.id}
            className="iq-card p-6 flex flex-col justify-between hover:border-slate-700 transition-all border-l-4 border-l-sky-500"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <StatusBadge priority={insight.priority} />
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                    {insight.category}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Priority: <span className="text-white">{insight.priorityScore}</span>/100
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {insight.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {insight.explanation}
              </p>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-4 text-xs font-mono text-slate-300">
                <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  Supporting Empirical Evidence
                </div>
                <div className="text-slate-200">{insight.evidence}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <div className="text-xs text-slate-300 mb-3 leading-relaxed">
                <strong className="text-sky-400 font-semibold block mb-0.5">
                  Recommended Operational Directive:
                </strong>
                {insight.recommendedAction}
              </div>

              {insight.actionUrl && (
                <button
                  onClick={() => {
                    const cleanUrl = insight.actionUrl?.replace(/^#\/?/, '') || '';
                    const [path, query] = cleanUrl.split('?');
                    const parts = path.split('/');
                    const route = parts[0] as any;
                    const queryParams: Record<string, string> = {};
                    if (query) {
                      new URLSearchParams(query).forEach((v, k) => {
                        queryParams[k] = v;
                      });
                    }

                    if (route === 'branches') {
                      navigateTo('branches', { branchId: parts[1], ...queryParams });
                    } else if (route === 'leads') {
                      navigateTo('leads', {
                        statusFilter: queryParams.status,
                        quickFilter: queryParams.filter,
                        sourceFilter: queryParams.source,
                      });
                    } else {
                      navigateTo(route || 'overview');
                    }
                  }}
                  className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-sky-600/30"
                >
                  <span>{insight.actionLabel || 'Investigate Operational Record'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

