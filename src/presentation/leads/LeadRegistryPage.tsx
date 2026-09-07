/**
 * LAYER 5: PRESENTATION - LEAD REGISTRY & PIPELINE PAGE
 * Redesigned with Dribbble-inspired dark card surfaces, quick filter pills,
 * search telemetry, and high-density tabular presentation.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Search,
  Filter,
  Building2,
  User,
  Clock,
  DollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { RawBranch, RawSalesRep } from '../../data/schemas';
import { NormalizedLead } from '../../data/normalizer';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate, formatInteger, formatPercent } from '../../infrastructure/formatters';
import { useMotionSafe } from '../motion/variants';

interface LeadRegistryPageProps {
  leads: NormalizedLead[];
  branches: RawBranch[];
  salesReps: RawSalesRep[];
  onSelectLead: (leadId: string) => void;
  onSelectBranch?: (branchId: string) => void;
  onSelectRep?: (repId: string) => void;
  onGoHome: () => void;
}

export const LeadRegistryPage: React.FC<LeadRegistryPageProps> = ({
  leads,
  branches,
  salesReps,
  onSelectLead,
  onSelectBranch,
  onSelectRep,
  onGoHome,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'active' | 'stale' | 'delivered' | 'lost' | 'discrepancy'>('all');

  // Sorting
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'aging'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Lookups
  const branchMap = useMemo(() => new Map(branches.map(b => [b.id, b])), [branches]);
  const repMap = useMemo(() => new Map(salesReps.map(r => [r.id, r])), [salesReps]);

  // Filtered reps based on branch
  const availableReps = useMemo(() => {
    if (selectedBranch === 'all') return salesReps;
    return salesReps.filter(r => r.branch_id === selectedBranch);
  }, [salesReps, selectedBranch]);

  // Top summary KPIs
  const kpis = useMemo(() => {
    const total = leads.length;
    const active = leads.filter(l => l.status !== 'delivered' && l.status !== 'lost');
    const delivered = leads.filter(l => l.status === 'delivered');
    const lost = leads.filter(l => l.status === 'lost');
    const stale = leads.filter(l => (l.days_inactive ?? 0) >= 7 && l.status !== 'delivered' && l.status !== 'lost');

    const activeVal = active.reduce((acc, l) => acc + l.deal_value, 0);
    const deliveredVal = delivered.reduce((acc, l) => acc + l.deal_value, 0);

    return {
      total,
      activeCount: active.length,
      activeVal,
      deliveredCount: delivered.length,
      deliveredVal,
      lostCount: lost.length,
      staleCount: stale.length,
    };
  }, [leads]);

  // Filtering logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        lead.id.toLowerCase().includes(s) ||
        lead.customer_name.toLowerCase().includes(s) ||
        lead.phone.includes(s) ||
        lead.model_interested.toLowerCase().includes(s);

      if (!matchesSearch) return false;

      if (selectedBranch !== 'all' && lead.branch_id !== selectedBranch) return false;
      if (selectedRep !== 'all' && lead.assigned_to !== selectedRep) return false;
      if (selectedStage !== 'all' && lead.status !== selectedStage) return false;
      if (selectedSource !== 'all' && lead.source !== selectedSource) return false;

      if (quickFilter === 'active') {
        if (lead.status === 'delivered' || lead.status === 'lost') return false;
      } else if (quickFilter === 'stale') {
        if ((lead.days_inactive ?? 0) < 7 || lead.status === 'delivered' || lead.status === 'lost') return false;
      } else if (quickFilter === 'delivered') {
        if (lead.status !== 'delivered') return false;
      } else if (quickFilter === 'lost') {
        if (lead.status !== 'lost') return false;
      } else if (quickFilter === 'discrepancy') {
        if (!lead.has_unrecorded_loss_transition) return false;
      }

      return true;
    });
  }, [leads, searchTerm, selectedBranch, selectedRep, selectedStage, selectedSource, quickFilter]);

  // Sorting logic
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let diff = 0;
      if (sortBy === 'date') {
        diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'value') {
        diff = b.deal_value - a.deal_value;
      } else if (sortBy === 'aging') {
        diff = (b.days_inactive ?? 0) - (a.days_inactive ?? 0);
      }
      return sortOrder === 'desc' ? diff : -diff;
    });
  }, [filteredLeads, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <Breadcrumbs crumbs={[{ label: 'Dealership Network', onClick: onGoHome }, { label: 'Pipeline & Leads' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Pipeline Telemetry
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight mt-1">
            Lead Registry & Operational Pipeline
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
            Inventory of all 510 customer opportunities across the network with stage milestones, aging heuristics, and full audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300 self-start sm:self-auto">
          <span className="px-3.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold">
            {kpis.total} Total Leads Verified
          </span>
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block">Total Inbound</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 dark:text-neutral-50 mt-1">{kpis.total}</div>
          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 block">Across 5 branches</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block">Active Pipeline</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{kpis.activeCount}</div>
          <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-mono mt-0.5 block">{formatCurrency(kpis.activeVal)}</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block">Delivered Handover</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{kpis.deliveredCount}</div>
          <span className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-mono font-semibold mt-0.5 block">{formatCurrency(kpis.deliveredVal)}</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block">Lost Opportunities</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">{kpis.lostCount}</div>
          <span className="text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">{formatPercent(kpis.lostCount / kpis.total)} loss rate</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block">Stale Leads (≥7d)</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{kpis.staleCount}</div>
          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 block">Needs outreach</span>
        </div>
      </div>

      {/* Quick Filter Segmented Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Leads (${leads.length})` },
          { id: 'active', label: `Active Pipeline (${kpis.activeCount})` },
          { id: 'stale', label: `Stale Attention (${kpis.staleCount})` },
          { id: 'delivered', label: `Delivered (${kpis.deliveredCount})` },
          { id: 'lost', label: `Lost (${kpis.lostCount})` },
          { id: 'discrepancy', label: `Audit Discrepancies (14)` },
        ].map(pill => (
          <button
            key={pill.id}
            onClick={() => {
              setQuickFilter(pill.id as any);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              quickFilter === pill.id
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 shadow-subtle'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Search and Multi-filter toolbar */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-subtle">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, phone, model, ID (e.g. LEAD-0001)..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 shadow-xs transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={selectedBranch}
              onChange={e => {
                setSelectedBranch(e.target.value);
                setSelectedRep('all');
                setCurrentPage(1);
              }}
              aria-label="Filter by Branch"
              className="px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <select
              value={selectedRep}
              onChange={e => {
                setSelectedRep(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Representative"
              className="px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Sales Reps</option>
              {availableReps.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <select
              value={selectedStage}
              onChange={e => {
                setSelectedStage(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Stage"
              className="px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer shadow-xs"
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

            <select
              value={selectedSource}
              onChange={e => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Inbound Source"
              className="px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Lead Sources</option>
              <option value="walk_in">Walk-in</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="phone_enquiry">Phone Enquiry</option>
              <option value="auto_expo">Auto Expo</option>
              <option value="social_media">Social Media</option>
            </select>
          </div>
        </div>

        {/* Sorting Toggles */}
        <div className="flex items-center justify-between gap-3 text-sm text-neutral-600 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <div>
            Showing <strong className="text-neutral-950 dark:text-neutral-50">{sortedLeads.length}</strong> matching records
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Sort:</span>
            <button
              onClick={() => {
                if (sortBy === 'date') setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
                else {
                  setSortBy('date');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                sortBy === 'date'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'value') setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
                else {
                  setSortBy('value');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                sortBy === 'value'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              Value {sortBy === 'value' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'aging') setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
                else {
                  setSortBy('aging');
                  setSortOrder('desc');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                sortBy === 'aging'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              Aging {sortBy === 'aging' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/70 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 tracking-wider uppercase">
                <th className="py-3.5 px-4">Lead ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Vehicle Model</th>
                <th className="py-3.5 px-4">Dealership Branch</th>
                <th className="py-3.5 px-4">Sales Representative</th>
                <th className="py-3.5 px-4 text-right">Value</th>
                <th className="py-3.5 px-4 text-center">Stage</th>
                <th className="py-3.5 px-4 text-center">Inactivity</th>
                <th className="py-3.5 px-4 text-right">Created</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {paginatedLeads.map(lead => {
                const branch = branchMap.get(lead.branch_id);
                const rep = repMap.get(lead.assigned_to);
                const isStale = (lead.days_inactive ?? 0) >= 7 && lead.status !== 'delivered' && lead.status !== 'lost';

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead.id)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{lead.id}</td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-950 dark:text-neutral-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lead.customer_name}
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">{lead.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-800 dark:text-neutral-200 font-semibold">{lead.model_interested}</td>

                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 font-medium">
                      {branch ? (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (onSelectBranch) onSelectBranch(branch.id);
                          }}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
                        >
                          <Building2 className="w-4 h-4 text-neutral-400" />
                          <span>{branch.name}</span>
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 font-medium">
                      {rep ? (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (onSelectRep) onSelectRep(rep.id);
                          }}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
                        >
                          <User className="w-4 h-4 text-neutral-400" />
                          <span>{rep.name}</span>
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
                      {formatCurrency(lead.deal_value)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={lead.status} />
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      {lead.days_inactive !== undefined ? (
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-xs font-semibold inline-block ${
                            isStale
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {lead.days_inactive}d
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
                      {formatDate(lead.created_at)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center text-sm font-semibold text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Timeline <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <div>
            Page <strong className="text-neutral-950 dark:text-neutral-50 font-semibold">{currentPage}</strong> of{' '}
            <strong className="text-neutral-950 dark:text-neutral-50 font-semibold">{totalPages}</strong> ({sortedLeads.length} items)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i + 1;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                      : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
