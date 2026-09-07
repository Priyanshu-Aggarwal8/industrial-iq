import React, { useState } from 'react';
import {
  Building2,
  User,
  Car,
  DollarSign,
  Target,
  Truck,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { calculateBranchPerformanceSummaries } from '../../analytics/targets';
import { calculateFunnelMetrics } from '../../analytics/funnel';
import { calculateRepPerformanceSummaries } from '../../analytics/aging';
import { calculateDeliveryAnalytics } from '../../analytics/delivery';
import { generateActionableInsights } from '../../analytics/insights';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import {
  formatCurrency,
  formatInteger,
  formatPercent,
  formatDurationDays,
} from '../../utils/formatters';

export const BranchDetailView: React.FC<{ branchId: string }> = ({ branchId }) => {
  const { dataset, dateFilter, navigateTo, setInspectingLeadId } = useFilter();
  const [funnelMode, setFunnelMode] = useState<'cohort' | 'event'>('cohort');

  const branch = dataset.branchesById.get(branchId);
  if (!branch) {
    return (
      <EmptyState
        title="Branch Not Found"
        description={`No dealership branch matches identifier '${branchId}'.`}
        actionText="Return to Branches"
        onAction={() => navigateTo('branches')}
      />
    );
  }

  // Branch summaries
  const allSummaries = calculateBranchPerformanceSummaries(dataset, dateFilter);
  const summary = allSummaries.find(s => s.branch.id === branchId)!;

  // Branch reps
  const branchReps = calculateRepPerformanceSummaries(dataset, branchId);
  const manager = dataset.salesReps.find(
    r => r.branch_id === branchId && r.role === 'branch_manager'
  );

  // Branch funnel
  const funnel = calculateFunnelMetrics(dataset, dateFilter, funnelMode, branchId);

  // Branch delivery
  const deliveryAnalytics = calculateDeliveryAnalytics(dataset, dateFilter, branchId);

  // Branch actionable insights
  const branchInsights = generateActionableInsights(dataset, dateFilter, branchId).filter(
    i => i.scopeId === branchId || i.scopeEntity === 'branch'
  );

  // Branch recent active leads
  const branchLeads = dataset.leads
    .filter(l => l.branch_id === branchId)
    .sort((a, b) => (b.days_inactive ?? 0) - (a.days_inactive ?? 0));

  const staleLeads = branchLeads.filter(
    l => l.status !== 'delivered' && l.status !== 'lost' && (l.days_inactive ?? 0) >= 7
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        crumbs={[
          { label: 'Branches', route: 'branches' },
          { label: branch.name },
        ]}
      />

      {/* Branch Header Profile */}
      <div className="iq-card p-6 border-l-4 border-l-sky-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                {branch.id}
              </span>
              <span className="text-xs text-slate-400 font-medium">{branch.city}, India</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{branch.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Branch Leadership:{' '}
              <strong className="text-slate-200">{manager ? manager.name : 'Unassigned'}</strong> (Branch Manager)
              {' • '}
              <span className="text-slate-300">{branchReps.length} Quota Officers</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('leads', { branchId: branch.id })}
              className="px-3 py-1.5 text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-800 rounded-lg hover:bg-sky-900/60 transition-colors"
            >
              View Branch Leads ({branchLeads.length})
            </button>
          </div>
        </div>
      </div>

      {/* Branch KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Delivered Units"
          value={formatInteger(summary.deliveredUnits)}
          subtitle={`${formatPercent(summary.unitAttainment)} of Target`}
          target={formatInteger(summary.targetUnits)}
          attainment={summary.unitAttainment}
          gap={`${summary.unitGap >= 0 ? '+' : ''}${summary.unitGap} units`}
          statusText={summary.unitAttainment >= 75 ? 'Healthy' : 'Behind'}
          statusVariant={summary.unitAttainment >= 75 ? 'healthy' : 'critical'}
          icon={Car}
        />

        <KpiCard
          title="Delivered Revenue"
          value={formatCurrency(summary.deliveredRevenue, true)}
          subtitle={`${formatPercent(summary.revenueAttainment)} of Target`}
          target={formatCurrency(summary.targetRevenue, true)}
          attainment={summary.revenueAttainment}
          gap={`${summary.revenueGap >= 0 ? '+' : ''}${formatCurrency(summary.revenueGap, true)}`}
          statusText={summary.revenueAttainment >= 75 ? 'Healthy' : 'Deficit'}
          statusVariant={summary.revenueAttainment >= 75 ? 'healthy' : 'critical'}
          icon={DollarSign}
        />

        <KpiCard
          title="Lead Conversion Rate"
          value={formatPercent(summary.conversionRate)}
          subtitle={`${summary.deliveredUnits} won / ${summary.leadsCreated} leads`}
          statusText={summary.conversionRate >= 30 ? 'Normal' : 'Low Conversion'}
          statusVariant={summary.conversionRate >= 30 ? 'healthy' : 'critical'}
          icon={Target}
        />

        <KpiCard
          title="Delivery Turnaround"
          value={`${summary.avgDeliveryDays.toFixed(1)}d`}
          subtitle={`${formatPercent(summary.delayRate)} delayed (${summary.delayedDeliveriesCount} units)`}
          statusText={summary.delayRate > 50 ? 'High Delay' : 'On Track'}
          statusVariant={summary.delayRate > 50 ? 'warning' : 'healthy'}
          icon={Truck}
        />
      </div>

      {/* Branch Specific Alerts if any */}
      {branchInsights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Branch Operational Alerts & Bottlenecks ({branchInsights.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchInsights.map(insight => (
              <div
                key={insight.id}
                className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge priority={insight.priority} />
                    <span className="text-[11px] font-mono text-slate-500 uppercase">
                      {insight.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{insight.title}</h4>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    {insight.explanation}
                  </p>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono text-slate-400 mb-2">
                    {insight.evidence}
                  </div>
                </div>
                <div className="text-[11px] text-sky-400 font-medium">
                  <strong>Recommended Action:</strong> {insight.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funnel & Delivery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Branch Funnel (7 cols) */}
        <div className="lg:col-span-7 iq-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Branch Conversion Funnel
              </h3>
              <p className="text-xs text-slate-400">
                Progression from inbound lead to delivered sale
              </p>
            </div>
            <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setFunnelMode('cohort')}
                className={`px-2 py-0.5 rounded ${
                  funnelMode === 'cohort' ? 'bg-sky-600 text-white' : 'text-slate-400'
                }`}
              >
                Cohort
              </button>
              <button
                onClick={() => setFunnelMode('event')}
                className={`px-2 py-0.5 rounded ${
                  funnelMode === 'event' ? 'bg-sky-600 text-white' : 'text-slate-400'
                }`}
              >
                Period
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {funnel.stages.map((stage, idx) => {
              const topCount = funnel.stages[0]?.count || 1;
              const width = (stage.count / topCount) * 100;
              return (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">
                      {idx + 1}. {stage.label}
                    </span>
                    <span className="font-mono text-white font-bold">
                      {stage.count}{' '}
                      <span className="text-slate-500 font-normal">
                        ({formatPercent(stage.conversionFromFirst)})
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-3.5 rounded overflow-hidden border border-slate-800">
                    <div
                      className="bg-sky-500 h-full rounded"
                      style={{ width: `${Math.max(3, width)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Branch Delivery & Fulfillment (5 cols) */}
        <div className="lg:col-span-5 iq-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight mb-1">
              Fulfillment & Turnaround Speed
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {deliveryAnalytics.totalDeliveries} total completed deliveries
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">On-Time Deliveries</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {deliveryAnalytics.onTimeCount} ({formatPercent(deliveryAnalytics.onTimeRate)})
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${deliveryAnalytics.onTimeRate}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Delayed Deliveries</span>
                  <span className="text-amber-400 font-bold font-mono">
                    {deliveryAnalytics.delayedCount} ({formatPercent(deliveryAnalytics.delayRate)})
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${deliveryAnalytics.delayRate}%` }}
                  />
                </div>
              </div>

              {deliveryAnalytics.delayReasonsBreakdown.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Primary Delay Reasons:
                  </span>
                  <div className="space-y-1.5">
                    {deliveryAnalytics.delayReasonsBreakdown.slice(0, 3).map((r, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs text-slate-300 font-mono py-1 px-2 bg-slate-950/40 rounded"
                      >
                        <span className="truncate max-w-[200px]">{r.reason}</span>
                        <span className="text-slate-400">
                          {r.count} ({formatPercent(r.percentage)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            Average fulfillment cycle:{' '}
            <strong className="text-slate-200">
              {deliveryAnalytics.avgTurnaroundDays.toFixed(1)} days
            </strong>
          </div>
        </div>
      </div>

      {/* Sales Representative Team Roster */}
      <div className="iq-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Branch Sales Representatives Roster
            </h3>
            <p className="text-xs text-slate-400">
              Individual officer performance, active pipeline, and conversion rates
            </p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr>
                <th className="iq-table-th">Sales Officer</th>
                <th className="iq-table-th">Leads Assigned</th>
                <th className="iq-table-th">Delivered Units</th>
                <th className="iq-table-th">Delivered Revenue</th>
                <th className="iq-table-th">Conversion Rate</th>
                <th className="iq-table-th">Active Pipeline</th>
                <th className="iq-table-th">Order Backlog</th>
                <th className="iq-table-th text-right">Drill Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {branchReps.map(r => (
                <tr
                  key={r.rep.id}
                  onClick={() => navigateTo('representatives', { repId: r.rep.id })}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="iq-table-td">
                    <div className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                      {r.rep.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">{r.rep.id}</div>
                  </td>
                  <td className="iq-table-td font-mono">{r.leadsAssigned}</td>
                  <td className="iq-table-td font-mono font-bold text-white">
                    {r.deliveredUnits}
                  </td>
                  <td className="iq-table-td font-mono font-semibold text-emerald-400">
                    {formatCurrency(r.deliveredRevenue, true)}
                  </td>
                  <td className="iq-table-td font-mono">
                    <span
                      className={`font-semibold ${
                        r.conversionRate >= 40
                          ? 'text-emerald-400'
                          : r.conversionRate < 15
                          ? 'text-rose-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {formatPercent(r.conversionRate)}
                    </span>
                  </td>
                  <td className="iq-table-td font-mono text-slate-300">
                    {r.activeLeadsCount} leads ({formatCurrency(r.activePipelineValue, true)})
                  </td>
                  <td className="iq-table-td font-mono text-slate-400">
                    {r.orderBacklogCount} units
                  </td>
                  <td className="iq-table-td text-right">
                    <span className="text-xs font-semibold text-sky-400 group-hover:translate-x-0.5 inline-flex items-center gap-1 transition-transform">
                      Inspect
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

