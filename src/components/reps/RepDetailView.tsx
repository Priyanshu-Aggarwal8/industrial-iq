import React from 'react';
import {
  User,
  Building2,
  Calendar,
  Car,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { calculateRepPerformanceSummaries } from '../../analytics/aging';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { KpiCard } from '../common/KpiCard';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import {
  formatCurrency,
  formatInteger,
  formatPercent,
  formatDate,
} from '../../utils/formatters';

export const RepDetailView: React.FC<{ repId: string }> = ({ repId }) => {
  const { dataset, navigateTo, setInspectingLeadId } = useFilter();

  const rep = dataset.salesRepsById.get(repId);
  if (!rep) {
    return (
      <EmptyState
        title="Representative Not Found"
        description={`No sales officer found matching identifier '${repId}'.`}
        actionText="Back to Representatives"
        onAction={() => navigateTo('representatives')}
      />
    );
  }

  const branch = dataset.branchesById.get(rep.branch_id);
  const repSummaries = calculateRepPerformanceSummaries(dataset);
  const summary = repSummaries.find(s => s.rep.id === repId);

  const assignedLeads = dataset.leads
    .filter(l => l.assigned_to === repId)
    .sort((a, b) => (b.days_inactive ?? 0) - (a.days_inactive ?? 0));

  const deliveredLeads = assignedLeads.filter(l => l.status === 'delivered');
  const activeLeads = assignedLeads.filter(
    l => !['delivered', 'lost'].includes(l.status)
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        crumbs={[
          { label: 'Sales Representatives', route: 'representatives' },
          { label: rep.name },
        ]}
      />

      {/* Rep Header Profile */}
      <div className="iq-card p-6 border-l-4 border-l-sky-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                {rep.id}
              </span>
              <span className="text-xs text-slate-400 capitalize">{rep.role.replace('_', ' ')}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{rep.name}</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Branch:</span>
              {branch && (
                <button
                  onClick={() => navigateTo('branches', { branchId: branch.id })}
                  className="font-semibold text-slate-200 hover:text-sky-400 transition-colors"
                >
                  {branch.name} ({branch.city})
                </button>
              )}
              <span className="text-slate-600">•</span>
              <span>Joined: {formatDate(rep.joined)}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('leads', { branchId: rep.branch_id })}
              className="px-3 py-1.5 text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-800 rounded-lg hover:bg-sky-900/60 transition-colors"
            >
              View Assigned Leads ({assignedLeads.length})
            </button>
          </div>
        </div>
      </div>

      {/* Rep Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Delivered Units"
          value={formatInteger(summary ? summary.deliveredUnits : deliveredLeads.length)}
          subtitle={`${formatPercent(summary?.conversionRate || 0)} Win Rate`}
          statusText={
            (summary?.conversionRate || 0) >= 40
              ? 'High Performer'
              : (summary?.conversionRate || 0) < 15
              ? 'Underperforming'
              : 'Average'
          }
          statusVariant={
            (summary?.conversionRate || 0) >= 40
              ? 'healthy'
              : (summary?.conversionRate || 0) < 15
              ? 'critical'
              : 'neutral'
          }
          icon={Car}
        />

        <KpiCard
          title="Delivered Revenue"
          value={formatCurrency(summary?.deliveredRevenue || 0, true)}
          subtitle={`From ${summary?.deliveredUnits || 0} delivered sales`}
          statusText="Closed Sales"
          statusVariant="healthy"
          icon={DollarSign}
        />

        <KpiCard
          title="Active Pipeline Value"
          value={formatCurrency(summary?.activePipelineValue || 0, true)}
          subtitle={`${summary?.activeLeadsCount || 0} active leads`}
          statusText="In Progress"
          statusVariant="neutral"
          icon={Target}
        />

        <KpiCard
          title="Pipeline Inactivity"
          value={`${summary?.avgInactiveDays.toFixed(1) || 0}d`}
          subtitle={`${summary?.staleLeadsCount || 0} leads idle ≥7 days`}
          statusText={
            (summary?.staleLeadsCount || 0) > 3 ? 'Stale Backlog' : 'Active Cadence'
          }
          statusVariant={(summary?.staleLeadsCount || 0) > 3 ? 'warning' : 'healthy'}
          icon={Clock}
        />
      </div>

      {/* Rep Assigned Leads Table */}
      <div className="iq-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Assigned Lead Roster & Operational Status
            </h2>
            <p className="text-xs text-slate-400">
              Complete assigned portfolio. Click any row to view full journey timeline.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="iq-table-th">Customer Name</th>
                <th className="iq-table-th">Vehicle Model</th>
                <th className="iq-table-th">Deal Value</th>
                <th className="iq-table-th">Current Status</th>
                <th className="iq-table-th">Source</th>
                <th className="iq-table-th">Inactivity</th>
                <th className="iq-table-th text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assignedLeads.map(l => {
                const days = l.days_inactive ?? 0;
                const isStale =
                  l.status !== 'delivered' && l.status !== 'lost' && days >= 7;

                return (
                  <tr
                    key={l.id}
                    onClick={() => setInspectingLeadId(l.id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="iq-table-td">
                      <div className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {l.customer_name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">{l.id}</div>
                    </td>

                    <td className="iq-table-td text-slate-300 font-medium">
                      {l.model_interested}
                    </td>

                    <td className="iq-table-td font-mono font-bold text-emerald-400">
                      {formatCurrency(l.deal_value)}
                    </td>

                    <td className="iq-table-td">
                      <StatusBadge status={l.status} />
                    </td>

                    <td className="iq-table-td text-slate-400 capitalize">
                      {l.source.replace('_', ' ')}
                    </td>

                    <td className="iq-table-td font-mono">
                      <span className={isStale ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                        {days}d idle
                      </span>
                      {isStale && (
                        <span className="block text-[10px] text-amber-500">Needs contact</span>
                      )}
                    </td>

                    <td className="iq-table-td text-right">
                      <span className="text-xs font-semibold text-sky-400 group-hover:translate-x-0.5 inline-flex items-center gap-1 transition-transform">
                        Inspect
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

