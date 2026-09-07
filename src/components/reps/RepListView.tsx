import React, { useState } from 'react';
import { Users, Search, ArrowRight, Building2, Car, DollarSign, Target, Award } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { calculateRepPerformanceSummaries } from '../../analytics/aging';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { formatCurrency, formatInteger, formatPercent } from '../../utils/formatters';

export const RepListView: React.FC = () => {
  const { dataset, selectedBranchId, setSelectedBranchId, navigateTo } = useFilter();
  const [sortBy, setSortBy] = useState<'revenue' | 'conversion' | 'units' | 'leads'>('revenue');
  const [filterRole, setFilterRole] = useState<'all' | 'sales_officer' | 'branch_manager'>('sales_officer');

  // Quota officers summary
  const summaries = calculateRepPerformanceSummaries(dataset, selectedBranchId);

  // Managers
  const managers = dataset.salesReps.filter(
    r => r.role === 'branch_manager' && (!selectedBranchId || r.branch_id === selectedBranchId)
  );

  const sortedSummaries = [...summaries].sort((a, b) => {
    switch (sortBy) {
      case 'conversion':
        return b.conversionRate - a.conversionRate;
      case 'units':
        return b.deliveredUnits - a.deliveredUnits;
      case 'leads':
        return b.leadsAssigned - a.leadsAssigned;
      case 'revenue':
      default:
        return b.deliveredRevenue - a.deliveredRevenue;
    }
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: 'Sales Representatives' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sales Representative Performance Leaderboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze quota officers across all branches. Surface high performers, coaching needs, and lead aging.
          </p>
        </div>

        {/* Filter / Sort controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterRole('sales_officer')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterRole === 'sales_officer'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sales Officers ({summaries.length})
            </button>
            <button
              onClick={() => setFilterRole('branch_manager')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterRole === 'branch_manager'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Branch Managers ({managers.length})
            </button>
          </div>

          {filterRole === 'sales_officer' && (
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="revenue">Sort by Delivered Revenue</option>
              <option value="conversion">Sort by Win Rate (%)</option>
              <option value="units">Sort by Delivered Units</option>
              <option value="leads">Sort by Leads Assigned</option>
            </select>
          )}
        </div>
      </div>

      {filterRole === 'branch_manager' ? (
        /* Branch Managers Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managers.map(m => {
            const branch = dataset.branchesById.get(m.branch_id);
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (branch) navigateTo('branches', { branchId: branch.id });
                }}
                className="iq-card p-5 cursor-pointer hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-500">{m.id}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    Branch Manager
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Managing: <strong className="text-slate-200">{branch?.name}</strong> ({branch?.city})
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-sky-400">
                  <span>View Managed Branch</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Sales Officers Leaderboard Table */
        <div className="iq-card p-6">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="iq-table-th">Rank & Sales Officer</th>
                  <th className="iq-table-th">Dealership Branch</th>
                  <th className="iq-table-th">Leads Assigned</th>
                  <th className="iq-table-th">Delivered Units</th>
                  <th className="iq-table-th">Delivered Revenue</th>
                  <th className="iq-table-th">Win Rate</th>
                  <th className="iq-table-th">Active Pipeline</th>
                  <th className="iq-table-th">Stale Leads (≥7d)</th>
                  <th className="iq-table-th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedSummaries.map((s, idx) => {
                  const isTop = idx < 3 && sortBy === 'revenue';
                  const isUnderperforming = s.conversionRate < 12;

                  return (
                    <tr
                      key={s.rep.id}
                      onClick={() => navigateTo('representatives', { repId: s.rep.id })}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="iq-table-td">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-500 w-5">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                              {s.rep.name}
                              {isTop && (
                                <Award className="w-3.5 h-3.5 text-amber-400" />
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              {s.rep.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="iq-table-td">
                        <span className="text-slate-300 font-medium">{s.branch.name}</span>
                        <span className="text-[11px] text-slate-500 block">{s.branch.city}</span>
                      </td>

                      <td className="iq-table-td font-mono">{s.leadsAssigned}</td>

                      <td className="iq-table-td font-mono font-bold text-white">
                        {s.deliveredUnits}
                      </td>

                      <td className="iq-table-td font-mono font-bold text-emerald-400">
                        {formatCurrency(s.deliveredRevenue, true)}
                      </td>

                      <td className="iq-table-td font-mono">
                        <span
                          className={`font-semibold ${
                            s.conversionRate >= 40
                              ? 'text-emerald-400'
                              : isUnderperforming
                              ? 'text-rose-400'
                              : 'text-slate-200'
                          }`}
                        >
                          {formatPercent(s.conversionRate)}
                        </span>
                      </td>

                      <td className="iq-table-td font-mono text-slate-300">
                        {s.activeLeadsCount} active ({formatCurrency(s.activePipelineValue, true)})
                      </td>

                      <td className="iq-table-td font-mono">
                        {s.staleLeadsCount > 0 ? (
                          <span className="text-amber-400 font-semibold">
                            {s.staleLeadsCount} leads
                          </span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>

                      <td className="iq-table-td text-right">
                        <span className="text-xs font-semibold text-sky-400 group-hover:translate-x-0.5 inline-flex items-center gap-1 transition-transform">
                          Profile
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
      )}
    </div>
  );
};

