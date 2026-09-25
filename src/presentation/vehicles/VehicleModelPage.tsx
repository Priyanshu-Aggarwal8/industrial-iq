/**
 * LAYER 5: PRESENTATION - VEHICLE MODEL FLEET INTELLIGENCE PAGE
 * Executive model-by-model sales, deliveries, and revenue breakdown
 * with interactive dealership drill-down and best-selling model attribution.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Building2,
  TrendingUp,
  Award,
  DollarSign,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Flame,
  ArrowUpDown,
  Percent,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { RawBranch } from '../../data/schemas';
import { VehiclePerformanceViewModel, VehicleModelItemViewModel } from '../../application';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { formatCurrency, formatPercent, formatInteger } from '../../infrastructure/formatters';
import { useMotionSafe } from '../motion/variants';

interface VehicleModelPageProps {
  viewModel: VehiclePerformanceViewModel;
  branches: RawBranch[];
  selectedBranchId?: string;
  onSelectBranch: (branchId?: string) => void;
  onSelectLead?: (leadId: string) => void;
  onGoHome: () => void;
  onViewLeadsForModel?: (model: string) => void;
}

// Model vehicle segments for editorial polish
const MODEL_SEGMENTS: Record<string, string> = {
  Fortuner: 'Full-Size Premium SUV',
  'Innova Hycross': 'Premium Hybrid MPV',
  'Urban Cruiser Hyryder': 'Compact Hybrid SUV',
  'Innova Crysta': 'Executive Diesel MPV',
  Camry: 'Luxury Hybrid Sedan',
  Glanza: 'Premium Urban Hatchback',
  Hilux: 'Heavy-Duty 4x4 Lifestyle Pickup',
};

export const VehicleModelPage: React.FC<VehicleModelPageProps> = ({
  viewModel,
  branches,
  selectedBranchId,
  onSelectBranch,
  onGoHome,
  onViewLeadsForModel,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();

  // Search & sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'delivers' | 'orders' | 'contribution'>('revenue');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [chartMetric, setChartMetric] = useState<'revenue' | 'volume'>('revenue');

  // Filtered & sorted models
  const filteredModels = useMemo(() => {
    let result = [...viewModel.models];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        m =>
          m.model.toLowerCase().includes(q) ||
          (MODEL_SEGMENTS[m.model] && MODEL_SEGMENTS[m.model].toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      let diff = 0;
      if (sortBy === 'revenue') diff = b.deliveredRevenue - a.deliveredRevenue;
      else if (sortBy === 'delivers') diff = b.delivers - a.delivers;
      else if (sortBy === 'orders') diff = b.orders - a.orders;
      else if (sortBy === 'contribution') diff = b.revenueContributionPercent - a.revenueContributionPercent;

      return sortOrder === 'desc' ? diff : -diff;
    });

    return result;
  }, [viewModel.models, searchTerm, sortBy, sortOrder]);

  const toggleSort = (field: 'revenue' | 'delivers' | 'orders' | 'contribution') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const chartData = useMemo(() => {
    return [...viewModel.models]
      .sort((a, b) => b.deliveredRevenue - a.deliveredRevenue)
      .map(m => ({
        name: m.model,
        shortName: m.model.replace('Urban Cruiser ', 'UC ').replace('Innova ', 'Inv. '),
        revenueCrores: Number((m.deliveredRevenue / 10000000).toFixed(2)),
        totalOrderCrores: Number((m.totalOrderValue / 10000000).toFixed(2)),
        delivers: m.delivers,
        orders: m.orders,
        orderBacklog: m.orderBacklog,
        contribution: Number(m.revenueContributionPercent.toFixed(1)),
      }));
  }, [viewModel.models]);

  const activeBranch = branches.find(b => b.id === selectedBranchId);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Editorial Breadcrumbs */}
      <Breadcrumbs
        crumbs={[
          { label: 'Executive Overview', onClick: onGoHome },
          { label: 'Vehicles' },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              <Car className="w-3.5 h-3.5" />
              Fleet Intelligence
            </span>
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">•</span>
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              {viewModel.models.length} Vehicle Models Tracked
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            Vehicle Fleet Sales & Delivery Matrix
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1.5 max-w-3xl leading-relaxed">
            Model-by-model breakdown of confirmed customer orders, fulfilled vehicle handovers, and net realized revenue.
            Drill down into dealership-specific distribution to detect localized model demand and supply imbalances.
          </p>
        </div>

        {/* Current Scope Badge */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
          <div className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Scope:</span>
            <span className="font-bold text-neutral-950 dark:text-white">
              {activeBranch ? `${activeBranch.name} (${activeBranch.city})` : 'All 5 Dealerships Group-Wide'}
            </span>
          </div>
        </div>
      </div>

      {/* Dealership Drill-Down Quick Filter Pills */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
            <span>Filter By Dealership Location</span>
          </div>
          <span className="text-neutral-400 normal-case font-normal text-xs">
            Select a location to isolate vehicle metrics for that specific showroom
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectBranch(undefined)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              !selectedBranchId
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md ring-2 ring-neutral-950/20 dark:ring-white/20'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-950 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>All Dealerships</span>
            <span className="text-[11px] opacity-75 font-mono">
              ({branches.length} branches)
            </span>
          </button>

          {branches.map(b => {
            const isSelected = selectedBranchId === b.id;
            return (
              <button
                key={b.id}
                onClick={() => onSelectBranch(b.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-md ring-2 ring-neutral-950/20 dark:ring-white/20'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-950 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-700'
                }`}
              >
                <span>{b.name}</span>
                <span className="text-[11px] opacity-60 font-mono">({b.city})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* EXECUTIVE SPOTLIGHT HERO: Best-Selling Models & Fleet Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Best-Selling Model by Revenue */}
        {viewModel.bestSellingByRevenue && (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-400/10 dark:via-neutral-900 dark:to-neutral-900 border border-amber-500/30 p-6 flex flex-col justify-between shadow-subtle relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Best Seller by Revenue
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  #1 Commercial Rank
                </span>
              </div>

              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {MODEL_SEGMENTS[viewModel.bestSellingByRevenue.model] || 'Vehicle Model'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white mt-0.5">
                {viewModel.bestSellingByRevenue.model}
              </h2>

              <div className="mt-4 pt-4 border-t border-amber-500/20 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    Realized Revenue
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-neutral-950 dark:text-white">
                    {viewModel.bestSellingByRevenue.revenueFormatted}
                  </span>
                </div>

                {/* Highlighted Revenue Contribution Percentage */}
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                    <span>Revenue Contribution to Overall Sales</span>
                    <span className="font-mono text-base font-black">
                      {viewModel.bestSellingByRevenue.revenueContributionFormatted}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, viewModel.bestSellingByRevenue.revenueContributionPercent)}%`,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-1.5">
                    Generates 1 out of every {(100 / Math.max(1, viewModel.bestSellingByRevenue.revenueContributionPercent)).toFixed(1)} revenue rupees across {viewModel.selectedBranchName}.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/60 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Deliveries Handed Over</span>
                    <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                      {viewModel.bestSellingByRevenue.delivers} units
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/60 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Total Confirmed Orders</span>
                    <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                      {viewModel.bestSellingByRevenue.orders} orders
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Card 2: Best-Selling Model by Volume */}
        {viewModel.bestSellingByVolume && (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-400/10 dark:via-neutral-900 dark:to-neutral-900 border border-emerald-500/30 p-6 flex flex-col justify-between shadow-subtle relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Best Seller by Volume (Units)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  #1 Unit Velocity
                </span>
              </div>

              <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {MODEL_SEGMENTS[viewModel.bestSellingByVolume.model] || 'Vehicle Model'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white mt-0.5">
                {viewModel.bestSellingByVolume.model}
              </h2>

              <div className="mt-4 pt-4 border-t border-emerald-500/20 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    Delivered Units
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {viewModel.bestSellingByVolume.delivers} units
                  </span>
                </div>

                {/* Highlighted Revenue Contribution Percentage */}
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1.5">
                    <span>Revenue Contribution to Overall Sales</span>
                    <span className="font-mono text-base font-black">
                      {viewModel.bestSellingByVolume.revenueContributionFormatted}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, viewModel.bestSellingByVolume.revenueContributionPercent)}%`,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1.5">
                    Generates {viewModel.bestSellingByVolume.revenueFormatted} in revenue with {viewModel.bestSellingByVolume.volumeContributionFormatted} of all unit handovers.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/60 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Total Confirmed Orders</span>
                    <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                      {viewModel.bestSellingByVolume.orders} orders
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/60 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Sales Conversion Rate</span>
                    <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                      {viewModel.bestSellingByVolume.conversionRateFormatted}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Card 3: Scope Total & Fulfillment Vital Signs */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between shadow-subtle"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                <PackageCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Fleet Totals ({viewModel.selectedBranchName})
              </span>
              <span className="text-xs font-mono font-bold text-neutral-500">
                Aggregate Telemetry
              </span>
            </div>

            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Realized Sales
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-950 dark:text-white mt-0.5">
              {viewModel.totalDeliveredRevenueFormatted}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-750">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Units Delivered</span>
                  <span className="text-base font-black font-mono text-neutral-950 dark:text-white">
                    {viewModel.totalDeliveredUnitsFormatted}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-750">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Orders Booked</span>
                  <span className="text-base font-black font-mono text-neutral-950 dark:text-white">
                    {viewModel.totalOrdersCountFormatted}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-750">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Delivery Backlog</span>
                  <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400">
                    {viewModel.totalOrderBacklogFormatted}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-750">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Delivery Realization</span>
                  <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {viewModel.fulfillmentRateFormatted}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                <span>Inbound Inquiries:</span>
                <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  {viewModel.totalLeadsCountFormatted}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Visual Analytics: Revenue vs Orders Chart */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Vehicle Fleet Commercial Distribution
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Comparative visualization of revenue generation and delivery volume across each vehicle model in {viewModel.selectedBranchName}.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 self-start sm:self-auto border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartMetric === 'revenue'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Revenue (₹ Cr)
            </button>
            <button
              onClick={() => setChartMetric('volume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartMetric === 'volume'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Units (Delivers vs Orders)
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888888" strokeOpacity={0.15} vertical={false} />
              <XAxis
                dataKey="shortName"
                stroke="#888888"
                tick={{ fill: '#888888', fontSize: 12, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#888888', strokeOpacity: 0.2 }}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                stroke="#888888"
                tick={{ fill: '#888888', fontSize: 12, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                unit={chartMetric === 'revenue' ? ' Cr' : ''}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="p-4 rounded-xl bg-neutral-950/95 dark:bg-black/95 text-white border border-neutral-800 shadow-2xl backdrop-blur-md text-xs space-y-2 font-mono min-w-[220px]">
                      <div className="font-bold text-white border-b border-neutral-800 pb-1.5 text-sm">
                        {d.name}
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-400">Delivered Revenue:</span>
                        <span className="font-bold text-emerald-400">₹{d.revenueCrores} Cr</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-400">Total Booked Value:</span>
                        <span className="font-bold text-blue-400">₹{d.totalOrderCrores} Cr</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-400">Delivered Units:</span>
                        <span className="font-bold text-white">{d.delivers} units</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-neutral-400">Orders Booked:</span>
                        <span className="font-bold text-amber-400">{d.orders} orders</span>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-neutral-800 pt-1.5">
                        <span className="text-neutral-400">Revenue Contribution:</span>
                        <span className="font-bold text-amber-300">{d.contribution}%</span>
                      </div>
                    </div>
                  );
                }}
              />
              {chartMetric === 'revenue' ? (
                <Bar dataKey="revenueCrores" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#F59E0B' : '#2563EB'}
                      fillOpacity={0.9}
                    />
                  ))}
                </Bar>
              ) : (
                <>
                  <Bar dataKey="delivers" name="Delivered Units" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="orders" name="Orders Booked" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MODEL-BY-MODEL BREAKDOWN TABLE */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle overflow-hidden">
        {/* Table Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Vehicle Model Performance Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Orders placed, deliveries completed, realized revenue, and relative sales contribution for each vehicle model.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Quick Sort Options */}
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => toggleSort('revenue')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  sortBy === 'revenue'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <span>Revenue</span>
                {sortBy === 'revenue' && <ArrowUpDown className="w-3 h-3" />}
              </button>
              <button
                onClick={() => toggleSort('delivers')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  sortBy === 'delivers'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <span>Delivers</span>
                {sortBy === 'delivers' && <ArrowUpDown className="w-3 h-3" />}
              </button>
              <button
                onClick={() => toggleSort('orders')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  sortBy === 'orders'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <span>Orders</span>
                {sortBy === 'orders' && <ArrowUpDown className="w-3 h-3" />}
              </button>
              <button
                onClick={() => toggleSort('contribution')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  sortBy === 'contribution'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                <span>% Contrib</span>
                {sortBy === 'contribution' && <ArrowUpDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tabular Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950/60 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 select-none">
              <tr>
                <th className="py-3.5 pl-6 pr-4">#</th>
                <th className="py-3.5 px-4">Vehicle Model</th>
                <th
                  onClick={() => toggleSort('orders')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Orders</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('delivers')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Delivers</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('revenue')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Realized Revenue</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('contribution')}
                  className="py-3.5 px-4 text-left cursor-pointer hover:text-neutral-900 dark:hover:text-white min-w-[170px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Revenue Contrib %</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Inquiries</th>
                <th className="py-3.5 px-4 text-right">Win Rate</th>
                <th className="py-3.5 pl-4 pr-6 text-center">Drill Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800">
              {filteredModels.map((m, idx) => {
                const isExpanded = expandedModel === m.model;
                const isTopRevenue = viewModel.bestSellingByRevenue?.model === m.model;
                const isTopVolume = viewModel.bestSellingByVolume?.model === m.model;

                return (
                  <React.Fragment key={m.model}>
                    <tr
                      className={`transition-colors group hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 ${
                        isExpanded ? 'bg-neutral-50/90 dark:bg-neutral-800/60' : ''
                      }`}
                    >
                      {/* Rank Index */}
                      <td className="py-4 pl-6 pr-4 font-mono text-xs font-bold text-neutral-400">
                        #{idx + 1}
                      </td>

                      {/* Model & Segment */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
                            <Car className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                          </div>
                          <div>
                            <div className="font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                              <span>{m.model}</span>
                              {isTopRevenue && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                                  <Flame className="w-3 h-3 text-amber-600" /> Top Revenue
                                </span>
                              )}
                              {isTopVolume && !isTopRevenue && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                                  <Award className="w-3 h-3 text-emerald-600" /> Top Volume
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {MODEL_SEGMENTS[m.model] || 'Toyota Lineup'} • Avg {m.avgDealValueFormatted}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-bold text-neutral-900 dark:text-white">
                          {m.orders}
                        </div>
                        {m.orderBacklog > 0 && (
                          <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                            +{m.orderBacklog} backlog
                          </div>
                        )}
                      </td>

                      {/* Delivers */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-neutral-900 dark:text-white">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-bold">
                          {m.delivers}
                        </span>
                      </td>

                      {/* Realized Revenue */}
                      <td className="py-4 px-4 text-right font-mono font-black text-neutral-950 dark:text-white text-base">
                        {m.revenueFormatted}
                      </td>

                      {/* Revenue Contribution % Progress Bar */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono font-bold">
                            <span className="text-neutral-900 dark:text-white">
                              {m.revenueContributionFormatted}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-normal">
                              of total
                            </span>
                          </div>
                          <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isTopRevenue
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                  : 'bg-blue-600 dark:bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(100, m.revenueContributionPercent)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Inquiries */}
                      <td className="py-4 px-4 text-right font-mono text-neutral-600 dark:text-neutral-400">
                        {m.leadsCount}
                      </td>

                      {/* Win Rate */}
                      <td className="py-4 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {m.conversionRateFormatted}
                      </td>

                      {/* Drill Down Expander */}
                      <td className="py-4 pl-4 pr-6 text-center">
                        <button
                          onClick={() => setExpandedModel(isExpanded ? null : m.model)}
                          className={`p-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 border ${
                            isExpanded
                              ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs'
                              : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-950 dark:hover:text-white'
                          }`}
                          title="Drill down into dealership distribution"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Hide' : 'Branches'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDABLE DEALERSHIP DRILL-DOWN SUB-ROW */}
                    {isExpanded && (
                      <tr className="bg-neutral-50/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800">
                        <td colSpan={9} className="py-5 px-6">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-bold text-sm text-neutral-950 dark:text-white">
                                  Dealership-by-Dealership Drill Down: {m.model}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {onViewLeadsForModel && (
                                  <button
                                    onClick={() => onViewLeadsForModel(m.model)}
                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Inspect {m.model} Leads & Pipeline</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Dealership Grid for this Model */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                              {m.branchBreakdown.map(bb => {
                                const isCurrentBranch = selectedBranchId === bb.branchId;
                                const hasActivity = bb.orders > 0 || bb.delivers > 0;
                                const branchModelRevenueShare =
                                  m.deliveredRevenue > 0
                                    ? (bb.deliveredRevenue / m.deliveredRevenue) * 100
                                    : 0;

                                return (
                                  <div
                                    key={bb.branchId}
                                    onClick={() => onSelectBranch(bb.branchId)}
                                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                      isCurrentBranch
                                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-sm'
                                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 shadow-xs'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between gap-1 mb-1">
                                        <span className="text-xs font-bold text-neutral-950 dark:text-white truncate">
                                          {bb.branchName}
                                        </span>
                                        <span className="text-[10px] font-mono text-neutral-400">
                                          {bb.branchCity}
                                        </span>
                                      </div>

                                      <div className="mt-2 text-base font-black font-mono text-neutral-900 dark:text-white">
                                        {bb.deliveredRevenueFormatted}
                                      </div>
                                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                        {formatPercent(branchModelRevenueShare)} of model sales
                                      </div>
                                    </div>

                                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-2 text-xs font-mono">
                                      <div>
                                        <span className="text-[10px] text-neutral-400 block">Orders</span>
                                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                                          {bb.orders}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[10px] text-neutral-400 block">Delivers</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                          {bb.delivers}
                                        </span>
                                      </div>
                                    </div>

                                    {bb.orderBacklog > 0 && (
                                      <div className="mt-1.5 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                                        +{bb.orderBacklog} backlog pending
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
