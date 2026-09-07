import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Target, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { calculateMonthlyTargetTrends } from '../../analytics/targets';
import { formatCurrency, formatInteger, formatPercent } from '../../utils/formatters';

export const TargetPerformance: React.FC = () => {
  const { dataset, selectedBranchId, navigateTo } = useFilter();
  const [metricMode, setMetricMode] = useState<'units' | 'revenue'>('units');

  const monthlyData = calculateMonthlyTargetTrends(dataset, selectedBranchId);

  const chartData = monthlyData.map(d => ({
    month: d.month,
    Target: metricMode === 'units' ? d.targetUnits : Math.round(d.targetRevenue / 10000000), // In Crores for clean readability
    Actual: metricMode === 'units' ? d.actualUnits : Math.round(d.actualRevenue / 10000000),
    targetRawRevenue: d.targetRevenue,
    actualRawRevenue: d.actualRevenue,
    unitAttainment: d.unitAttainment,
    revenueAttainment: d.revenueAttainment,
  }));

  const totalTargetUnits = monthlyData.reduce((acc, m) => acc + m.targetUnits, 0);
  const totalActualUnits = monthlyData.reduce((acc, m) => acc + m.actualUnits, 0);
  const totalTargetRev = monthlyData.reduce((acc, m) => acc + m.targetRevenue, 0);
  const totalActualRev = monthlyData.reduce((acc, m) => acc + m.actualRevenue, 0);

  const unitAttainment = totalTargetUnits > 0 ? (totalActualUnits / totalTargetUnits) * 100 : 0;
  const revAttainment = totalTargetRev > 0 ? (totalActualRev / totalTargetRev) * 100 : 0;

  return (
    <div className="iq-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Target Performance & Attainment Trajectory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparing monthly branch targets against verified delivered actuals across 7 months (June–December 2025).
          </p>
        </div>

        {/* Toggle Units vs Revenue */}
        <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('units')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              metricMode === 'units'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Units Attainment
          </button>
          <button
            onClick={() => setMetricMode('revenue')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              metricMode === 'revenue'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revenue Attainment (₹ Cr)
          </button>
        </div>
      </div>

      {/* Target Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 mb-6 text-xs">
        <div>
          <span className="text-slate-400 block">Total Quota Target</span>
          <span className="text-sm font-bold text-slate-200">
            {metricMode === 'units'
              ? `${formatInteger(totalTargetUnits)} units`
              : formatCurrency(totalTargetRev, true)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Delivered Actuals</span>
          <span className="text-sm font-bold text-emerald-400">
            {metricMode === 'units'
              ? `${formatInteger(totalActualUnits)} units`
              : formatCurrency(totalActualRev, true)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Overall Attainment</span>
          <span className="text-sm font-bold text-amber-400">
            {formatPercent(metricMode === 'units' ? unitAttainment : revAttainment)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Net Attainment Gap</span>
          <span className="text-sm font-mono font-semibold text-rose-400">
            {metricMode === 'units'
              ? `${totalActualUnits - totalTargetUnits} units`
              : formatCurrency(totalActualRev - totalTargetRev, true)}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: '#f8fafc',
              }}
              formatter={(val: number, name: string, item: any) => {
                if (metricMode === 'units') {
                  return [`${val} units`, name];
                }
                const raw = name === 'Target' ? item.payload.targetRawRevenue : item.payload.actualRawRevenue;
                return [formatCurrency(raw), name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '0.5rem' }}
              iconType="circle"
            />
            <Bar dataKey="Target" fill="#334155" radius={[4, 4, 0, 0]} name="Target" />
            <Bar dataKey="Actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Actual Delivered" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-200">Analytical Context:</strong> Targets in the dataset represent full monthly showroom capacity (~180–240 units/mo across 5 branches). Deliveries scaled upward steadily from 0 in June (as initial orders ramped) to 52 units in December.
        </span>
      </div>
    </div>
  );
};

