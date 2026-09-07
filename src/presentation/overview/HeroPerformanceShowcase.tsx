/**
 * LAYER 5: PRESENTATION - HERO PERFORMANCE SHOWCASE
 * Refined to Vercel & Databricks Design Standards:
 * - Scaled up typography for effortless readability
 * - High-contrast, dark-mode optimized chart rendering
 * - Executive metrics with ample breathing room
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  Truck,
  Car,
  DollarSign,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { OverviewViewModel } from '../../application/view-models';
import { DomainMonthlyTargetPoint } from '../../domain/targets';
import { DomainBranchPerformance, DomainActionableInsight } from '../../domain/models';
import { formatCurrency, formatPercent } from '../../infrastructure/formatters';
import { useMotionSafe } from '../motion/variants';

interface HeroPerformanceShowcaseProps {
  hero: OverviewViewModel['hero'];
  monthlyTrends: DomainMonthlyTargetPoint[];
  branchSummaries: DomainBranchPerformance[];
  prioritizedInsights: DomainActionableInsight[];
  onSelectBranch?: (branchId: string) => void;
  onInspectBacklog?: () => void;
  onInspectPipeline?: () => void;
  onViewAllInsights?: () => void;
}

export const HeroPerformanceShowcase: React.FC<HeroPerformanceShowcaseProps> = ({
  hero,
  monthlyTrends,
  branchSummaries,
  prioritizedInsights,
  onSelectBranch,
  onInspectBacklog,
  onInspectPipeline,
  onViewAllInsights,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();
  const [chartMetric, setChartMetric] = useState<'units' | 'revenue'>('units');
  const [chartPacingMode, setChartPacingMode] = useState<'monthly' | 'cumulative'>('monthly');

  const sortedBranches = [...branchSummaries].sort((a, b) => b.deliveredRevenue - a.deliveredRevenue);
  const topBranch = sortedBranches[0] || null;
  const topCriticalAlert = prioritizedInsights.find(i => i.priority === 'critical') || prioritizedInsights[0];

  let cumActualUnits = 0;
  let cumTargetUnits = 0;
  let cumActualRev = 0;
  let cumTargetRev = 0;

  const chartData = monthlyTrends.map(d => {
    cumActualUnits += d.actualUnits;
    cumTargetUnits += d.targetUnits;
    cumActualRev += d.actualRevenue;
    cumTargetRev += d.targetRevenue;

    const isCum = chartPacingMode === 'cumulative';
    const aUnits = isCum ? cumActualUnits : d.actualUnits;
    const tUnits = isCum ? cumTargetUnits : d.targetUnits;
    const aRev = isCum ? cumActualRev : d.actualRevenue;
    const tRev = isCum ? cumTargetRev : d.targetRevenue;

    return {
      month: d.month,
      monthLabel: (() => {
        const parts = d.month.split('-');
        const month = parts[1];
        const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return names[parseInt(month, 10) - 1] ? `${names[parseInt(month, 10) - 1]} '25` : d.month;
      })(),
      actualValue: chartMetric === 'units' ? aUnits : Number((aRev / 10000000).toFixed(2)),
      targetValue: chartMetric === 'units' ? tUnits : Number((tRev / 10000000).toFixed(2)),
      actualUnits: aUnits,
      targetUnits: tUnits,
      actualRevenue: aRev,
      targetRevenue: tRev,
      unitAttainment: tUnits > 0 ? (aUnits / tUnits) * 100 : 0,
      isCumulative: isCum,
    };
  });

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full space-y-6 pt-2 pb-6"
    >
      {/* Executive Title Row */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Dealership Group Performance Intelligence
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Operational Sync
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
            Executive Performance Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewAllInsights}
            className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors shadow-subtle flex items-center gap-2"
          >
            <span>Priority Actions ({prioritizedInsights.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scaled-up KPI Surface Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Delivered Revenue */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Delivered Revenue</span>
            <DollarSign className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight tabular-nums">
              {hero.deliveredRevenueFormatted}
            </div>
            <div className="mt-2.5 flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold">
                {hero.deliveredUnitsFormatted} units
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">delivered & finalized</span>
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Quota Pacing */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Quota Attainment</span>
            <TrendingUp className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight tabular-nums">
              {hero.unitAttainmentFormatted}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
              <span>Target: {hero.targetUnitsFormatted} units</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {hero.deliveredUnitsFormatted} / {hero.targetUnitsFormatted}
              </span>
            </div>
            {/* Minimalist Vercel-style progress meter */}
            <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(hero.unitAttainmentFormatted.replace('%', '')) || 0))}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* KPI 3: Active Pipeline */}
        <motion.div
          variants={itemVariants}
          onClick={onInspectPipeline}
          className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Active Pipeline</span>
            <Car className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-blue-600 transition-colors" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight tabular-nums group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {hero.activePipelineFormatted}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">
                {hero.activePipelineCount} prospects in active stages
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-1">
                Inspect <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* KPI 4: Order Backlog */}
        <motion.div
          variants={itemVariants}
          onClick={onInspectBacklog}
          className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Order Backlog</span>
            <Truck className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-amber-500 transition-colors" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight tabular-nums">
              {hero.orderBacklogFormatted}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-sm">
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-semibold">
                {hero.orderBacklogCount} units booked
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                SLA: {hero.deliveryTurnaroundFormatted}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Trajectory Chart & Leadership Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Performance Trajectory Chart (8 cols) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                <span>Monthly Target vs Actual Trajectory</span>
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {chartPacingMode === 'cumulative'
                  ? 'Cumulative trajectory tracking group-wide full-horizon target attainment.'
                  : 'Discrete monthly breakdown comparing delivered actuals against committed targets.'}
              </p>
            </div>

            {/* Segmented Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200/80 dark:border-neutral-700 text-xs sm:text-sm">
                <button
                  onClick={() => setChartPacingMode('monthly')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    chartPacingMode === 'monthly'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setChartPacingMode('cumulative')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    chartPacingMode === 'cumulative'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
                  }`}
                >
                  Cumulative
                </button>
              </div>

              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200/80 dark:border-neutral-700 text-xs sm:text-sm">
                <button
                  onClick={() => setChartMetric('units')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    chartMetric === 'units'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
                  }`}
                >
                  Units
                </button>
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    chartMetric === 'revenue'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
                  }`}
                >
                  Revenue
                </button>
              </div>
            </div>
          </div>

          {/* High-Contrast Responsive Chart */}
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fill: '#888888', fontSize: 13, fontWeight: 500 }}
                  axisLine={{ stroke: '#888888', strokeOpacity: 0.2 }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: '#888888', fontSize: 13, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-6}
                  unit={chartMetric === 'revenue' ? ' Cr' : ''}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(128, 128, 128, 0.08)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="p-4 rounded-xl bg-neutral-950/95 dark:bg-black/95 text-white border border-neutral-800 shadow-2xl backdrop-blur-md text-sm space-y-3 min-w-[240px]">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                          <span className="font-bold text-white text-base">{d.monthLabel}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              d.unitAttainment >= 100
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-neutral-800 text-neutral-200'
                            }`}
                          >
                            {formatPercent(d.unitAttainment)} Attainment
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-neutral-400">Actual Delivered:</span>
                            <span className="font-semibold text-white tabular-nums">
                              {d.actualUnits} units ({formatCurrency(d.actualRevenue)})
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-neutral-400">Target Quota:</span>
                            <span className="font-semibold text-neutral-300 tabular-nums">
                              {d.targetUnits} units ({formatCurrency(d.targetRevenue)})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                {/* Clean, visible blue bar in both light & dark mode */}
                <Bar
                  dataKey="actualValue"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={42}
                />
                {/* Target line with high contrast */}
                <Line
                  type="monotone"
                  dataKey="targetValue"
                  stroke="#94A3B8"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ fill: '#FFFFFF', stroke: '#64748B', strokeWidth: 2, r: 4.5 }}
                  activeDot={{ r: 6, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-sm text-neutral-500">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block"></span>
                Delivered Actuals
              </span>
              <span className="flex items-center gap-2 font-medium">
                <span className="w-3.5 h-0.5 border-b-2 border-dashed border-neutral-400 dark:border-neutral-500 inline-block"></span>
                Committed Target
              </span>
            </div>
            <span className="font-medium">Data Horizon: Jun – Dec 2025</span>
          </div>
        </motion.div>

        {/* Right: Leadership & Intelligence Highlights (4 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Top Dealership Card */}
          {topBranch && (
            <div
              onClick={() => onSelectBranch && onSelectBranch(topBranch.branch.id)}
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Leading Dealership
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                  Rank #1
                </span>
              </div>
              <div className="font-bold text-xl text-neutral-950 dark:text-neutral-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {topBranch.branch.name}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Location: {topBranch.branch.city}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-neutral-400 block text-xs uppercase font-medium">Delivered</span>
                  <span className="font-bold text-base text-neutral-950 dark:text-neutral-50 tabular-nums">
                    {topBranch.deliveredUnits} units
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-xs uppercase font-medium">Revenue</span>
                  <span className="font-bold text-base text-neutral-950 dark:text-neutral-50 tabular-nums">
                    {formatCurrency(topBranch.deliveredRevenue)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostic Critical Alert Card */}
          {topCriticalAlert && (
            <div
              onClick={onViewAllInsights}
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-rose-200 dark:border-rose-900 shadow-subtle hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Critical Decision Required
                </span>
              </div>
              <div className="font-bold text-neutral-950 dark:text-neutral-50 text-base mb-1.5 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {topCriticalAlert.title}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {topCriticalAlert.explanation}
              </p>
              <div className="mt-3 text-sm text-rose-600 dark:text-rose-400 font-semibold inline-flex items-center gap-1.5">
                <span>View Full Diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* SLA Turnaround Benchmark Card */}
          <div
            onClick={onInspectBacklog}
            className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Turnaround SLA Benchmark</span>
              <Truck className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="text-2xl font-bold text-neutral-950 dark:text-neutral-50 tabular-nums">
              {hero.deliveryTurnaroundFormatted}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 flex items-center justify-between">
              <span>Delayed: {hero.deliveryDelayRateFormatted}</span>
              <span className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 font-medium inline-flex items-center gap-1">
                Audit <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
