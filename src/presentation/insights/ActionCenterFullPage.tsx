/**
 * LAYER 5: PRESENTATION - ACTION CENTER FULL PAGE
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  Info,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Building2,
  Users,
  Clock,
  Truck,
  TrendingDown,
} from 'lucide-react';
import { ActionableInsightsViewModel } from '../../application/view-models';
import { DomainActionableInsight, DomainInsightCategory, DomainInsightPriority } from '../../domain/models';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { useMotionSafe } from '../motion/variants';

interface ActionCenterFullPageProps {
  viewModel: ActionableInsightsViewModel;
  onNavigate: (entityType: string, entityId?: string) => void;
  onGoHome: () => void;
}

export const ActionCenterFullPage: React.FC<ActionCenterFullPageProps> = ({
  viewModel,
  onNavigate,
  onGoHome,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();
  const { insights, criticalCount, highCount, mediumCount, infoCount } = viewModel;

  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered insights
  const filteredInsights = useMemo(() => {
    return insights.filter(item => {
      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(s) ||
        item.explanation.toLowerCase().includes(s) ||
        item.evidence.toLowerCase().includes(s) ||
        (item.scopeName && item.scopeName.toLowerCase().includes(s));

      return matchesPriority && matchesCategory && matchesSearch;
    });
  }, [insights, selectedPriority, selectedCategory, searchTerm]);

  const getPriorityStyle = (priority: DomainInsightPriority) => {
    switch (priority) {
      case 'critical':
        return {
          badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
          border: 'border-rose-300 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-800',
          glow: 'bg-rose-500/5 dark:bg-rose-500/10',
          icon: <AlertOctagon className="w-4 h-4 text-rose-500" />,
        };
      case 'high':
        return {
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
          border: 'border-amber-300 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-800',
          glow: 'bg-amber-500/5 dark:bg-amber-500/10',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        };
      case 'medium':
        return {
          badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
          border: 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
          glow: 'bg-blue-500/5 dark:bg-blue-500/10',
          icon: <Info className="w-4 h-4 text-blue-500" />,
        };
      default:
        return {
          badge: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700',
          border: 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
          glow: 'bg-neutral-50 dark:bg-neutral-900',
          icon: <Info className="w-4 h-4 text-neutral-400" />,
        };
    }
  };

  const getCategoryLabel = (category: DomainInsightCategory) => {
    switch (category) {
      case 'attainment':
        return 'Quota Attainment';
      case 'bottleneck':
        return 'Pipeline Bottleneck';
      case 'fulfillment':
        return 'Delivery Logistics';
      case 'aging':
        return 'Lead Stagnation';
      case 'coaching':
        return 'Sales Rep Coaching';
      case 'channel':
        return 'Acquisition Channel';
      default:
        return category;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Breadcrumbs crumbs={[{ label: 'Executive Action Center', onClick: onGoHome }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Autonomous Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight mt-1 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Executive Action Center & Priority Diagnostics
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
            Algorithmic diagnostics ranking dealership vulnerabilities, fulfillment delays, rep coaching gaps, and revenue opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-sm text-neutral-600 dark:text-neutral-300">
          <span>Total Insights:</span>
          <span className="font-bold text-neutral-950 dark:text-neutral-50 px-3.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs">
            {insights.length}
          </span>
        </div>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedPriority(selectedPriority === 'critical' ? 'all' : 'critical')}
          className={`p-5 rounded-xl text-left border transition-all ${
            selectedPriority === 'critical'
              ? 'bg-rose-500/10 border-rose-500/40 ring-1 ring-rose-500/50 shadow-sm'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-neutral-700 shadow-subtle'
          }`}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1.5">
            <span>Critical Priority</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 dark:text-neutral-50">{criticalCount}</div>
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Immediate intervention required</div>
        </button>

        <button
          onClick={() => setSelectedPriority(selectedPriority === 'high' ? 'all' : 'high')}
          className={`p-5 rounded-xl text-left border transition-all ${
            selectedPriority === 'high'
              ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/50 shadow-sm'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-neutral-700 shadow-subtle'
          }`}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1.5">
            <span>High Priority</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 dark:text-neutral-50">{highCount}</div>
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Urgent operational impact</div>
        </button>

        <button
          onClick={() => setSelectedPriority(selectedPriority === 'medium' ? 'all' : 'medium')}
          className={`p-5 rounded-xl text-left border transition-all ${
            selectedPriority === 'medium'
              ? 'bg-blue-500/10 border-blue-500/40 ring-1 ring-blue-500/50 shadow-sm'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-neutral-700 shadow-subtle'
          }`}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1.5">
            <span>Medium Priority</span>
            <Info className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 dark:text-neutral-50">{mediumCount}</div>
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Tactical process improvements</div>
        </button>

        <button
          onClick={() => setSelectedPriority(selectedPriority === 'info' ? 'all' : 'info')}
          className={`p-5 rounded-xl text-left border transition-all ${
            selectedPriority === 'info'
              ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 ring-1 ring-neutral-400 shadow-sm'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-subtle'
          }`}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            <span>Informational</span>
            <Info className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 dark:text-neutral-50">{infoCount}</div>
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Observations & best practices</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search diagnostic insights..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              aria-label="Filter by Category"
              className="px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Operational Categories</option>
              <option value="attainment">Quota Attainment</option>
              <option value="bottleneck">Pipeline Bottlenecks</option>
              <option value="fulfillment">Delivery Logistics</option>
              <option value="aging">Lead Stagnation</option>
              <option value="coaching">Sales Rep Coaching</option>
              <option value="channel">Acquisition Channel</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing <strong className="text-neutral-950 dark:text-neutral-50">{filteredInsights.length}</strong> of{' '}
          <strong className="text-neutral-950 dark:text-neutral-50">{insights.length}</strong> recommendations
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="space-y-4">
        {filteredInsights.map(item => {
          const style = getPriorityStyle(item.priority);

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`p-6 sm:p-7 rounded-xl bg-white dark:bg-neutral-900 border ${style.border} transition-all shadow-subtle space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wider ${style.badge}`}
                    >
                      {style.icon}
                      {item.priority}
                    </span>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      {getCategoryLabel(item.category)}
                    </span>

                    {item.scopeName && (
                      <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                        {item.scopeEntity.toUpperCase()}: {item.scopeName}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start font-mono">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">Score:</span>
                  <span className="text-xs font-bold text-neutral-950 dark:text-neutral-50 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    {item.priorityScore}/100
                  </span>
                </div>
              </div>

              {/* Explanation & Evidence */}
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {item.explanation}
              </p>

              <div className="p-4 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/80">
                <div className="text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400 mb-1 tracking-wider">
                  Empirical Evidence
                </div>
                <div className="text-xs sm:text-sm font-mono text-neutral-900 dark:text-neutral-100 leading-relaxed">
                  {item.evidence}
                </div>
              </div>

              {/* Recommendation and Action Link */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">Recommended Intervention: </strong>
                    {item.recommendedAction}
                  </span>
                </div>

                {item.scopeEntity && (
                  <button
                    onClick={() => onNavigate(item.scopeEntity, item.scopeId)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap self-end sm:self-auto"
                  >
                    <span>{item.actionLabel || `Inspect ${item.scopeEntity}`}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {filteredInsights.length === 0 && (
          <div className="p-12 text-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
            No diagnostic insights match the selected priority or category filters.
          </div>
        )}
      </div>
    </motion.div>
  );
};

