/**
 * LAYER 4: APPLICATION LAYER - USE CASE: GET BRANCH PERFORMANCE VIEW MODEL
 */

import { DataRepositories } from '../../data-access/repositories';
import { BranchPerformanceViewModel } from '../view-models';
import { calculateBranchPerformanceSummaries } from '../../domain/targets';
import { calculateFunnelMetrics } from '../../domain/funnel';
import { calculateRepPerformanceSummaries } from '../../domain/aging';
import { calculateDeliveryAnalytics } from '../../domain/delivery';
import { generateActionableInsights } from '../../domain/insights';

export function getBranchPerformanceViewModel(
  repos: DataRepositories,
  branchId: string,
  startDate: string,
  endDate: string,
  funnelMode: 'cohort' | 'event' = 'cohort'
): BranchPerformanceViewModel | null {
  const branch = repos.branches.getById(branchId);
  if (!branch) return null;

  const branches = repos.branches.getAll();
  const salesReps = repos.salesReps.getAll();
  const targets = repos.targets.getAll();
  const deliveries = repos.deliveries.getAll();
  const leads = repos.leads.getAll();

  const allSummaries = calculateBranchPerformanceSummaries(
    branches,
    salesReps,
    targets,
    deliveries,
    leads,
    startDate,
    endDate
  );
  const summary = allSummaries.find(s => s.branch.id === branchId)!;

  const manager = repos.salesReps
    .getByBranchId(branchId)
    .find(r => r.role === 'branch_manager');

  const team = calculateRepPerformanceSummaries(
    salesReps,
    branches,
    leads,
    branchId
  );

  const funnel = calculateFunnelMetrics(
    leads,
    startDate,
    endDate,
    funnelMode,
    branchId
  );

  const delivery = calculateDeliveryAnalytics(
    deliveries,
    leads,
    branches,
    startDate,
    endDate,
    branchId
  );

  const insights = generateActionableInsights(
    branches,
    salesReps,
    targets,
    deliveries,
    leads,
    startDate,
    endDate,
    branchId
  ).filter(i => i.scopeId === branchId || i.scopeEntity === 'branch');

  const recentLeads = repos.leads
    .getByBranchId(branchId)
    .sort((a, b) => (b.days_inactive ?? 0) - (a.days_inactive ?? 0));

  return {
    branch,
    manager,
    summary,
    funnel,
    team,
    delivery,
    insights,
    recentLeads,
  };
}

