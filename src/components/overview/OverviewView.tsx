import React from 'react';
import { ExecutiveKpiRow } from './ExecutiveKpiRow';
import { TargetPerformance } from './TargetPerformance';
import { FunnelOverview } from './FunnelOverview';
import { BranchComparison } from './BranchComparison';
import { ActionCenterPreview } from './ActionCenterPreview';

export const OverviewView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Vital Signs / Executive KPIs */}
      <ExecutiveKpiRow />

      {/* 2. Target Performance & Attainment Trajectory */}
      <TargetPerformance />

      {/* 3. Action Center (Top Prioritized Issues) */}
      <ActionCenterPreview />

      {/* 4. Conversion Funnel & Stage Drop-off Analysis */}
      <FunnelOverview />

      {/* 5. Branch Comparative Scorecard */}
      <BranchComparison />
    </div>
  );
};

