import React from 'react';
import { OverviewViewModel } from '../../application/view-models';
import { DomainBranchPerformance } from '../../domain/models';
import { AppNavSection } from '../layout/Sidebar';
import { Landing3DScene } from './Landing3DScene';

interface LandingPageProps {
  overviewViewModel: OverviewViewModel;
  branchSummaries: DomainBranchPerformance[];
  onNavigate: (section: AppNavSection, params?: any) => void;
  theme?: 'light' | 'dark';
}

export const LandingPage: React.FC<LandingPageProps> = ({
  overviewViewModel,
  branchSummaries,
  onNavigate,
  theme = 'dark',
}) => {
  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Landing3DScene 
        overviewViewModel={overviewViewModel}
        branchSummaries={branchSummaries}
        onNavigate={onNavigate}
        theme={theme}
      />
    </div>
  );
};
