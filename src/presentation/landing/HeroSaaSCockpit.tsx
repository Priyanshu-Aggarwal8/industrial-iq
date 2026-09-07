/**
 * LAYER 5: PRESENTATION - HERO SAAS COCKPIT
 * Inspired by Uiverse.io and top modern B2B SaaS dashboard elements (Vercel, Linear, Databricks).
 * Clean, uncluttered, focused on automotive dealership group metrics:
 * - Interactive Metro Hub switcher (All 5 Hubs, Mumbai, Bangalore, Delhi, Chennai, Hyderabad)
 * - Core pacing metrics (Delivered Revenue, Gate Deliveries, PDI Turnaround, SVG Quota Speedometer)
 * - Sales Pipeline Throughput ribbon with animated energy pulse
 * - Recent Showroom Activity ticker with auto-cycling and manual simulation
 * - No cluttered telemetry/latency tags
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Car,
  Zap,
  ArrowUpRight,
  Sparkles,
  Gauge,
  Clock,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { OverviewViewModel } from '../../application/view-models';
import { DomainBranchPerformance } from '../../domain/models';
import { AppNavSection } from '../layout/Sidebar';
import { formatCurrency, formatInteger } from '../../infrastructure/formatters';

interface HeroSaaSCockpitProps {
  overviewViewModel: OverviewViewModel;
  branchSummaries: DomainBranchPerformance[];
  onNavigate: (section: AppNavSection, params?: any) => void;
  theme?: 'light' | 'dark';
  activeBranchId?: string;
  onSelectBranch?: (branchId: string) => void;
}

// Simulated real-time automotive transaction feed for dealership telemetry
interface LiveDeal {
  id: string;
  model: string;
  city: string;
  amount: string;
  status: 'Delivered' | 'Order Booked' | 'PDI Passed' | 'In Transit';
  time: string;
  rep: string;
  tagColor: string;
}

const LIVE_DEALS_FEED: LiveDeal[] = [
  {
    id: 'd1',
    model: 'Hyundai Creta SX (O)',
    city: 'Mumbai',
    amount: '₹19.4L',
    status: 'Delivered',
    time: 'Just now',
    rep: 'R. Sharma',
    tagColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'd2',
    model: 'Kia Seltos GTX+ Turbo',
    city: 'Bangalore',
    amount: '₹21.2L',
    status: 'Order Booked',
    time: '2m ago',
    rep: 'A. Patel',
    tagColor: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'd3',
    model: 'Tata Nexon EV Empowered',
    city: 'Delhi',
    amount: '₹18.8L',
    status: 'Delivered',
    time: '5m ago',
    rep: 'V. Rao',
    tagColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'd4',
    model: 'Mahindra XUV700 AX7L',
    city: 'Chennai',
    amount: '₹26.5L',
    status: 'Order Booked',
    time: '8m ago',
    rep: 'S. Iyer',
    tagColor: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'd5',
    model: 'Honda Elevate ZX CVT',
    city: 'Hyderabad',
    amount: '₹16.4L',
    status: 'PDI Passed',
    time: '11m ago',
    rep: 'N. Reddy',
    tagColor: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'd6',
    model: 'Hyundai Tucson Signature AWD',
    city: 'Mumbai',
    amount: '₹35.2L',
    status: 'Delivered',
    time: '14m ago',
    rep: 'M. Deshmukh',
    tagColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  },
];

export const HeroSaaSCockpit: React.FC<HeroSaaSCockpitProps> = ({
  overviewViewModel,
  branchSummaries,
  onNavigate,
  theme = 'dark',
  activeBranchId,
  onSelectBranch,
}) => {
  const [internalBranchId, setInternalBranchId] = useState<string>('all');
  const selectedBranchId = activeBranchId !== undefined ? activeBranchId : internalBranchId;

  const handleBranchChange = (id: string) => {
    if (onSelectBranch) {
      onSelectBranch(id);
    } else {
      setInternalBranchId(id);
    }
  };

  const [dealIndex, setDealIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Auto-cycle live deal feed every 4.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDealIndex(prev => (prev + 1) % LIVE_DEALS_FEED.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateNewDeal = () => {
    setIsSimulating(true);
    setDealIndex(prev => (prev + 1) % LIVE_DEALS_FEED.length);
    setTimeout(() => setIsSimulating(false), 600);
  };

  const activeDeal = LIVE_DEALS_FEED[dealIndex];

  // Selected branch data calculation
  const isAll = selectedBranchId === 'all';
  const activeBranch = branchSummaries.find(b => b.branch.id === selectedBranchId);

  // Computed metrics based on active selection
  const revenueDelivered = isAll
    ? overviewViewModel.hero.deliveredRevenueFormatted
    : formatCurrency(activeBranch?.deliveredRevenue || 0);

  const revenueTarget = isAll
    ? overviewViewModel.hero.targetRevenueFormatted
    : formatCurrency(activeBranch?.targetRevenue || 0);

  const revenueAttainment = isAll
    ? overviewViewModel.hero.revenueAttainmentFormatted
    : `${(activeBranch?.revenueAttainment || 0).toFixed(1)}%`;

  const unitsDelivered = isAll
    ? overviewViewModel.hero.deliveredUnitsFormatted
    : formatInteger(activeBranch?.deliveredUnits || 0);

  const unitsTarget = isAll
    ? overviewViewModel.hero.targetUnitsFormatted
    : formatInteger(activeBranch?.targetUnits || 0);

  const turnaroundDays = isAll
    ? overviewViewModel.hero.deliveryTurnaroundFormatted
    : `${(activeBranch?.avgDeliveryDays || 5.7).toFixed(1)}d`;

  const activeBacklog = isAll
    ? overviewViewModel.hero.orderBacklogCount
    : activeBranch?.orderBacklogCount || 65;

  // Pipeline flow data
  const pipelineStages = [
    { label: 'Inflow', count: isAll ? 1486 : activeBranch?.leadsCreated || 298 },
    { label: 'Test Drive', count: isAll ? 812 : Math.round((activeBranch?.leadsCreated || 298) * 0.55) },
    { label: 'Bookings', count: activeBacklog },
    { label: 'Delivered', count: isAll ? 72 : activeBranch?.deliveredUnits || 15 },
  ];

  // Quota numeric percentage for SVG speedometer gauge
  const attainmentPercentNum = isAll
    ? 9.6
    : Math.min(100, activeBranch?.revenueAttainment || 9.6);

  // Semi-circular arc metrics: radius=28, circumference = PI * 28 = 87.96
  const arcRadius = 28;
  const arcLength = Math.PI * arcRadius;
  const progressRatio = Math.min(1, Math.max(0, attainmentPercentNum / 20));
  const strokeDashoffset = arcLength * (1 - progressRatio);

  return (
    <div className="relative w-full rounded-3xl p-[1px] bg-gradient-to-b from-blue-500/25 via-emerald-500/20 to-neutral-200 dark:to-neutral-800 shadow-xl overflow-hidden group">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-teal-500/10 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Main Glass Cockpit Card */}
      <div className="relative w-full rounded-[23px] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl p-4 sm:p-5.5 border border-white/60 dark:border-neutral-800/80 shadow-2xl flex flex-col justify-between space-y-3.5">
        
        {/* 1. HUD Chrome Header Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-200/80 dark:border-neutral-800/80">
          {/* Left: Window Controls + Clean Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
            </div>

            <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />

            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live Operations</span>
            </div>
          </div>

          {/* Right: Active Hub Scope */}
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
            {isAll ? 'National Group Overview' : `${activeBranch?.branch.name}`}
          </div>
        </div>

        {/* 2. Dealership Metro Hub Segmented Switcher */}
        <div className="w-full overflow-x-auto no-scrollbar py-0.5">
          <div className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 text-xs font-medium gap-1 min-w-full sm:min-w-0">
            <button
              onClick={() => handleBranchChange('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedBranchId === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs font-semibold border border-neutral-200 dark:border-neutral-700'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>All 5 Metro Hubs</span>
            </button>
            {branchSummaries.map(b => (
              <button
                key={b.branch.id}
                onClick={() => handleBranchChange(b.branch.id)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  selectedBranchId === b.branch.id
                    ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs font-semibold border border-neutral-200 dark:border-neutral-700'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <span>{b.branch.city}</span>
                <span className="text-[10px] opacity-60 font-mono">({b.deliveredUnits})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Core Pacing Metrics Grid with Radial Speedometer Gauge */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Metric 1: Realized Revenue */}
          <div className="p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/50 transition-all hover:border-neutral-300 dark:hover:border-neutral-600 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
              <span>Revenue</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold font-mono text-neutral-950 dark:text-white tracking-tight">
                {revenueDelivered}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{revenueAttainment}</span>
                <span>of {revenueTarget}</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Unit Deliveries */}
          <div className="p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/50 transition-all hover:border-neutral-300 dark:hover:border-neutral-600 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
              <span>Gate Units</span>
              <Car className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold font-mono text-neutral-950 dark:text-white tracking-tight">
                {unitsDelivered} <span className="text-xs font-normal text-neutral-400">units</span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {isAll ? overviewViewModel.hero.unitAttainmentFormatted : `${(((activeBranch?.deliveredUnits || 0) / (activeBranch?.targetUnits || 1)) * 100).toFixed(1)}%`}
                </span>
                <span>of {unitsTarget}</span>
              </div>
            </div>
          </div>

          {/* Metric 3: Fulfillment SLA Velocity */}
          <div className="p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/50 transition-all hover:border-neutral-300 dark:hover:border-neutral-600 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1">
              <span>PDI Speed</span>
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                {turnaroundDays}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">1.3d faster</span>
                <span>than target</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Radial Speedometer Gauge */}
          <div className="p-2 sm:p-3 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/50 flex flex-col items-center justify-between text-center">
            <div className="w-full flex items-center justify-between text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-0.5">
              <span>Pacing</span>
              <Gauge className="w-3.5 h-3.5 text-blue-500" />
            </div>
            
            {/* Semi-Circle SVG Gauge */}
            <div className="relative w-20 h-11 flex items-center justify-center overflow-hidden">
              <svg className="w-20 h-20 -rotate-180 transform" viewBox="0 0 70 70">
                <circle
                  cx="35"
                  cy="35"
                  r={arcRadius}
                  fill="none"
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-700"
                  strokeWidth="6"
                  strokeDasharray={`${arcLength} ${arcLength}`}
                />
                <motion.circle
                  cx="35"
                  cy="35"
                  r={arcRadius}
                  fill="none"
                  stroke="url(#speedo-grad)"
                  strokeWidth="6"
                  strokeDasharray={`${arcLength} ${arcLength}`}
                  initial={{ strokeDashoffset: arcLength }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="speedo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-0 text-center">
                <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                  {revenueAttainment}
                </span>
              </div>
            </div>

            <div className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ON PACE
            </div>
          </div>
        </div>

        {/* 4. Sales Pipeline Throughput Ribbon */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Sales Pipeline Throughput</span>
            </div>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {overviewViewModel.kpis.overallConversionRate.toFixed(1)}% Conversion
            </span>
          </div>

          {/* Connected Flow Track with Travelling Energy Pulse */}
          <div className="relative py-2">
            <div className="absolute top-1/2 left-[12.5%] right-[12.5%] -translate-y-1/2 h-0.5 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
            
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-1 w-14 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-[1px]"
              animate={{
                left: ['12.5%', '82%', '12.5%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative grid grid-cols-4 gap-2 text-center">
              {pipelineStages.map((stage) => (
                <div key={stage.label} className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-neutral-900 border-2 border-emerald-500/80 dark:border-emerald-400/80 flex items-center justify-center shadow-xs z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white mt-1.5">
                    {stage.count}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Recent Showroom Activity Ticker */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Recent Showroom Activity</span>
            </div>
            <button
              onClick={handleSimulateNewDeal}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              title="Cycle deal feed"
            >
              <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Inflow</span>
            </button>
          </div>

          <div className="h-14 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDeal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-950 dark:text-white truncate">
                      {activeDeal.model}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 truncate">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{activeDeal.city} Hub</span>
                      <span>•</span>
                      <span>{activeDeal.rep}</span>
                      <span>•</span>
                      <span className="text-neutral-400">{activeDeal.time}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end">
                  <span className="font-mono font-bold text-xs text-neutral-950 dark:text-white">
                    {activeDeal.amount}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${activeDeal.tagColor}`}>
                    {activeDeal.status}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 6. Directive Footer & Direct Link */}
        <div className="flex items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 truncate">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shrink-0" />
            <span className="truncate">
              {isAll
                ? 'Delivery turnaround pacing 1.3 days ahead of national target.'
                : `${activeBranch?.branch.city} Hub: ${turnaroundDays} delivery turnaround.`}
            </span>
          </div>

          <button
            onClick={() => {
              if (selectedBranchId !== 'all') {
                onNavigate('branches', { branchId: selectedBranchId });
              } else {
                onNavigate('branches');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>{isAll ? 'Inspect Matrix (5)' : `View ${activeBranch?.branch.city}`}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
