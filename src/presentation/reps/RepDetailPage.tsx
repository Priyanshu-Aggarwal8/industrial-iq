/**
 * LAYER 5: PRESENTATION - REPRESENTATIVE DETAIL PAGE
 * Redesigned with Dribbble-inspired dark surfaces, vital signs,
 * pipeline stage breakdown, and assigned customer opportunities.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Calendar,
  Car,
  TrendingUp,
  Clock,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { RepresentativePerformanceViewModel } from '../../application/view-models';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatInteger, formatPercent, formatDate } from '../../infrastructure/formatters';
import { useMotionSafe } from '../motion/variants';

interface RepDetailPageProps {
  model: RepresentativePerformanceViewModel;
  onSelectLead: (leadId: string) => void;
  onSelectBranch?: (branchId: string) => void;
  onBack: () => void;
}

export const RepDetailPage: React.FC<RepDetailPageProps> = ({
  model,
  onSelectLead,
  onSelectBranch,
  onBack,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();
  const { rep, branch, summary, assignedLeads } = model;

  const [leadSearch, setLeadSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  // Stage counts breakdown
  const stageBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    assignedLeads.forEach(lead => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    });
    return counts;
  }, [assignedLeads]);

  // Lost reasons breakdown
  const lostBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    assignedLeads
      .filter(l => l.status === 'lost' && l.lost_reason)
      .forEach(l => {
        const reason = l.lost_reason || 'Unspecified';
        counts[reason] = (counts[reason] || 0) + 1;
      });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [assignedLeads]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return assignedLeads.filter(lead => {
      const matchesSearch =
        lead.customer_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.model_interested.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.phone.includes(leadSearch);
      const matchesStage = stageFilter === 'all' || lead.status === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [assignedLeads, leadSearch, stageFilter]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <Breadcrumbs
        crumbs={[
          { label: 'Sales Representatives', onClick: onBack },
          { label: rep.name },
        ]}
      />

      {/* 1. Header Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="p-6 lg:p-8 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                {rep.id}
              </span>
              <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-medium">
                {rep.role === 'branch_manager' ? 'Branch General Manager' : 'Sales Officer'}
              </span>
              {branch && (
                <button
                  onClick={() => onSelectBranch && onSelectBranch(branch.id)}
                  className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 font-medium transition-colors"
                >
                  <Building2 className="w-4 h-4 text-neutral-400" />
                  {branch.name} ({branch.city})
                </button>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">{rep.name}</h1>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-400" />
                Joined: <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">{formatDate(rep.joined)}</strong>
              </span>
              <span>•</span>
              <span>{summary.leadsAssigned} Leads Lifetime</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{summary.deliveredUnits} Handover Units</span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold tracking-wider block mb-0.5">
              Historical Win Rate
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatPercent(summary.conversionRate)}
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {summary.deliveredUnits} won of {summary.leadsAssigned} assigned
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. KPI Cards Strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Assigned Leads</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 dark:text-neutral-50 mt-1">{summary.leadsAssigned}</div>
          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 block">Lifetime allocation</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Delivered Units</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{summary.deliveredUnits}</div>
          <span className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 block">{formatCurrency(summary.deliveredRevenue)}</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Active Pipeline</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{summary.activeLeadsCount}</div>
          <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-0.5 block">{formatCurrency(summary.activePipelineValue)}</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Order Backlog</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{summary.orderBacklogCount}</div>
          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 block">Awaiting fulfillment</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Stale Leads (≥7d)</span>
          <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${summary.staleLeadsCount >= 3 ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-950 dark:text-neutral-50'}`}>
            {summary.staleLeadsCount}
          </div>
          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 block">Need outreach</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Avg Inactivity</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 dark:text-neutral-100 mt-1">{summary.avgInactiveDays.toFixed(1)}d</div>
          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 block">Across assigned</span>
        </div>
      </motion.div>

      {/* 3. Stage Distribution & Exit Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-neutral-50 tracking-tight flex items-center justify-between">
            <span>Pipeline Distribution by Stage</span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400">{assignedLeads.length} total leads</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { stage: 'new', label: 'New Inbound' },
              { stage: 'contacted', label: 'Contacted' },
              { stage: 'test_drive', label: 'Test Drive' },
              { stage: 'negotiation', label: 'Negotiation' },
              { stage: 'order_placed', label: 'Order Backlog' },
              { stage: 'delivered', label: 'Delivered' },
              { stage: 'lost', label: 'Lost' },
            ].map(s => {
              const count = stageBreakdown[s.stage] || 0;
              const pct = assignedLeads.length ? (count / assignedLeads.length) * 100 : 0;
              return (
                <div key={s.stage} className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-1.5">
                  <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 block truncate font-medium">{s.label}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-neutral-950 dark:text-neutral-50">{count}</span>
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{pct.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lost Reasons */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">Lost Opportunity Attribution</h3>
          {lostBreakdown.length > 0 ? (
            <div className="space-y-3">
              {lostBreakdown.map(([reason, count]) => {
                const pct = summary.lostCount > 0 ? (count / summary.lostCount) * 100 : 0;
                return (
                  <div key={reason} className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-neutral-800 dark:text-neutral-200 font-semibold truncate">{reason}</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-neutral-500 dark:text-neutral-400 py-8 text-center">
              No lost opportunities recorded for this sales representative.
            </div>
          )}
        </div>
      </div>

      {/* 4. Assigned Leads Table */}
      <div className="p-6 sm:p-7 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">Assigned Customer Pipeline</h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Showing {filteredLeads.length} of {assignedLeads.length} customer records
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads..."
                value={leadSearch}
                onChange={e => setLeadSearch(e.target.value)}
                className="pl-9 pr-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 shadow-xs"
              />
            </div>

            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              aria-label="Filter by Stage"
              className="px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 cursor-pointer shadow-xs"
            >
              <option value="all">All Stages</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="test_drive">Test Drive</option>
              <option value="negotiation">Negotiation</option>
              <option value="order_placed">Order Placed</option>
              <option value="delivered">Delivered</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <table className="w-full text-left border-collapse min-w-[700px] text-sm sm:text-base">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/70 border-b border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                <th className="py-3.5 px-4">Lead ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Vehicle Model</th>
                <th className="py-3.5 px-4 text-center">Stage</th>
                <th className="py-3.5 px-4 text-right">Value</th>
                <th className="py-3.5 px-4 text-center">Inactivity</th>
                <th className="py-3.5 px-4 text-right">Created</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredLeads.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead.id)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{lead.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-neutral-950 dark:text-neutral-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{lead.customer_name}</div>
                    <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">{lead.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-800 dark:text-neutral-200 font-medium">{lead.model_interested}</td>
                  <td className="py-3.5 px-4 text-center"><StatusBadge status={lead.status} /></td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">{formatCurrency(lead.deal_value)}</td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={(lead.days_inactive ?? 0) >= 7 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-neutral-600 dark:text-neutral-400'}>
                      {lead.days_inactive}d
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">{formatDate(lead.created_at)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-semibold flex items-center justify-center gap-1 transition-colors">
                      Timeline <ArrowRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
