/**
 * LAYER 5: PRESENTATION - APP ROOT
 * Wires the refactored 6-tier architecture, application context,
 * and high-end presentation layer.
 */

import React from 'react';
import { useApp } from './presentation/context/AppContext';
import { AppShell } from './presentation/layout/AppShell';
import { OverviewPage } from './presentation/overview/OverviewPage';
import { BranchMatrixPage } from './presentation/branches/BranchMatrixPage';
import { BranchDetailPage } from './presentation/branches/BranchDetailPage';
import { RepLeaderboardPage } from './presentation/reps/RepLeaderboardPage';
import { RepDetailPage } from './presentation/reps/RepDetailPage';
import { LeadRegistryPage } from './presentation/leads/LeadRegistryPage';
import { LeadLifecycleModal } from './presentation/leads/LeadLifecycleModal';
import { ActionCenterFullPage } from './presentation/insights/ActionCenterFullPage';
import { LandingPage } from './presentation/landing/LandingPage';
import { VehicleModelPage } from './presentation/vehicles/VehicleModelPage';

export const App: React.FC = () => {
  const {
    repos,
    theme,
    toggleTheme,
    dateFilter,
    setDateFilter,
    funnelMode,
    setFunnelMode,
    selectedBranchId,
    setSelectedBranchId,
    searchQuery,
    setSearchQuery,
    currentRoute,
    routeParams,
    navigateTo,
    inspectingLeadId,
    setInspectingLeadId,
    inspectingLeadViewModel,
    overviewViewModel,
    branchSummaries,
    repSummaries,
    insightsViewModel,
    vehiclesViewModel,
    selectedBranchViewModel,
    selectedRepViewModel,
  } = useApp();

  const getPageTitle = () => {
    switch (currentRoute) {
      case 'landing':
        return 'Platform & Telemetry';
      case 'overview':
        return 'Executive Overview';
      case 'branches':
        if (selectedBranchViewModel) {
          return `${selectedBranchViewModel.branch.name} Performance`;
        }
        return 'Branch Matrix';
      case 'representatives':
        if (selectedRepViewModel) {
          return `${selectedRepViewModel.rep.name} Profile`;
        }
        return 'Sales Leaderboard';
      case 'vehicles':
        return 'Vehicle Fleet Performance';
      case 'leads':
        return 'Lead Registry & Pipeline';
      case 'insights':
        return 'Action Center & Intelligence';
      default:
        return 'Industrial IQ';
    }
  };

  const renderContent = () => {
    switch (currentRoute) {
      case 'landing':
        return (
          <LandingPage
            overviewViewModel={overviewViewModel}
            branchSummaries={branchSummaries}
            onNavigate={(section, params) => navigateTo(section, params)}
            theme={theme}
          />
        );

      case 'overview':
        return (
          <OverviewPage
            viewModel={overviewViewModel}
            funnelMode={funnelMode}
            onFunnelModeChange={setFunnelMode}
            onSelectBranch={branchId => navigateTo('branches', { branchId })}
            onViewAllBranches={() => navigateTo('branches')}
            onViewAllInsights={() => navigateTo('insights')}
            onNavigateAction={url => {
              if (url) window.location.hash = url;
            }}
            onInspectBacklog={() => navigateTo('leads', { filter: 'active' })}
            onInspectPipeline={() => navigateTo('leads', { filter: 'active' })}
          />
        );

      case 'branches':
        if (selectedBranchViewModel) {
          return (
            <BranchDetailPage
              viewModel={selectedBranchViewModel}
              currentFunnelMode={funnelMode}
              onFunnelModeChange={setFunnelMode}
              onSelectRep={repId => navigateTo('representatives', { repId })}
              onViewBranchLeads={branchId => navigateTo('leads', { branchId })}
              onGoBranches={() => navigateTo('branches')}
            />
          );
        }
        return (
          <BranchMatrixPage
            summaries={branchSummaries}
            onSelectBranch={branchId => navigateTo('branches', { branchId })}
            onGoHome={() => navigateTo('overview')}
          />
        );

      case 'representatives':
        if (selectedRepViewModel) {
          return (
            <RepDetailPage
              model={selectedRepViewModel}
              onSelectLead={(leadId: string) => setInspectingLeadId(leadId)}
              onSelectBranch={branchId => navigateTo('branches', { branchId })}
              onBack={() => navigateTo('representatives')}
            />
          );
        }
        return (
          <RepLeaderboardPage
            summaries={repSummaries}
            onSelectRep={repId => navigateTo('representatives', { repId })}
            onSelectBranch={branchId => navigateTo('branches', { branchId })}
            onGoHome={() => navigateTo('overview')}
          />
        );

      case 'vehicles':
        return (
          <VehicleModelPage
            viewModel={vehiclesViewModel}
            branches={repos.branches.getAll()}
            selectedBranchId={selectedBranchId}
            onSelectBranch={branchId => setSelectedBranchId(branchId)}
            onSelectLead={leadId => setInspectingLeadId(leadId)}
            onGoHome={() => navigateTo('overview')}
            onViewLeadsForModel={model => navigateTo('leads', { filter: model })}
          />
        );

      case 'leads':
        return (
          <LeadRegistryPage
            leads={repos.leads.getAll()}
            branches={repos.branches.getAll()}
            salesReps={repos.salesReps.getAll()}
            onSelectLead={leadId => setInspectingLeadId(leadId)}
            onSelectBranch={branchId => navigateTo('branches', { branchId })}
            onSelectRep={repId => navigateTo('representatives', { repId })}
            onGoHome={() => navigateTo('overview')}
          />
        );

      case 'insights':
        return (
          <ActionCenterFullPage
            viewModel={insightsViewModel}
            onNavigate={(type, id) => {
              if (type === 'branch') navigateTo('branches', { branchId: id });
              else if (type === 'representative') navigateTo('representatives', { repId: id });
              else if (type === 'lead') {
                navigateTo('leads', { leadId: id });
                setInspectingLeadId(id || null);
              } else {
                navigateTo('overview');
              }
            }}
            onGoHome={() => navigateTo('overview')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AppShell
      currentSection={currentRoute}
      pageTitle={getPageTitle()}
      onNavigate={section => navigateTo(section)}
      insightsCount={insightsViewModel.criticalCount + insightsViewModel.highCount}
      branches={repos.branches.getAll()}
      selectedBranchId={selectedBranchId}
      onBranchChange={id => setSelectedBranchId(id)}
      currentFilter={dateFilter}
      onFilterChange={f => setDateFilter(f)}
      searchQuery={searchQuery}
      onSearchChange={q => setSearchQuery(q)}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {renderContent()}

      {/* Persistent Inspection Modal */}
      <LeadLifecycleModal
        viewModel={inspectingLeadViewModel}
        onClose={() => setInspectingLeadId(null)}
        onSelectBranch={branchId => navigateTo('branches', { branchId })}
        onSelectRep={repId => navigateTo('representatives', { repId })}
      />
    </AppShell>
  );
};
