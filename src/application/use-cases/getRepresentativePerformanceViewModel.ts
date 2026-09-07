/**
 * LAYER 4: APPLICATION LAYER - USE CASE: GET REPRESENTATIVE PERFORMANCE VIEW MODEL
 */

import { DataRepositories } from '../../data-access/repositories';
import { RepresentativePerformanceViewModel } from '../view-models';
import { calculateRepPerformanceSummaries } from '../../domain/aging';

export function getRepresentativePerformanceViewModel(
  repos: DataRepositories,
  repId: string
): RepresentativePerformanceViewModel | null {
  const rep = repos.salesReps.getById(repId);
  if (!rep) return null;

  const branch = repos.branches.getById(rep.branch_id);
  const salesReps = repos.salesReps.getAll();
  const branches = repos.branches.getAll();
  const leads = repos.leads.getAll();

  const allSummaries = calculateRepPerformanceSummaries(salesReps, branches, leads);
  const summary = allSummaries.find(s => s.rep.id === repId);

  const assignedLeads = repos.leads
    .getByRepId(repId)
    .sort((a, b) => (b.days_inactive ?? 0) - (a.days_inactive ?? 0));

  if (!summary) {
    // If branch manager or unranked rep
    return {
      rep,
      branch,
      summary: {
        rep,
        branch: branch!,
        leadsAssigned: assignedLeads.length,
        deliveredUnits: 0,
        deliveredRevenue: 0,
        conversionRate: 0,
        activeLeadsCount: 0,
        activePipelineValue: 0,
        orderBacklogCount: 0,
        lostCount: 0,
        avgInactiveDays: 0,
        staleLeadsCount: 0,
      },
      assignedLeads,
    };
  }

  return {
    rep,
    branch,
    summary,
    assignedLeads,
  };
}

