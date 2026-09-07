/**
 * LAYER 4: APPLICATION LAYER - USE CASE: GET ACTIONABLE INSIGHTS VIEW MODEL
 */

import { DataRepositories } from '../../data-access/repositories';
import { ActionCenterViewModel } from '../view-models';
import { generateActionableInsights } from '../../domain/insights';

export function getActionableInsightsViewModel(
  repos: DataRepositories,
  startDate: string,
  endDate: string,
  selectedBranchId?: string
): ActionCenterViewModel {
  const branches = repos.branches.getAll();
  const salesReps = repos.salesReps.getAll();
  const targets = repos.targets.getAll();
  const deliveries = repos.deliveries.getAll();
  const leads = repos.leads.getAll();

  const insights = generateActionableInsights(
    branches,
    salesReps,
    targets,
    deliveries,
    leads,
    startDate,
    endDate,
    selectedBranchId
  );

  const criticalCount = insights.filter(i => i.priority === 'critical').length;
  const highCount = insights.filter(i => i.priority === 'high').length;
  const mediumCount = insights.filter(i => i.priority === 'medium').length;
  const infoCount = insights.filter(i => i.priority === 'info').length;

  return {
    insights,
    criticalCount,
    highCount,
    mediumCount,
    infoCount,
  };
}

