import { NormalizedDataset } from '../data/loader';
import { Lead, RepPerformanceSummary } from '../types';
import { DATASET_REFERENCE_TIMESTAMP } from '../utils/dates';

export type LeadAgingCategory =
  | 'recent' // < 7 days
  | 'attention' // 7-13 days
  | 'stale' // >= 14 days
  | 'aged_backlog'; // order_placed >= 30 days

export function getLeadAgingCategory(lead: Lead): LeadAgingCategory {
  if (lead.status === 'delivered' || lead.status === 'lost') {
    return 'recent';
  }

  const days = lead.days_inactive ?? 0;
  if (lead.status === 'order_placed' && days >= 30) {
    return 'aged_backlog';
  }
  if (days >= 14) {
    return 'stale';
  }
  if (days >= 7) {
    return 'attention';
  }
  return 'recent';
}

export function calculateRepPerformanceSummaries(
  dataset: NormalizedDataset,
  selectedBranchId?: string
): RepPerformanceSummary[] {
  return dataset.salesReps
    .filter(r => r.role === 'sales_officer') // Evaluate quota-carrying reps
    .filter(r => !selectedBranchId || r.branch_id === selectedBranchId)
    .map(rep => {
      const branch = dataset.branchesById.get(rep.branch_id)!;
      const assignedLeads = dataset.leads.filter(l => l.assigned_to === rep.id);

      let deliveredUnits = 0;
      let deliveredRevenue = 0;
      let lostCount = 0;
      let activeLeadsCount = 0;
      let activePipelineValue = 0;
      let orderBacklogCount = 0;
      let staleLeadsCount = 0;
      let totalInactiveDays = 0;

      const activeStatuses = ['new', 'contacted', 'test_drive', 'negotiation'];

      for (const lead of assignedLeads) {
        if (lead.status === 'delivered') {
          deliveredUnits++;
          deliveredRevenue += lead.deal_value;
        } else if (lead.status === 'lost') {
          lostCount++;
        } else if (activeStatuses.includes(lead.status)) {
          activeLeadsCount++;
          activePipelineValue += lead.deal_value;
          const days = lead.days_inactive ?? 0;
          totalInactiveDays += days;
          if (days >= 7) {
            staleLeadsCount++;
          }
        } else if (lead.status === 'order_placed') {
          orderBacklogCount++;
          const days = lead.days_inactive ?? 0;
          totalInactiveDays += days;
          if (days >= 7) {
            staleLeadsCount++;
          }
        }
      }

      const conversionRate = assignedLeads.length > 0 ? (deliveredUnits / assignedLeads.length) * 100 : 0;
      const totalActive = activeLeadsCount + orderBacklogCount;
      const avgInactiveDays = totalActive > 0 ? totalInactiveDays / totalActive : 0;

      return {
        rep,
        branch,
        leadsAssigned: assignedLeads.length,
        deliveredUnits,
        deliveredRevenue,
        conversionRate,
        activeLeadsCount,
        activePipelineValue,
        orderBacklogCount,
        lostCount,
        avgInactiveDays,
        staleLeadsCount,
      };
    })
    .sort((a, b) => b.deliveredRevenue - a.deliveredRevenue);
}

