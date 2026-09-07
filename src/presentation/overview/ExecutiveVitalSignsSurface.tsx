/**
 * LAYER 5: PRESENTATION - EXECUTIVE OUTCOME & ATTAINMENT PACING
 * Unified analytical surface connecting:
 * Business Outcome -> Target Quota -> Deficit Gap -> Underlying Drivers (Pipeline, Backlog, Logistics).
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Clock,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ArrowDown,
} from 'lucide-react';
import { OverviewViewModel } from '../../application/view-models';
import { useMotionSafe } from '../motion/variants';

interface ExecutiveVitalSignsProps {
  hero: OverviewViewModel['hero'];
  onInspectBacklog?: () => void;
  onInspectPipeline?: () => void;
}

export const ExecutiveVitalSignsSurface: React.FC<ExecutiveVitalSignsProps> = ({
  hero,
  onInspectBacklog,
  onInspectPipeline,
}) => {
  const { itemVariants } = useMotionSafe();

  return (
    <motion.section variants={itemVariants} className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Executive Performance Narrative
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white tracking-tight">
            Realized Outcome & Quota Attainment Gap
          </h2>
        </div>
        <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
          Horizon: June 1 – December 31, 2025
        </div>
      </div>

      {/* Unified Connected Surface: Outcome -> Target -> Gap */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-subtle p-6 sm:p-8 space-y-6 transition-colors duration-200">
        {/* Tier 1: The Primary Business Outcome vs Target Quota Relationship */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Outcome Display */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400 font-mono tracking-wider">
              TELEMETRY 01 // REALIZED GROUP REVENUE
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-bold text-neutral-950 dark:text-white tracking-tight font-mono">
                {hero.deliveredRevenueFormatted}
              </span>
              <span className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                {hero.deliveredUnitsFormatted} vehicles
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Realized revenue delivered from 160 vehicle handovers across all 5 physical dealerships.
            </p>
          </div>

          {/* Relationship Metrics (Target Quota, Gap, Attainment) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 font-mono">
            <div>
              <span className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block">
                02 // Committed Target
              </span>
              <div className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200 font-mono mt-0.5">
                {hero.targetRevenueFormatted}
              </div>
              <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                {hero.targetUnitsFormatted} target units
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block">
                03 // Deficit Gap
              </span>
              <div className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                -{hero.revenueGapFormatted}
              </div>
              <span className="text-xs sm:text-sm text-rose-500 dark:text-rose-400 font-mono">
                -1,070 shortfall
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider block">
                04 // Quota Attainment
              </span>
              <div className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                {hero.unitAttainmentFormatted}
              </div>
              <span className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-mono">
                Pacing below quota
              </span>
            </div>
          </div>
        </div>

        {/* Quota Progress Pacing Bar with Visual Gap Delta */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
            <span className="text-neutral-600 dark:text-neutral-400">
              Cumulative Attainment Pacing: <strong className="text-neutral-950 dark:text-white">{hero.deliveredUnitsFormatted} / {hero.targetUnitsFormatted} ({hero.unitAttainmentFormatted})</strong>
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">
              Unachieved Quota: 87.0%
            </span>
          </div>
          <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-neutral-200 dark:border-neutral-700">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, parseFloat(hero.unitAttainmentFormatted) || 13.0)}%` }}
            />
          </div>
        </div>

        {/* Tier 2: The Underlying Operational Drivers (What is driving this result?) */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs uppercase font-bold text-neutral-700 dark:text-neutral-300 tracking-wider">
              Underlying Operational Drivers & Working Capital
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Driver 1: Active Showroom Pipeline */}
            <div
              onClick={onInspectPipeline}
              className="p-6 min-h-[220px] rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all group flex flex-col justify-between shadow-subtle"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 font-mono uppercase tracking-wider">
                    Active Showroom Pipeline
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Car className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-950 dark:text-white font-mono">
                  {hero.activePipelineFormatted}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                  <strong className="text-neutral-900 dark:text-neutral-100">{hero.activePipelineCount} active opportunities</strong> undergoing quotation, negotiation, and test drive.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-neutral-500 dark:text-neutral-400 font-mono">Win Rate: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{hero.winRateFormatted}</strong></span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Pipeline <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Driver 2: Unfulfilled Order Backlog */}
            <div
              onClick={onInspectBacklog}
              className="p-6 min-h-[220px] rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500 dark:hover:border-amber-400 cursor-pointer transition-all group flex flex-col justify-between shadow-subtle"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 font-mono uppercase tracking-wider">
                    Unfulfilled Backlog Capital
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-950 dark:text-white font-mono">
                  {hero.orderBacklogFormatted}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                  <strong className="text-amber-600 dark:text-amber-400 font-mono font-bold">{hero.orderBacklogCount} orders booked</strong> with confirmed deposits awaiting vehicle allocation.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold">24 orders idle &gt; 30d</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect Backlog <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Driver 3: Fulfillment SLA Logistics */}
            <div className="p-6 min-h-[220px] rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 font-mono uppercase tracking-wider">
                    Fulfillment Cycle & Delays
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-950 dark:text-white font-mono">
                  {hero.deliveryTurnaroundFormatted}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                  Average booking-to-handover cycle across completed vehicle deliveries.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs sm:text-sm font-mono">
                <span className="text-rose-600 dark:text-rose-400 font-bold">{hero.deliveryDelayRateFormatted} delayed past SLA</span>
                <span className="text-neutral-500 dark:text-neutral-400">72 / 160 units</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};


