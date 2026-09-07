/**
 * LAYER 3: DOMAIN - TARGET & BRANCH PERFORMANCE CALCULATIONS
 * Pure mathematical aggregations for monthly targets and branch scorecards.
 */

import { NormalizedLead } from '../data/normalizer';
import { RawBranch, RawSalesRep, RawTarget, RawDelivery } from '../data/schemas';
import { DomainBranchPerformance } from './models';
import { isDateInRange, getMonthsCovered } from '../infrastructure/dates';

export interface DomainMonthlyTargetPoint {
  month: string;
  targetUnits: number;
  actualUnits: number;
  targetRevenue: number;
  actualRevenue: number;
  unitAttainment: number;
  revenueAttainment: number;
}

export function calculateMonthlyTargetTrends(
  targets: RawTarget[],
  deliveries: RawDelivery[],
  leads: NormalizedLead[],
  selectedBranchId?: string
): DomainMonthlyTargetPoint[] {
  const months = ['2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];
  const leadsById = new Map(leads.map(l => [l.id, l]));

  return months.map(m => {
    let targetUnits = 0;
    let targetRevenue = 0;
    let actualUnits = 0;
    let actualRevenue = 0;

    // Sum quotas for month
    for (const t of targets) {
      if (t.month === m) {
        if (!selectedBranchId || t.branch_id === selectedBranchId) {
          targetUnits += t.target_units;
          targetRevenue += t.target_revenue;
        }
      }
    }

    // Sum deliveries in month
    for (const d of deliveries) {
      if (d.delivery_date.startsWith(m)) {
        const lead = leadsById.get(d.lead_id);
        if (!lead) continue;
        if (!selectedBranchId || lead.branch_id === selectedBranchId) {
          actualUnits++;
          actualRevenue += lead.deal_value;
        }
      }
    }

    const unitAttainment = targetUnits > 0 ? (actualUnits / targetUnits) * 100 : 0;
    const revenueAttainment = targetRevenue > 0 ? (actualRevenue / targetRevenue) * 100 : 0;

    return {
      month: m,
      targetUnits,
      actualUnits,
      targetRevenue,
      actualRevenue,
      unitAttainment,
      revenueAttainment,
    };
  });
}

export function calculateBranchPerformanceSummaries(
  branches: RawBranch[],
  salesReps: RawSalesRep[],
  targets: RawTarget[],
  deliveries: RawDelivery[],
  leads: NormalizedLead[],
  startDate: string,
  endDate: string
): DomainBranchPerformance[] {
  const targetMonths = getMonthsCovered(startDate, endDate);
  const leadsById = new Map(leads.map(l => [l.id, l]));

  return branches.map(branch => {
    const branchReps = salesReps.filter(r => r.branch_id === branch.id);
    const manager = branchReps.find(r => r.role === 'branch_manager');
    const salesOfficers = branchReps.filter(r => r.role === 'sales_officer');

    // Targets for period
    let targetUnits = 0;
    let targetRevenue = 0;
    for (const t of targets) {
      if (t.branch_id === branch.id && targetMonths.includes(t.month)) {
        targetUnits += t.target_units;
        targetRevenue += t.target_revenue;
      }
    }

    // Deliveries for period
    let deliveredUnits = 0;
    let deliveredRevenue = 0;
    let totalDeliveryDays = 0;
    let delayedDeliveriesCount = 0;

    for (const d of deliveries) {
      const lead = leadsById.get(d.lead_id);
      if (!lead || lead.branch_id !== branch.id) continue;

      if (isDateInRange(d.delivery_date, startDate, endDate)) {
        deliveredUnits++;
        deliveredRevenue += lead.deal_value;
        totalDeliveryDays += d.days_to_deliver;
        if (d.delay_reason) {
          delayedDeliveriesCount++;
        }
      }
    }

    // Leads & pipeline for period
    let leadsCreated = 0;
    let lostCount = 0;
    let activePipelineCount = 0;
    let activePipelineValue = 0;
    let orderBacklogCount = 0;

    const activePipelineStatuses = ['new', 'contacted', 'test_drive', 'negotiation'];

    for (const l of leads) {
      if (l.branch_id !== branch.id) continue;

      if (isDateInRange(l.created_at, startDate, endDate)) {
        leadsCreated++;
      }

      if (l.status === 'lost') {
        lostCount++;
      } else if (activePipelineStatuses.includes(l.status)) {
        activePipelineCount++;
        activePipelineValue += l.deal_value;
      } else if (l.status === 'order_placed') {
        orderBacklogCount++;
      }
    }

    const unitAttainment = targetUnits > 0 ? (deliveredUnits / targetUnits) * 100 : 0;
    const unitGap = deliveredUnits - targetUnits;
    const revenueAttainment = targetRevenue > 0 ? (deliveredRevenue / targetRevenue) * 100 : 0;
    const revenueGap = deliveredRevenue - targetRevenue;
    const conversionRate = leadsCreated > 0 ? (deliveredUnits / leadsCreated) * 100 : 0;
    const avgDeliveryDays = deliveredUnits > 0 ? totalDeliveryDays / deliveredUnits : 0;
    const delayRate = deliveredUnits > 0 ? (delayedDeliveriesCount / deliveredUnits) * 100 : 0;

    return {
      branch,
      manager,
      repCount: salesOfficers.length,
      leadsCreated,
      deliveredUnits,
      targetUnits,
      unitAttainment,
      unitGap,
      deliveredRevenue,
      targetRevenue,
      revenueAttainment,
      revenueGap,
      activePipelineCount,
      activePipelineValue,
      orderBacklogCount,
      conversionRate,
      avgDeliveryDays,
      delayedDeliveriesCount,
      delayRate,
      lostCount,
    };
  });
}

