import { NormalizedDataset } from '../data/loader';
import { DateRangeFilter, ExecutiveKpis } from '../types';
import { isDateInRange, getMonthsCovered } from '../utils/dates';

export function calculateExecutiveKpis(
  dataset: NormalizedDataset,
  dateFilter: DateRangeFilter,
  selectedBranchId?: string
): ExecutiveKpis {
  const { startDate, endDate } = dateFilter;
  const targetMonths = getMonthsCovered(startDate, endDate);

  // 1. Calculate Targets
  let targetUnits = 0;
  let targetRevenue = 0;

  for (const t of dataset.targets) {
    if (targetMonths.includes(t.month)) {
      if (!selectedBranchId || t.branch_id === selectedBranchId) {
        targetUnits += t.target_units;
        targetRevenue += t.target_revenue;
      }
    }
  }

  // 2. Deliveries in Period
  let deliveredUnits = 0;
  let deliveredRevenue = 0;
  let totalDeliveryDays = 0;
  let delayedDeliveriesCount = 0;

  for (const d of dataset.deliveries) {
    const lead = dataset.leadsById.get(d.lead_id);
    if (!lead) continue;
    if (selectedBranchId && lead.branch_id !== selectedBranchId) continue;

    if (isDateInRange(d.delivery_date, startDate, endDate)) {
      deliveredUnits++;
      deliveredRevenue += lead.deal_value;
      totalDeliveryDays += d.days_to_deliver;
      if (d.delay_reason) {
        delayedDeliveriesCount++;
      }
    }
  }

  const avgDeliveryDays = deliveredUnits > 0 ? totalDeliveryDays / deliveredUnits : 0;
  const deliveryDelayRate = deliveredUnits > 0 ? (delayedDeliveriesCount / deliveredUnits) * 100 : 0;

  // 3. Leads Created in Period
  let totalLeadsCreated = 0;
  for (const l of dataset.leads) {
    if (selectedBranchId && l.branch_id !== selectedBranchId) continue;
    if (isDateInRange(l.created_at, startDate, endDate)) {
      totalLeadsCreated++;
    }
  }

  // 4. Current Pipeline & Backlog
  let pipelineActiveCount = 0;
  let pipelineActiveValue = 0;
  let orderBacklogCount = 0;
  let orderBacklogValue = 0;

  const activePipelineStatuses = ['new', 'contacted', 'test_drive', 'negotiation'];

  for (const l of dataset.leads) {
    if (selectedBranchId && l.branch_id !== selectedBranchId) continue;

    if (activePipelineStatuses.includes(l.status)) {
      pipelineActiveCount++;
      pipelineActiveValue += l.deal_value;
    } else if (l.status === 'order_placed') {
      orderBacklogCount++;
      orderBacklogValue += l.deal_value;
    }
  }

  const unitAttainment = targetUnits > 0 ? (deliveredUnits / targetUnits) * 100 : 0;
  const unitGap = deliveredUnits - targetUnits;

  const revenueAttainment = targetRevenue > 0 ? (deliveredRevenue / targetRevenue) * 100 : 0;
  const revenueGap = deliveredRevenue - targetRevenue;

  const overallConversionRate = totalLeadsCreated > 0 ? (deliveredUnits / totalLeadsCreated) * 100 : 0;

  return {
    deliveredUnits,
    targetUnits,
    unitAttainment,
    unitGap,
    deliveredRevenue,
    targetRevenue,
    revenueAttainment,
    revenueGap,
    pipelineActiveCount,
    pipelineActiveValue,
    orderBacklogCount,
    orderBacklogValue,
    totalLeadsCreated,
    overallConversionRate,
    avgDeliveryDays,
    deliveryDelayRate,
  };
}

