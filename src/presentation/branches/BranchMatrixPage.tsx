/**
 * LAYER 5: PRESENTATION - BRANCH MATRIX PAGE
 * Redesigned to Vercel/Databricks enterprise card standards:
 * - Crisp monochromatic hierarchy with 1px neutral borders
 * - Tabular numerical alignments
 * - Status pills and quick inspection affordances
 */

import React from 'react';
import { Building2, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { DomainBranchPerformance } from '../../domain/models';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { formatCurrency, formatPercent } from '../../infrastructure/formatters';
import { useMotionSafe } from '../motion/variants';

interface BranchMatrixPageProps {
  summaries: DomainBranchPerformance[];
  onSelectBranch: (branchId: string) => void;
  onGoHome: () => void;
}

export const BranchMatrixPage: React.FC<BranchMatrixPageProps> = ({
  summaries,
  onSelectBranch,
  onGoHome,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();
  const sorted = [...summaries].sort((a, b) => b.deliveredRevenue - a.deliveredRevenue);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Breadcrumbs crumbs={[{ label: 'Executive Overview', onClick: onGoHome }, { label: 'Branch Matrix' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Network Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
            Dealership Branch Performance Matrix
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
            Operational benchmarks comparing delivery volume, realized revenue, quota attainment, and delivery SLA across all 5 physical dealerships.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300 self-start sm:self-auto">
          <span className="px-3.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold">
            5 Locations Active
          </span>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((s, idx) => {
          const isCrisis = s.unitAttainment < 10;
          const isLeader = idx === 0;

          return (
            <motion.div
              key={s.branch.id}
              variants={itemVariants}
              onClick={() => onSelectBranch(s.branch.id)}
              className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 cursor-pointer group flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 shadow-subtle transition-all"
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-lg font-mono text-sm font-bold flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                        {s.branch.city}
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {s.branch.name}
                      </h2>
                    </div>
                  </div>

                  {isCrisis && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      At Risk
                    </span>
                  )}
                  {isLeader && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Top Yield
                    </span>
                  )}
                </div>

                {/* Manager & Staff Metadata */}
                <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 flex items-center justify-between mb-5">
                  <span className="flex items-center gap-2 truncate font-medium">
                    <User className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    <span className="truncate">{s.manager ? s.manager.name : 'Unassigned GM'}</span>
                  </span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{s.repCount} Sales Reps</span>
                </div>

                {/* Volume & Revenue Dual Metrics */}
                <div className="grid grid-cols-2 gap-3.5 mb-5">
                  <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs uppercase text-neutral-500 dark:text-neutral-400 font-semibold block mb-0.5">Delivered Units</span>
                    <span className="text-xl font-bold text-neutral-950 dark:text-neutral-50 tabular-nums block">
                      {s.deliveredUnits} <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 font-normal">units</span>
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 tabular-nums mt-0.5 block">
                      Target: {s.targetUnits}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs uppercase text-neutral-500 dark:text-neutral-400 font-semibold block mb-0.5">Revenue</span>
                    <span className="text-xl font-bold text-neutral-950 dark:text-neutral-50 tabular-nums block">
                      {formatCurrency(s.deliveredRevenue)}
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 tabular-nums mt-0.5 block">
                      Target: {formatCurrency(s.targetRevenue)}
                    </span>
                  </div>
                </div>

                {/* Quota Progress Bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs sm:text-sm tabular-nums">
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">Unit Quota Attainment:</span>
                    <span className={`font-bold ${isCrisis ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                      {formatPercent(s.unitAttainment)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCrisis ? 'bg-rose-500' : isLeader ? 'bg-emerald-500' : 'bg-neutral-950 dark:bg-white'
                      }`}
                      style={{ width: `${Math.min(100, s.unitAttainment * 2)}%` }}
                    />
                  </div>
                </div>

                {/* Secondary Operational Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm border-t border-neutral-200 dark:border-neutral-800 pt-4">
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-400 block text-xs uppercase font-semibold mb-0.5">Win Rate</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {formatPercent(s.conversionRate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-400 block text-xs uppercase font-semibold mb-0.5">Fulfillment SLA</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {s.delayRate > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400">{formatPercent(s.delayRate)} Delayed</span>
                      ) : (
                        <span className="text-neutral-700 dark:text-neutral-300">100% On-Time</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Drill-down CTA */}
              <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-semibold">
                <span>Inspect Dealership Performance</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
