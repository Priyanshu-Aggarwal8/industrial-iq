/**
 * LAYER 5: PRESENTATION - REPRESENTATIVE LEADERBOARD PAGE
 * Redesigned with Dribbble-grade dark cards, volume champion spotlights,
 * and individual performance telemetry.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Clock,
  Car,
  DollarSign,
  ChevronDown,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DomainRepPerformance } from '../../domain/models';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { formatCurrency, formatInteger, formatPercent, formatDate } from '../../infrastructure/formatters';
import { useMotionSafe } from '../motion/variants';

interface RepLeaderboardPageProps {
  summaries: DomainRepPerformance[];
  onSelectRep: (repId: string) => void;
  onSelectBranch?: (branchId: string) => void;
  onGoHome: () => void;
}

export const RepLeaderboardPage: React.FC<RepLeaderboardPageProps> = ({
  summaries,
  onSelectRep,
  onSelectBranch,
  onGoHome,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'units' | 'revenue' | 'conversion' | 'stale' | 'aging'>('units');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Extract unique branches
  const uniqueBranches = useMemo(() => {
    const map = new Map<string, string>();
    summaries.forEach(s => {
      map.set(s.branch.id, s.branch.name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [summaries]);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    return summaries
      .filter(s => {
        const matchesSearch =
          s.rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.rep.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = selectedBranch === 'all' || s.branch.id === selectedBranch;
        const matchesRole =
          selectedRole === 'all' ||
          (selectedRole === 'manager' ? s.rep.role === 'branch_manager' : s.rep.role !== 'branch_manager');

        return matchesSearch && matchesBranch && matchesRole;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'units') diff = b.deliveredUnits - a.deliveredUnits;
        else if (sortBy === 'revenue') diff = b.deliveredRevenue - a.deliveredRevenue;
        else if (sortBy === 'conversion') diff = b.conversionRate - a.conversionRate;
        else if (sortBy === 'stale') diff = b.staleLeadsCount - a.staleLeadsCount;
        else if (sortBy === 'aging') diff = b.avgInactiveDays - a.avgInactiveDays;

        return sortOrder === 'desc' ? diff : -diff;
      });
  }, [summaries, searchTerm, selectedBranch, selectedRole, sortBy, sortOrder]);

  // Executive highlights
  const topProducer = useMemo(() => {
    if (!summaries.length) return null;
    return [...summaries].sort((a, b) => b.deliveredUnits - a.deliveredUnits)[0];
  }, [summaries]);

  const topConverter = useMemo(() => {
    const eligible = summaries.filter(s => s.leadsAssigned >= 10);
    if (!eligible.length) return null;
    return [...eligible].sort((a, b) => b.conversionRate - a.conversionRate)[0];
  }, [summaries]);

  const mostAtRisk = useMemo(() => {
    const eligible = summaries.filter(s => s.activeLeadsCount > 0);
    if (!eligible.length) return null;
    return [...eligible].sort((a, b) => b.staleLeadsCount - a.staleLeadsCount)[0];
  }, [summaries]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <Breadcrumbs crumbs={[{ label: 'Dealership Network', onClick: onGoHome }, { label: 'Sales Representatives' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Workforce Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight mt-1">
            Sales Representative Performance & Leaderboard
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
            Individual sales metrics evaluating deal conversion win rates, showroom pipeline throughput, and lead stagnation across 30 sales officers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300 self-start sm:self-auto">
          <span className="px-3.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold">
            {summaries.length} Officers Tracked
          </span>
        </div>
      </div>

      {/* Top Highlights Spotlight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topProducer && (
          <div
            onClick={() => onSelectRep(topProducer.rep.id)}
            className="rounded-xl p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer transition-all shadow-subtle group"
          >
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Volume Leader
              </span>
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 rounded-full">
                Rank #1
              </span>
            </div>
            <div className="font-bold text-neutral-950 dark:text-neutral-50 text-lg sm:text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {topProducer.rep.name}
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 mb-5">
              {topProducer.branch.name}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Delivered Units</span>
                <span className="font-bold text-neutral-950 dark:text-neutral-50 text-xl tabular-nums">
                  {topProducer.deliveredUnits} <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 font-normal">units</span>
                </span>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Delivered Rev</span>
                <span className="font-bold text-neutral-950 dark:text-neutral-50 text-xl tabular-nums">
                  {formatCurrency(topProducer.deliveredRevenue)}
                </span>
              </div>
            </div>
          </div>
        )}

        {topConverter && (
          <div
            onClick={() => onSelectRep(topConverter.rep.id)}
            className="rounded-xl p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer transition-all shadow-subtle group"
          >
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Conversion Champion
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                {formatPercent(topConverter.conversionRate)} Win
              </span>
            </div>
            <div className="font-bold text-neutral-950 dark:text-neutral-50 text-lg sm:text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {topConverter.rep.name}
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 mb-5">
              {topConverter.branch.name}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Win Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl tabular-nums">
                  {formatPercent(topConverter.conversionRate)}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Units Delivered</span>
                <span className="font-bold text-neutral-950 dark:text-neutral-50 text-xl tabular-nums">
                  {topConverter.deliveredUnits} <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 font-normal">units</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {mostAtRisk && (
          <div
            onClick={() => onSelectRep(mostAtRisk.rep.id)}
            className="rounded-xl p-6 bg-white dark:bg-neutral-900 border border-rose-200 dark:border-rose-900/60 hover:border-rose-300 dark:hover:border-rose-800 cursor-pointer transition-all shadow-subtle group"
          >
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Attention Required
              </span>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
                {mostAtRisk.staleLeadsCount} Stale
              </span>
            </div>
            <div className="font-bold text-neutral-950 dark:text-neutral-50 text-lg sm:text-xl group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {mostAtRisk.rep.name}
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 mb-5">
              {mostAtRisk.branch.name}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Stale Leads (≥7d)</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-xl tabular-nums">
                  {mostAtRisk.staleLeadsCount} leads
                </span>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Avg Inactivity</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xl tabular-nums">
                  {mostAtRisk.avgInactiveDays.toFixed(1)}d
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sales representative or branch..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              aria-label="Filter by Branch"
              className="px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Dealership Branches</option>
              {uniqueBranches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              aria-label="Filter by Role"
              className="px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Roles</option>
              <option value="rep">Sales Officers Only</option>
              <option value="manager">Branch Managers Only</option>
            </select>
          </div>
        </div>

        {/* Sorting Toggles */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-medium">Sort:</span>
          <button
            onClick={() => {
              if (sortBy === 'units') setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
              else {
                setSortBy('units');
                setSortOrder('desc');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              sortBy === 'units'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
            }`}
          >
            Units {sortBy === 'units' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => {
              if (sortBy === 'revenue') setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
              else {
                setSortBy('revenue');
                setSortOrder('desc');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              sortBy === 'revenue'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
            }`}
          >
            Revenue {sortBy === 'revenue' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => {
              if (sortBy === 'conversion') setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
              else {
                setSortBy('conversion');
                setSortOrder('desc');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              sortBy === 'conversion'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
            }`}
          >
            Win Rate {sortBy === 'conversion' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => {
              if (sortBy === 'stale') setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
              else {
                setSortBy('stale');
                setSortOrder('desc');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              sortBy === 'stale'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-700'
            }`}
          >
            Stale {sortBy === 'stale' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/70 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 tracking-wider uppercase">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Sales Representative</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4 text-center">Assigned</th>
                <th className="py-3.5 px-4 text-right">Units Won</th>
                <th className="py-3.5 px-4 text-right">Delivered Rev</th>
                <th className="py-3.5 px-4 text-right">Conversion</th>
                <th className="py-3.5 px-4 text-center">Pipeline</th>
                <th className="py-3.5 px-4 text-center">Backlog</th>
                <th className="py-3.5 px-4 text-center">Stale (≥7d)</th>
                <th className="py-3.5 px-4 text-right">Avg Inact</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredAndSorted.map((s, index) => {
                const hasStaleRisk = s.staleLeadsCount >= 3;

                return (
                  <tr
                    key={s.rep.id}
                    onClick={() => onSelectRep(s.rep.id)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                        #{index + 1}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-950 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                        {s.rep.name}
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {s.rep.role === 'branch_manager' ? 'Branch Manager' : 'Sales Officer'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (onSelectBranch) onSelectBranch(s.branch.id);
                        }}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-medium"
                      >
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        <span>{s.branch.name}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center text-neutral-700 dark:text-neutral-300 font-medium tabular-nums">
                      {s.leadsAssigned}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
                      {s.deliveredUnits}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
                      {formatCurrency(s.deliveredRevenue)}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <span
                        className={`font-bold ${
                          s.conversionRate >= 0.35
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : s.conversionRate >= 0.25
                            ? 'text-neutral-900 dark:text-neutral-100'
                            : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {formatPercent(s.conversionRate)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center text-neutral-700 dark:text-neutral-300 font-medium tabular-nums">
                      {s.activeLeadsCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {s.orderBacklogCount}
                    </td>

                    <td className="py-3.5 px-4 text-center tabular-nums">
                      {s.staleLeadsCount > 0 ? (
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold inline-block ${
                            hasStaleRisk
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                          }`}
                        >
                          {s.staleLeadsCount}
                        </span>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-500">0</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right text-neutral-600 dark:text-neutral-400 tabular-nums font-medium">
                      {s.avgInactiveDays.toFixed(1)}d
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center text-sm font-semibold text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Inspect <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
