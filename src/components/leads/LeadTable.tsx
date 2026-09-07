import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Car,
  DollarSign,
  Clock,
  ArrowRight,
  AlertCircle,
  Building2,
  User,
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { StatusBadge } from '../common/StatusBadge';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { EmptyState } from '../common/EmptyState';
import {
  formatCurrency,
  formatDate,
  formatInteger,
  capitalize,
} from '../../utils/formatters';
import { LeadStatus } from '../../types';

export const LeadTable: React.FC = () => {
  const {
    dataset,
    selectedBranchId,
    setSelectedBranchId,
    searchQuery,
    setSearchQuery,
    routeParams,
    setInspectingLeadId,
    navigateTo,
  } = useFilter();

  const [statusFilter, setStatusFilter] = useState<string>(routeParams.statusFilter || 'all');
  const [sourceFilter, setSourceFilter] = useState<string>(routeParams.sourceFilter || 'all');
  const [quickFilter, setQuickFilter] = useState<string>(routeParams.quickFilter || 'all');
  const [page, setPage] = useState<number>(1);
  const pageSize = 25;

  // Filter leads
  const filteredLeads = useMemo(() => {
    return dataset.leads.filter(l => {
      // Branch filter
      if (selectedBranchId && l.branch_id !== selectedBranchId) return false;

      // Status filter
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;

      // Source filter
      if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;

      // Quick filter
      const days = l.days_inactive ?? 0;
      if (quickFilter === 'stale') {
        if (l.status === 'delivered' || l.status === 'lost') return false;
        if (days < 7) return false;
      } else if (quickFilter === 'critical_stale') {
        if (l.status === 'delivered' || l.status === 'lost') return false;
        if (days < 14) return false;
      } else if (quickFilter === 'order_backlog') {
        if (l.status !== 'order_placed') return false;
      } else if (quickFilter === 'high_value') {
        if (l.deal_value < 3000000) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = l.customer_name.toLowerCase().includes(q);
        const matchId = l.id.toLowerCase().includes(q);
        const matchPhone = l.phone.includes(q);
        const matchModel = l.model_interested.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchPhone && !matchModel) return false;
      }

      return true;
    });
  }, [dataset, selectedBranchId, statusFilter, sourceFilter, quickFilter, searchQuery]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: 'Lead Intelligence' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Lead & Operational Pipeline Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete registry of {dataset.leads.length} customer opportunities across the network. Inspect journeys, detect stall points, and audit follow-up cadences.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 self-start sm:self-auto bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Showing <strong className="text-white">{filteredLeads.length}</strong> matching records
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Quick Filters:</span>
        {[
          { id: 'all', label: 'All Leads' },
          { id: 'stale', label: 'Needs Contact (≥7d idle)' },
          { id: 'critical_stale', label: 'Critical Stale (≥14d idle)' },
          { id: 'order_backlog', label: 'Unfulfilled Orders (38)' },
          { id: 'high_value', label: 'High Value (≥₹30 Lakhs)' },
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => {
              setQuickFilter(chip.id);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              quickFilter === chip.id
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30 font-semibold'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="iq-card p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Stage:</span>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Stages</option>
              <option value="new">New Inquiries (5)</option>
              <option value="contacted">Contacted (10)</option>
              <option value="test_drive">Test Drive (6)</option>
              <option value="negotiation">Negotiation (3)</option>
              <option value="order_placed">Order Placed (38)</option>
              <option value="delivered">Delivered (160)</option>
              <option value="lost">Lost Deals (288)</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Source:</span>
            <select
              value={sourceFilter}
              onChange={e => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Sources</option>
              <option value="walk_in">Walk-in (140)</option>
              <option value="website">Website (100)</option>
              <option value="referral">Referral (83)</option>
              <option value="phone_enquiry">Phone Enquiry (72)</option>
              <option value="social_media">Social Media (72)</option>
              <option value="auto_expo">Auto Expo (43)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(statusFilter !== 'all' || sourceFilter !== 'all' || quickFilter !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setStatusFilter('all');
              setSourceFilter('all');
              setQuickFilter('all');
              setSearchQuery('');
              setPage(1);
            }}
            className="text-xs text-sky-400 hover:text-sky-300 underline"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Table */}
      {paginatedLeads.length === 0 ? (
        <EmptyState
          title="No Leads Found"
          description="No leads match the selected status, source, or search criteria."
          actionText="Clear All Filters"
          onAction={() => {
            setStatusFilter('all');
            setSourceFilter('all');
            setQuickFilter('all');
            setSearchQuery('');
            setPage(1);
          }}
        />
      ) : (
        <div className="iq-card p-6">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="iq-table-th">Lead ID & Customer</th>
                  <th className="iq-table-th">Model Interested</th>
                  <th className="iq-table-th">Deal Value</th>
                  <th className="iq-table-th">Current Stage</th>
                  <th className="iq-table-th">Branch & Rep</th>
                  <th className="iq-table-th">Source</th>
                  <th className="iq-table-th">Activity & Aging</th>
                  <th className="iq-table-th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedLeads.map(lead => {
                  const branch = dataset.branchesById.get(lead.branch_id);
                  const rep = dataset.salesRepsById.get(lead.assigned_to);
                  const days = lead.days_inactive ?? 0;
                  const isStale =
                    !['delivered', 'lost'].includes(lead.status) && days >= 7;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setInspectingLeadId(lead.id)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="iq-table-td">
                        <div className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                          {lead.customer_name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <span>{lead.id}</span>
                          <span>•</span>
                          <span>{lead.phone}</span>
                        </div>
                      </td>

                      <td className="iq-table-td text-slate-200 font-medium">
                        {lead.model_interested}
                      </td>

                      <td className="iq-table-td font-mono font-bold text-emerald-400">
                        {formatCurrency(lead.deal_value)}
                      </td>

                      <td className="iq-table-td">
                        <StatusBadge status={lead.status} />
                      </td>

                      <td className="iq-table-td">
                        <div className="text-slate-300 font-medium text-xs">
                          {branch?.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Rep: {rep?.name}
                        </div>
                      </td>

                      <td className="iq-table-td text-slate-400 capitalize">
                        {lead.source.replace('_', ' ')}
                      </td>

                      <td className="iq-table-td font-mono">
                        <span
                          className={`text-xs ${
                            isStale ? 'text-amber-400 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {days}d idle
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Created {formatDate(lead.created_at)}
                        </span>
                      </td>

                      <td className="iq-table-td text-right">
                        <span className="text-xs font-semibold text-sky-400 group-hover:translate-x-0.5 inline-flex items-center gap-1 transition-transform">
                          Timeline
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                Page <strong className="text-white">{page}</strong> of{' '}
                <strong className="text-white">{totalPages}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

