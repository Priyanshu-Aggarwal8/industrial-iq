import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { generateActionableInsights } from '../../analytics/insights';
import { StatusBadge } from '../common/StatusBadge';

export const ActionCenterPreview: React.FC = () => {
  const { dataset, dateFilter, selectedBranchId, navigateTo } = useFilter();
  const insights = generateActionableInsights(dataset, dateFilter, selectedBranchId);

  // Surface top 3 most critical items
  const topInsights = insights.slice(0, 3);

  return (
    <div className="iq-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Action Center: Executive Bottlenecks & Operational Risks
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic, explainable operational alerts generated from verified dealership records.
          </p>
        </div>

        <button
          onClick={() => navigateTo('insights')}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 self-start sm:self-auto"
        >
          View All ({insights.length}) Alerts
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {topInsights.map(insight => (
          <div
            key={insight.id}
            className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <StatusBadge priority={insight.priority} />
                <span className="text-[11px] font-mono text-slate-500 uppercase">
                  {insight.scopeEntity}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 mb-1.5 leading-snug">
                {insight.title}
              </h3>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {insight.explanation}
              </p>

              <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono mb-3">
                <strong className="text-slate-300 block mb-0.5 font-sans">Evidence:</strong>
                {insight.evidence}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 mb-2">
                <strong className="text-sky-400 font-semibold">Directive: </strong>
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
                  className="w-full py-1.5 px-3 bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-800/80 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{insight.actionLabel || 'Investigate Issue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

