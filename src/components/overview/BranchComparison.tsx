import React from 'react';
import { Building2, ChevronRight, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { calculateBranchPerformanceSummaries } from '../../analytics/targets';
import { formatCurrency, formatInteger, formatPercent } from '../../utils/formatters';

export const BranchComparison: React.FC = () => {
  const { dataset, dateFilter, navigateTo } = useFilter();
  const branches = calculateBranchPerformanceSummaries(dataset, dateFilter);

  // Sort by Delivered Revenue descending
  const sortedBranches = [...branches].sort((a, b) => b.deliveredRevenue - a.deliveredRevenue);

  return (
    <div className="iq-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Branch Performance Comparison & Attainment Scorecard
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate volume, revenue yield, win rates, and fulfillment velocity across all 5 dealerships. Click any row to drill into operational details.
          </p>
        </div>

        <button
          onClick={() => navigateTo('branches')}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 self-start sm:self-auto"
        >
          View Full Branch Matrix
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="iq-table-th">Dealership Branch</th>
              <th className="iq-table-th">City</th>
              <th className="iq-table-th">Delivered Units</th>
              <th className="iq-table-th">Target Units</th>
              <th className="iq-table-th">Unit Attainment</th>
              <th className="iq-table-th">Delivered Revenue</th>
              <th className="iq-table-th">Conversion</th>
              <th className="iq-table-th">Avg Turnaround</th>
              <th className="iq-table-th text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedBranches.map(b => {
              const isCrisis = b.unitAttainment < 20;
              const isTop = b.deliveredUnits >= 40;

              return (
                <tr
                  key={b.branch.id}
                  onClick={() => navigateTo('branches', { branchId: b.branch.id })}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="iq-table-td">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {b.branch.name}
                      </div>
                      {isCrisis && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800"
                          title="Severe Target Deficit & Funnel Leakage"
                        >
                          Crisis
                        </span>
                      )}
                      {isTop && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800"
                          title="Top Sales Volume"
                        >
                          Leader
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Mgr: {b.manager ? b.manager.name : '—'} • {b.repCount} Sales Officers
                    </div>
                  </td>

                  <td className="iq-table-td text-slate-300 font-medium">{b.branch.city}</td>

                  <td className="iq-table-td font-mono font-bold text-white">
                    {formatInteger(b.deliveredUnits)}
                  </td>

                  <td className="iq-table-td font-mono text-slate-400">
                    {formatInteger(b.targetUnits)}
                  </td>

                  <td className="iq-table-td">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCrisis
                              ? 'bg-rose-500'
                              : b.unitAttainment >= 75
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, b.unitAttainment))}%` }}
                        />
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isCrisis
                            ? 'text-rose-400'
                            : b.unitAttainment >= 75
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {formatPercent(b.unitAttainment)}
                      </span>
                    </div>
                  </td>

                  <td className="iq-table-td font-mono font-semibold text-emerald-400">
                    {formatCurrency(b.deliveredRevenue, true)}
                  </td>

                  <td className="iq-table-td font-mono text-slate-200">
                    {formatPercent(b.conversionRate)}
                  </td>

                  <td className="iq-table-td font-mono text-slate-300">
                    {b.avgDeliveryDays > 0 ? `${b.avgDeliveryDays.toFixed(1)}d` : '—'}
                    {b.delayRate > 45 && (
                      <span className="text-[10px] text-amber-400 block">
                        ({formatPercent(b.delayRate)} delayed)
                      </span>
                    )}
                  </td>

                  <td className="iq-table-td text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 group-hover:translate-x-0.5 transition-transform">
                      Drill Down
                      <ArrowUpRight className="w-3.5 h-3.5" />
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

