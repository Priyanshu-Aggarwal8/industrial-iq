/**
 * LAYER 3: DOMAIN - CONVERSION FUNNEL CALCULATIONS
 * Reconstructs stage progression from lead histories.
 * Pure mathematical logic: NO UI or chart dependencies.
 */

import { NormalizedLead } from '../data/normalizer';
import { RawLeadStatus } from '../data/schemas';
import { DomainFunnelAnalysis, DomainFunnelStageMetric } from './models';
import { isDateInRange } from '../infrastructure/dates';

export const ORDERED_FUNNEL_STAGES: { stage: RawLeadStatus; label: string }[] = [
  { stage: 'new', label: 'New Lead' },
  { stage: 'contacted', label: 'Contacted' },
  { stage: 'test_drive', label: 'Test Drive' },
  { stage: 'negotiation', label: 'Negotiation' },
  { stage: 'order_placed', label: 'Order Placed' },
  { stage: 'delivered', label: 'Delivered' },
];

export function calculateFunnelMetrics(
  leads: NormalizedLead[],
  startDate: string,
  endDate: string,
  mode: 'cohort' | 'event' = 'cohort',
  selectedBranchId?: string
): DomainFunnelAnalysis {
  const stageCounts: Record<RawLeadStatus, number> = {
    new: 0,
    contacted: 0,
    test_drive: 0,
    negotiation: 0,
    order_placed: 0,
    delivered: 0,
    lost: 0,
  };

  const lostReasonsCount: Record<string, number> = {};
  let totalLost = 0;

  if (mode === 'cohort') {
    // Cohort Funnel: Leads created in period
    const inScopeLeads = leads.filter(l => {
      if (selectedBranchId && l.branch_id !== selectedBranchId) return false;
      return isDateInRange(l.created_at, startDate, endDate);
    });

    for (const lead of inScopeLeads) {
      const historyStages = new Set(lead.status_history.map(h => h.status));
      for (const { stage } of ORDERED_FUNNEL_STAGES) {
        if (historyStages.has(stage)) {
          stageCounts[stage]++;
        }
      }

      if (lead.status === 'lost') {
        const reason = lead.lost_reason || 'Unspecified / Late-Dec Loss';
        lostReasonsCount[reason] = (lostReasonsCount[reason] || 0) + 1;
        totalLost++;
      }
    }
  } else {
    // Event Velocity Funnel: Transitions that took place in period
    const seenLeadsPerStage: Record<RawLeadStatus, Set<string>> = {
      new: new Set(),
      contacted: new Set(),
      test_drive: new Set(),
      negotiation: new Set(),
      order_placed: new Set(),
      delivered: new Set(),
      lost: new Set(),
    };

    for (const lead of leads) {
      if (selectedBranchId && lead.branch_id !== selectedBranchId) continue;

      for (const item of lead.status_history) {
        if (isDateInRange(item.timestamp, startDate, endDate)) {
          if (seenLeadsPerStage[item.status]) {
            seenLeadsPerStage[item.status].add(lead.id);
          }
        }
      }
    }

    for (const { stage } of ORDERED_FUNNEL_STAGES) {
      stageCounts[stage] = seenLeadsPerStage[stage].size;
    }

    for (const lead of leads) {
      if (selectedBranchId && lead.branch_id !== selectedBranchId) continue;
      for (const item of lead.status_history) {
        if (item.status === 'lost' && isDateInRange(item.timestamp, startDate, endDate)) {
          const reason = lead.lost_reason || 'Unspecified / Late-Dec Loss';
          lostReasonsCount[reason] = (lostReasonsCount[reason] || 0) + 1;
          totalLost++;
        }
      }
    }
  }

  // Calculate funnel progression and drops
  const firstStageCount = stageCounts[ORDERED_FUNNEL_STAGES[0].stage] || 1;
  const stages: DomainFunnelStageMetric[] = [];
  const stageDropoffs: DomainFunnelAnalysis['stageDropoffs'] = [];

  for (let i = 0; i < ORDERED_FUNNEL_STAGES.length; i++) {
    const { stage, label } = ORDERED_FUNNEL_STAGES[i];
    const count = stageCounts[stage];
    const prevCount = i === 0 ? count : stageCounts[ORDERED_FUNNEL_STAGES[i - 1].stage];
    const dropCount = Math.max(0, prevCount - count);
    const conversionFromPrev = prevCount > 0 ? (count / prevCount) * 100 : 0;
    const conversionFromFirst = (count / firstStageCount) * 100;

    stages.push({
      stage,
      label,
      count,
      dropCount: i === 0 ? 0 : dropCount,
      conversionFromPrev: i === 0 ? 100 : conversionFromPrev,
      conversionFromFirst,
    });

    if (i > 0) {
      const prevLabel = ORDERED_FUNNEL_STAGES[i - 1].label;
      const dropRate = prevCount > 0 ? (dropCount / prevCount) * 100 : 0;
      stageDropoffs.push({
        fromStage: prevLabel,
        toStage: label,
        lostCount: dropCount,
        dropRate,
      });
    }
  }

  const lostReasonsBreakdown = Object.entries(lostReasonsCount)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: totalLost > 0 ? (count / totalLost) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const topStageCount = stageCounts['new'];
  const deliveredCount = stageCounts['delivered'];
  const overallConversionRate = topStageCount > 0 ? (deliveredCount / topStageCount) * 100 : 0;

  return {
    mode,
    stages,
    totalLeadsInScope: topStageCount,
    overallConversionRate,
    stageDropoffs,
    lostReasonsBreakdown,
  };
}

