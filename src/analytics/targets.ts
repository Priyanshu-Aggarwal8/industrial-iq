import { NormalizedDataset } from '../data/loader';
import { DateRangeFilter, BranchPerformanceSummary, Branch } from '../types';
import { isDateInRange, getMonthsCovered } from '../utils/dates';

export interface MonthlyTargetPoint {
  month: string;
  targetUnits: number;
  actualUnits: number;
  targetRevenue: number;
  actualRevenue: number;
  unitAttainment: number;
  revenueAttainment: number;
}

export function calculateMonthlyTargetTrends(
  dataset: NormalizedDataset,
  selectedBranchId?: string
): MonthlyTargetPoint[] {
  const months = ['2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];

  return months.map(m => {
    let targetUnits = 0;
    let targetRevenue = 0;
    let actualUnits = 0;
    let actualRevenue = 0;

    // Targets
    for (const t of dataset.targets) {
      if (t.month === m) {
        if (!selectedBranchId || t.branch_id === selectedBranchId) {
          targetUnits += t.target_units;
          targetRevenue += t.target_revenue;
        }
      }
    }

    // Actual deliveries in month m
    for (const d of dataset.deliveries) {
      if (d.delivery_date.startsWith(m)) {
        const lead = dataset.leadsById.get(d.lead_id);
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
  dataset: NormalizedDataset,
  dateFilter: DateRangeFilter
): BranchPerformanceSummary[] {
  const { startDate, endDate } = dateFilter;
  const targetMonths = getMonthsCovered(startDate, endDate);

  return dataset.branches.map(branch => {
    // 1. Manager and Reps
    const branchReps = dataset.salesReps.filter(r => r.branch_id === branch.id);
    const manager = branchReps.find(r => r.role === 'branch_manager');
    const salesOfficers = branchReps.filter(r => r.role === 'sales_officer');

    // 2. Targets for period
    let targetUnits = 0;
    let targetRevenue = 0;
    for (const t of dataset.targets) {
      if (t.branch_id === branch.id && targetMonths.includes(t.month)) {
        targetUnits += t.target_units;
        targetRevenue += t.target_revenue;
      }
    }

    // 3. Deliveries & actuals for period
    let deliveredUnits = 0;
    let deliveredRevenue = 0;
    let totalDeliveryDays = 0;
    let delayedDeliveriesCount = 0;

    for (const d of dataset.deliveries) {
      const lead = dataset.leadsById.get(d.lead_id);
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

    // 4. Leads created in period
    let leadsCreated = 0;
    let lostCount = 0;
    let activePipelineCount = 0;
    let activePipelineValue = 0;
    let orderBacklogCount = 0;

    const activePipelineStatuses = ['new', 'contacted', 'test_drive', 'negotiation'];

    for (const l of dataset.leads) {
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

