/**
 * LAYER 3: DOMAIN - DELIVERY ANALYTICS
 * Turnaround speed, fulfillment delay Pareto breakdown, and branch SLAs.
 */

import { NormalizedLead } from '../data/normalizer';
import { RawBranch, RawDelivery } from '../data/schemas';
import { DomainDeliveryAnalytics } from './models';
import { isDateInRange } from '../infrastructure/dates';

export function calculateDeliveryAnalytics(
  deliveries: RawDelivery[],
  leads: NormalizedLead[],
  branches: RawBranch[],
  startDate: string,
  endDate: string,
  selectedBranchId?: string
): DomainDeliveryAnalytics {
  const leadsById = new Map(leads.map(l => [l.id, l]));

  const inScopeDeliveries = deliveries.filter(d => {
    const lead = leadsById.get(d.lead_id);
    if (!lead) return false;
    if (selectedBranchId && lead.branch_id !== selectedBranchId) return false;
    return isDateInRange(d.delivery_date, startDate, endDate);
  });

  const totalDeliveries = inScopeDeliveries.length;
  if (totalDeliveries === 0) {
    return {
      totalDeliveries: 0,
      onTimeCount: 0,
      delayedCount: 0,
      onTimeRate: 0,
      delayRate: 0,
      avgTurnaroundDays: 0,
      minTurnaroundDays: 0,
      maxTurnaroundDays: 0,
      delayReasonsBreakdown: [],
      branchBreakdown: [],
    };
  }

  let onTimeCount = 0;
  let delayedCount = 0;
  let totalDays = 0;
  let minDays = Infinity;
  let maxDays = -Infinity;
  const reasonCounts: Record<string, number> = {};

  const branchMap: Record<
    string,
    { total: number; delayed: number; totalDays: number }
  > = {};

  for (const b of branches) {
    branchMap[b.id] = { total: 0, delayed: 0, totalDays: 0 };
  }

  for (const d of inScopeDeliveries) {
    const lead = leadsById.get(d.lead_id)!;
    const bId = lead.branch_id;

    totalDays += d.days_to_deliver;
    if (d.days_to_deliver < minDays) minDays = d.days_to_deliver;
    if (d.days_to_deliver > maxDays) maxDays = d.days_to_deliver;

    branchMap[bId].total++;
    branchMap[bId].totalDays += d.days_to_deliver;

    if (d.delay_reason) {
      delayedCount++;
      branchMap[bId].delayed++;
      reasonCounts[d.delay_reason] = (reasonCounts[d.delay_reason] || 0) + 1;
    } else {
      onTimeCount++;
    }
  }

  const avgTurnaroundDays = totalDeliveries > 0 ? totalDays / totalDeliveries : 0;
  const onTimeRate = (onTimeCount / totalDeliveries) * 100;
  const delayRate = (delayedCount / totalDeliveries) * 100;

  const delayReasonsBreakdown = Object.entries(reasonCounts)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: delayedCount > 0 ? (count / delayedCount) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const branchBreakdown = branches.map(b => {
    const stats = branchMap[b.id];
    return {
      branchId: b.id,
      branchName: b.name,
      city: b.city,
      total: stats.total,
      delayed: stats.delayed,
      delayRate: stats.total > 0 ? (stats.delayed / stats.total) * 100 : 0,
      avgDays: stats.total > 0 ? stats.totalDays / stats.total : 0,
    };
  });

  return {
    totalDeliveries,
    onTimeCount,
    delayedCount,
    onTimeRate,
    delayRate,
    avgTurnaroundDays,
    minTurnaroundDays: minDays === Infinity ? 0 : minDays,
    maxTurnaroundDays: maxDays === -Infinity ? 0 : maxDays,
    delayReasonsBreakdown,
    branchBreakdown,
  };
}

