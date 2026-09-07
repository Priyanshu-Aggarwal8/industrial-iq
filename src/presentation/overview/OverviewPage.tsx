/**
 * LAYER 5: PRESENTATION - OVERVIEW PAGE
 * The flagship Industrial IQ executive intelligence experience.
 * Assembles the Dribbble-grade Hero Showcase, Asymmetric Vital Signs,
 * Target Trajectory, Action Center, Branch Scorecards, and Funnel Leakage.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { OverviewViewModel } from '../../application/view-models';
import { HeroPerformanceShowcase } from './HeroPerformanceShowcase';
import { ActionCenterShowcase } from './ActionCenterShowcase';
import { BranchScorecardMatrix } from './BranchScorecardMatrix';
import { GroupFunnelShowcase } from './GroupFunnelShowcase';
import { useMotionSafe } from '../motion/variants';

interface OverviewPageProps {
  viewModel: OverviewViewModel;
  funnelMode: 'cohort' | 'event';
  onFunnelModeChange: (mode: 'cohort' | 'event') => void;
  onSelectBranch: (branchId: string) => void;
  onViewAllBranches: () => void;
  onViewAllInsights: () => void;
  onNavigateAction: (url?: string) => void;
  onInspectBacklog: () => void;
  onInspectPipeline: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  viewModel,
  funnelMode,
  onFunnelModeChange,
  onSelectBranch,
  onViewAllBranches,
  onViewAllInsights,
  onNavigateAction,
  onInspectBacklog,
  onInspectPipeline,
}) => {
  const { containerVariants, itemVariants } = useMotionSafe();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* 1. FLAGSHIP COCKPIT CENTERPIECE (Telemetry ribbon, 5 gauges, authoritative trajectory chart, pit-wall feed) */}
      <HeroPerformanceShowcase
        hero={viewModel.hero}
        monthlyTrends={viewModel.monthlyTrends}
        branchSummaries={viewModel.branchSummaries}
        prioritizedInsights={viewModel.prioritizedInsights}
        onSelectBranch={onSelectBranch}
        onInspectBacklog={onInspectBacklog}
        onInspectPipeline={onInspectPipeline}
        onViewAllInsights={onViewAllInsights}
      />

      {/* 2. DEALERSHIP BRANCH CONSTRUCTOR STANDINGS (P1-P5 Comparative Matrix) */}
      <motion.div variants={itemVariants}>
        <BranchScorecardMatrix
          branches={viewModel.branchSummaries}
          onSelectBranch={onSelectBranch}
          onViewAllBranches={onViewAllBranches}
        />
      </motion.div>

      {/* 3. DUAL-PERSPECTIVE SALES CONVERSION FUNNEL & LEAKAGE */}
      <motion.div variants={itemVariants}>
        <GroupFunnelShowcase
          funnel={viewModel.funnel}
          currentMode={funnelMode}
          onModeChange={onFunnelModeChange}
        />
      </motion.div>

      {/* 4. EXECUTIVE ACTION CENTER & PIT-WALL INTERVENTIONS */}
      <motion.div variants={itemVariants}>
        <ActionCenterShowcase
          insights={viewModel.prioritizedInsights}
          onViewAll={onViewAllInsights}
          onNavigateAction={onNavigateAction}
        />
      </motion.div>
    </motion.div>
  );
};
