import React from 'react';
import { Building2, ArrowRight, User, Car, DollarSign, Target, Truck } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { calculateBranchPerformanceSummaries } from '../../analytics/targets';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { formatCurrency, formatInteger, formatPercent } from '../../utils/formatters';

export const BranchListView: React.FC = () => {
  const { dataset, dateFilter, navigateTo } = useFilter();
  const summaries = calculateBranchPerformanceSummaries(dataset, dateFilter);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: 'Branch Performance' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Branch Network Performance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comparative analysis of all 5 dealership branches across Chennai, Bangalore, Hyderabad, and Mumbai.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {summaries.map(s => {
          const isCrisis = s.unitAttainment < 20;
          const isTop = s.deliveredUnits >= 40;

          return (
            <div
              key={s.branch.id}
              onClick={() => navigateTo('branches', { branchId: s.branch.id })}
              className={`iq-card p-6 cursor-pointer group flex flex-col justify-between hover:border-slate-700 transition-all ${
                isCrisis ? 'border-rose-900/60' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                        {s.branch.id}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {s.branch.city}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                      {s.branch.name}
                    </h2>
                  </div>

                  {isCrisis && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                      Crisis
                    </span>
                  )}
                  {isTop && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Leader
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Manager: {s.manager ? s.manager.name : '—'}</span>
                  <span className="text-slate-600">•</span>
                  <span>{s.repCount} Sales Officers</span>
                </div>

                {/* Attainment progress */}
                <div className="space-y-1.5 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Unit Attainment:</span>
                    <span
                      className={`font-mono font-bold ${
                        isCrisis
                          ? 'text-rose-400'
                          : s.unitAttainment >= 75
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {s.deliveredUnits} / {s.targetUnits} ({formatPercent(s.unitAttainment)})
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isCrisis
                          ? 'bg-rose-500'
                          : s.unitAttainment >= 75
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, s.unitAttainment))}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block text-[11px]">Revenue</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {formatCurrency(s.deliveredRevenue, true)}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block text-[11px]">Conversion</span>
                    <span className="font-bold text-slate-200 font-mono">
                      {formatPercent(s.conversionRate)}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block text-[11px]">Turnaround</span>
                    <span className="font-semibold text-slate-300 font-mono">
                      {s.avgDeliveryDays > 0 ? `${s.avgDeliveryDays.toFixed(1)}d` : '—'}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400 block text-[11px]">Delay Rate</span>
                    <span
                      className={`font-semibold font-mono ${
                        s.delayRate > 50 ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      {formatPercent(s.delayRate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-sky-400 font-semibold group-hover:text-sky-300">
                <span>Inspect Operational Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

