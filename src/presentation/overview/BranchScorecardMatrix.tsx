/**
 * LAYER 5: PRESENTATION - BRANCH PERFORMANCE MATRIX
 * Designed to Databricks Lakehouse table standards:
 * - High density, tabular numeric alignment, and crisp borders
 * - Status pills with status indicators
 * - Clean progress meters and effortless navigation
 */

import React from 'react';
import { Building2, ArrowRight, User } from 'lucide-react';
import { DomainBranchPerformance } from '../../domain/models';
import { formatCurrency, formatPercent } from '../../infrastructure/formatters';

interface BranchScorecardProps {
  branches: DomainBranchPerformance[];
  onSelectBranch: (branchId: string) => void;
  onViewAllBranches: () => void;
}

export const BranchScorecardMatrix: React.FC<BranchScorecardProps> = ({
  branches,
  onSelectBranch,
  onViewAllBranches,
}) => {
  const sortedBranches = [...branches].sort((a, b) => b.deliveredRevenue - a.deliveredRevenue);

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-subtle space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Comparative Analysis
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <span>Dealership Branch Performance Matrix</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1">
            Cross-branch operational benchmarks comparing volume delivery, realized revenue, quota pacing, and logistics fulfillment.
          </p>
        </div>

        <button
          onClick={onViewAllBranches}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 shadow-subtle transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>View All Dealerships</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Databricks Table Grid */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <table className="w-full text-left border-collapse min-w-[800px] text-sm sm:text-base">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/70 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-14 text-center">Rank</th>
              <th className="py-3.5 px-4">Dealership Location</th>
              <th className="py-3.5 px-4 text-center">Delivered</th>
              <th className="py-3.5 px-4 text-right">Revenue (INR)</th>
              <th className="py-3.5 px-4 text-center">Quota Attainment</th>
              <th className="py-3.5 px-4 text-center">Conversion</th>
              <th className="py-3.5 px-4 text-center">Fulfillment SLA</th>
              <th className="py-3.5 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {sortedBranches.map((b, idx) => {
              const isCrisis = b.unitAttainment < 10;
              const isLeader = idx === 0;

              return (
                <tr
                  key={b.branch.id}
                  onClick={() => onSelectBranch(b.branch.id)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-4 text-center">
                    <span className="text-neutral-500 dark:text-neutral-400 font-mono text-xs sm:text-sm font-semibold">
                      #{idx + 1}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-sm sm:text-base text-neutral-950 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2.5">
                      <span>{b.branch.name}</span>
                      {isCrisis && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          At Risk
                        </span>
                      )}
                      {isLeader && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Leader
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{b.branch.city} • Manager: {b.manager?.name || 'Unassigned'}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-semibold text-neutral-950 dark:text-neutral-100 tabular-nums">
                    {b.deliveredUnits} <span className="text-neutral-500 dark:text-neutral-400 font-normal text-xs sm:text-sm">units</span>
                  </td>

                  <td className="py-4 px-4 text-right font-bold text-neutral-950 dark:text-neutral-100 tabular-nums text-sm sm:text-base">
                    {formatCurrency(b.deliveredRevenue)}
                  </td>

                  <td className="py-4 px-4">
                    <div className="w-40 mx-auto space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm tabular-nums">
                        <span className="text-neutral-500 dark:text-neutral-400">{b.deliveredUnits} / {b.targetUnits}</span>
                        <span className={`font-bold ${isCrisis ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                          {formatPercent(b.unitAttainment)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCrisis ? 'bg-rose-500' : isLeader ? 'bg-emerald-500' : 'bg-neutral-950 dark:bg-white'
                          }`}
                          style={{ width: `${Math.min(100, b.unitAttainment * 2)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-semibold tabular-nums">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs sm:text-sm font-semibold inline-block border ${
                        b.conversionRate >= 0.35
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : b.conversionRate >= 0.25
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {formatPercent(b.conversionRate)}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center text-xs sm:text-sm tabular-nums">
                    {b.delayRate > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">
                        {formatPercent(b.delayRate)} ({b.delayedDeliveriesCount} delayed)
                      </span>
                    ) : (
                      <span className="text-neutral-600 dark:text-neutral-400 font-medium">100% On-Time</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
