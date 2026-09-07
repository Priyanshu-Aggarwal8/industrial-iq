/**
 * LAYER 5: PRESENTATION - TARGET TRAJECTORY SURFACE (LEVEL 2)
 * High-definition monthly target pacing & actuals comparison.
 * Redesigned with Dribbble-grade dark aesthetics, custom Recharts tooltips,
 * and pill-based metrics toggle.
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Target, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { DomainMonthlyTargetPoint } from '../../domain/targets';
import { formatCurrency, formatInteger, formatPercent } from '../../infrastructure/formatters';

interface TargetTrajectoryProps {
  data: DomainMonthlyTargetPoint[];
}

export const TargetTrajectorySurface: React.FC<TargetTrajectoryProps> = ({ data }) => {
  const [metricMode, setMetricMode] = useState<'units' | 'revenue'>('units');

  const formatMonth = (m: string) => {
    const parts = m.split('-');
    const month = parts[1];
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return names[parseInt(month, 10) - 1] ? `${names[parseInt(month, 10) - 1]} '25` : m;
  };

  const chartData = data.map(d => ({
    month: d.month,
    monthLabel: formatMonth(d.month),
    Target: metricMode === 'units' ? d.targetUnits : Math.round(d.targetRevenue / 10000000),
    Actual: metricMode === 'units' ? d.actualUnits : Math.round(d.actualRevenue / 10000000),
    targetUnits: d.targetUnits,
    actualUnits: d.actualUnits,
    targetRawRevenue: d.targetRevenue,
    actualRawRevenue: d.actualRevenue,
    unitAttainment: d.unitAttainment,
    revenueAttainment: d.revenueAttainment,
  }));

  const totalTargetUnits = data.reduce((acc, m) => acc + m.targetUnits, 0);
  const totalActualUnits = data.reduce((acc, m) => acc + m.actualUnits, 0);
  const totalTargetRev = data.reduce((acc, m) => acc + m.targetRevenue, 0);
  const totalActualRev = data.reduce((acc, m) => acc + m.actualRevenue, 0);

  const unitAttainment = totalTargetUnits > 0 ? (totalActualUnits / totalTargetUnits) * 100 : 0;
  const revAttainment = totalTargetRev > 0 ? (totalActualRev / totalTargetRev) * 100 : 0;

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 lg:p-8 shadow-subtle transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 shadow-xs">
              TELEMETRY 05 // TRAJECTORY PACING
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center gap-2 mt-1">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Monthly Target Trajectory & Fulfillment Velocity
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
            Comparing monthly branch quota commitments against delivered actuals across June–December 2025.
          </p>
        </div>

        {/* Metric Mode Segmented Pill */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('units')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              metricMode === 'units'
                ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
            }`}
          >
            Units (Quota: 1,495)
          </button>
          <button
            onClick={() => setMetricMode('revenue')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              metricMode === 'revenue'
                ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
            }`}
          >
            Revenue (₹ Cr)
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 mb-6">
        <div>
          <span className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">Total Actuals</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-neutral-950 dark:text-white mt-0.5">
            {metricMode === 'units' ? `${totalActualUnits} units` : formatCurrency(totalActualRev)}
          </div>
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">Total Quota Target</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-neutral-700 dark:text-neutral-300 mt-0.5">
            {metricMode === 'units' ? `${totalTargetUnits} units` : formatCurrency(totalTargetRev)}
          </div>
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">Horizon Attainment</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
            {formatPercent((metricMode === 'units' ? unitAttainment : revAttainment) / 100)}
          </div>
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">Deficit Gap</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
            {metricMode === 'units'
              ? `-${totalTargetUnits - totalActualUnits} units`
              : `-${formatCurrency(totalTargetRev - totalActualRev)}`}
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart with Calibrated Height for Full Width */}
      <div className="h-96 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trajActualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#888888" strokeOpacity={0.15} vertical={false} />
            <XAxis
              dataKey="monthLabel"
              stroke="#888888"
              tick={{ fill: '#888888', fontSize: 13, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#888888', strokeOpacity: 0.2 }}
              tickLine={false}
            />
            <YAxis
              stroke="#888888"
              tick={{ fill: '#888888', fontSize: 13, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              unit={metricMode === 'revenue' ? ' Cr' : ''}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="p-4 rounded-xl bg-neutral-950/95 dark:bg-black/95 text-white border border-neutral-800 shadow-2xl backdrop-blur-md text-sm space-y-2.5 font-mono min-w-[240px]">
                    <div className="font-bold text-white border-b border-neutral-800 pb-1.5 text-base">
                      {d.monthLabel} Performance
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-neutral-400">Delivered Actual:</span>
                      <span className="font-bold text-blue-400">
                        {d.actualUnits} units ({formatCurrency(d.actualRawRevenue)})
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-neutral-400">Monthly Target:</span>
                      <span className="text-neutral-300">
                        {d.targetUnits} units ({formatCurrency(d.targetRawRevenue)})
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 pt-1.5 border-t border-neutral-800">
                      <span className="text-neutral-400">Attainment:</span>
                      <span className="font-bold text-amber-400">
                        {formatPercent(d.unitAttainment)}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="Actual"
              name="Delivered Actuals"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
            <Bar
              dataKey="Target"
              name="Target Quota"
              fill="#94A3B8"
              fillOpacity={0.3}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
