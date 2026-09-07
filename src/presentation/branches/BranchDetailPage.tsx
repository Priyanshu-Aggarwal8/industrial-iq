/**
 * LAYER 5: PRESENTATION - BRANCH DETAIL PAGE
 * Deep contextual operational intelligence for an individual dealership branch.
 * Redesigned with Dribbble-grade dark aesthetics, asymmetric vital signs,
 * branch funnel, sales team performance, and delivery logistics.
 */

import React, { useState } from 'react';
import {
  Car,
  DollarSign,
  Target,
  Truck,
  AlertTriangle,
  ArrowRight,
  Filter,
  User,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BranchPerformanceViewModel } from '../../application/view-models';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import {
  formatCurrency,
  formatInteger,
  formatPercent,
  formatDate,
} from '../../infrastructure/formatters';
import { useMotionSafe } from '../motion/variants';

interface BranchDetailPageProps {
  viewModel: BranchPerformanceViewModel;
  currentFunnelMode: 'cohort' | 'event';
  onFunnelModeChange: (mode: 'cohort' | 'event') => void;
  onSelectRep: (repId: string) => void;
  onViewBranchLeads: (branchId: string) => void;
  onGoBranches: () => void;
}

export const BranchDetailPage: React.FC<BranchDetailPageProps> = ({
  viewModel,
  currentFunnelMode,
  onFunnelModeChange,
  onSelectRep,
  onViewBranchLeads,
  onGoBranches,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();
  const { branch, manager, summary, funnel, team, delivery, insights, recentLeads } = viewModel;

  const isCrisis = summary.unitAttainment < 10;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <Breadcrumbs
        crumbs={[
          { label: 'Branch Performance', onClick: onGoBranches },
          { label: branch.name },
        ]}
      />

      {/* 1. Branch Hero Cockpit Surface */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 lg:p-8 shadow-subtle relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                {branch.id}
              </span>
              <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                {branch.city}, India
              </span>
              {isCrisis && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
                  Attention Required
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
              {branch.name}
            </h1>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-neutral-400" />
                GM: <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">{manager ? manager.name : 'Unassigned'}</strong>
              </span>
              <span>•</span>
              <span>{team.length} Quota Sales Representatives</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{summary.deliveredUnits} Delivered Units</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewBranchLeads(branch.id)}
              className="px-4 py-2 text-sm font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-lg transition-all shadow-subtle flex items-center gap-2"
            >
              <span>View Branch Leads ({recentLeads.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Branch Vital Signs Strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Delivered Units</span>
          <div className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
            {formatInteger(summary.deliveredUnits)} <span className="text-xs sm:text-sm text-neutral-500 font-normal">units</span>
          </div>
          <div className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-medium mt-1">
            Target: {formatInteger(summary.targetUnits)} ({formatPercent(summary.unitAttainment)})
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Delivered Revenue</span>
          <div className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
            {formatCurrency(summary.deliveredRevenue)}
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-1">
            Target: {formatCurrency(summary.targetRevenue)} ({formatPercent(summary.revenueAttainment)})
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Conversion Win Rate</span>
          <div className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
            {formatPercent(summary.conversionRate)}
          </div>
          <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
            {summary.deliveredUnits} won of {summary.leadsCreated} created leads
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle">
          <span className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 block mb-0.5">Delivery SLA Delay</span>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
            {formatPercent(summary.delayRate)}
          </div>
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-1">
            {summary.delayedDeliveriesCount} of {summary.deliveredUnits} delayed ({delivery.avgTurnaroundDays.toFixed(1)}d avg)
          </div>
        </div>
      </motion.div>

      {/* 3. Branch Diagnostic Insights */}
      {insights.length > 0 && (
        <motion.div variants={itemVariants} className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
              Operational Vulnerabilities Identified for {branch.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map(i => (
              <div
                key={i.id}
                className="p-5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-2 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-950 dark:text-neutral-50 text-base">{i.title}</span>
                  <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                    Score {i.priorityScore}/100
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">{i.explanation}</p>
                <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200 shadow-xs">
                  {i.evidence}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 4. Sales Representative Roster */}
      <motion.div variants={itemVariants} className="p-6 sm:p-7 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
              Sales Representative Performance Roster
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Individual throughput, backlog management, and lead stagnation for {branch.name}
            </p>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">{team.length} Officers</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <table className="w-full text-left border-collapse min-w-[700px] text-sm sm:text-base">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/70 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                <th className="py-3.5 px-4">Sales Officer</th>
                <th className="py-3.5 px-4 text-center">Assigned</th>
                <th className="py-3.5 px-4 text-right">Delivered Units</th>
                <th className="py-3.5 px-4 text-right">Delivered Rev</th>
                <th className="py-3.5 px-4 text-center">Conversion</th>
                <th className="py-3.5 px-4 text-center">Backlog</th>
                <th className="py-3.5 px-4 text-center">Stale (≥7d)</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {team.map(rep => (
                <tr
                  key={rep.rep.id}
                  onClick={() => onSelectRep(rep.rep.id)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-bold text-neutral-950 dark:text-neutral-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rep.rep.name}
                  </td>
                  <td className="py-3.5 px-4 text-center text-neutral-700 dark:text-neutral-300 tabular-nums font-medium">
                    {rep.leadsAssigned}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
                    {rep.deliveredUnits}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
                    {formatCurrency(rep.deliveredRevenue)}
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums">
                    <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-semibold inline-block">
                      {formatPercent(rep.conversionRate)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {rep.orderBacklogCount}
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums">
                    {rep.staleLeadsCount > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{rep.staleLeadsCount}</span>
                    ) : (
                      <span className="text-neutral-400 dark:text-neutral-500">0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-semibold flex items-center justify-center gap-1 transition-colors">
                      Inspect <ArrowRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
