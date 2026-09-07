/**
 * LAYER 4: APPLICATION LAYER - USE CASE: GET OVERVIEW VIEW MODEL
 * Orchestrates repositories and domain calculators to construct the
 * complete OverviewViewModel consumed by the presentation layer.
 */

import { DataRepositories } from '../../data-access/repositories';
import { OverviewViewModel } from '../view-models';
import { calculateExecutiveKpis } from '../../domain/kpi';
import { calculateMonthlyTargetTrends, calculateBranchPerformanceSummaries } from '../../domain/targets';
import { calculateFunnelMetrics } from '../../domain/funnel';
import { generateActionableInsights } from '../../domain/insights';
import { formatCurrency, formatInteger, formatPercent } from '../../infrastructure/formatters';

export function getOverviewViewModel(
  repos: DataRepositories,
  startDate: string,
  endDate: string,
  funnelMode: 'cohort' | 'event' = 'cohort',
  selectedBranchId?: string
): OverviewViewModel {
  const leads = repos.leads.getAll();
  const targets = repos.targets.getAll();
  const deliveries = repos.deliveries.getAll();
  const branches = repos.branches.getAll();
  const salesReps = repos.salesReps.getAll();

  const kpis = calculateExecutiveKpis(
    leads,
    targets,
    deliveries,
    startDate,
    endDate,
    selectedBranchId
  );

  const monthlyTrends = calculateMonthlyTargetTrends(
    targets,
    deliveries,
    leads,
    selectedBranchId
  );

  const funnel = calculateFunnelMetrics(
    leads,
    startDate,
    endDate,
    funnelMode,
    selectedBranchId
  );

  const branchSummaries = calculateBranchPerformanceSummaries(
    branches,
    salesReps,
    targets,
    deliveries,
    leads,
    startDate,
    endDate
  );

  const prioritizedInsights = generateActionableInsights(
    branches,
    salesReps,
    targets,
    deliveries,
    leads,
    startDate,
    endDate,
    selectedBranchId
  );

  const healthStatus =
    kpis.unitAttainment >= 75 ? 'healthy' : kpis.unitAttainment >= 40 ? 'warning' : 'critical';

  return {
    kpis,
    hero: {
      deliveredRevenueFormatted: formatCurrency(kpis.deliveredRevenue, true),
      deliveredUnitsFormatted: `${formatInteger(kpis.deliveredUnits)} units`,
      unitAttainmentFormatted: formatPercent(kpis.unitAttainment),
      revenueAttainmentFormatted: formatPercent(kpis.revenueAttainment),
      targetUnitsFormatted: `${formatInteger(kpis.targetUnits)} units`,
      targetRevenueFormatted: formatCurrency(kpis.targetRevenue, true),
      unitGapFormatted: `${kpis.unitGap >= 0 ? '+' : ''}${kpis.unitGap} units`,
      revenueGapFormatted: `${kpis.revenueGap >= 0 ? '+' : ''}${formatCurrency(kpis.revenueGap, true)}`,
      activePipelineFormatted: formatCurrency(kpis.pipelineActiveValue, true),
      activePipelineCount: kpis.pipelineActiveCount,
      orderBacklogFormatted: formatCurrency(kpis.orderBacklogValue, true),
      orderBacklogCount: kpis.orderBacklogCount,
      winRateFormatted: formatPercent(kpis.overallConversionRate),
      deliveryTurnaroundFormatted: `${kpis.avgDeliveryDays.toFixed(1)}d`,
      deliveryDelayRateFormatted: formatPercent(kpis.deliveryDelayRate),
      healthStatus,
    },
    monthlyTrends,
    funnel,
    branchSummaries,
    prioritizedInsights,
  };
}

