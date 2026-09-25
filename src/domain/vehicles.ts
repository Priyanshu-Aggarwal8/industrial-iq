/**
 * LAYER 3: DOMAIN - VEHICLE MODEL FLEET INTELLIGENCE
 * Pure mathematical calculations for vehicle model orders, deliveries,
 * revenue realization, and dealership drill-down breakdown.
 * Zero presentation, UI, or framework dependencies.
 */

import { NormalizedLead } from '../data/normalizer';
import { RawDelivery, RawBranch } from '../data/schemas';
import { isDateInRange } from '../infrastructure/dates';

export interface DomainBranchModelBreakdown {
  branchId: string;
  branchName: string;
  branchCity: string;
  orders: number;
  delivers: number;
  orderBacklog: number;
  deliveredRevenue: number;
  totalOrderValue: number;
  leadsCount: number;
}

export interface DomainVehicleModelPerformance {
  model: string;
  orders: number;
  delivers: number;
  orderBacklog: number;
  deliveredRevenue: number;
  totalOrderValue: number;
  revenueContributionPercent: number; // % of total delivered revenue
  volumeContributionPercent: number; // % of total delivered units
  leadsCount: number;
  conversionRate: number; // delivers / leadsCount * 100
  orderConversionRate: number; // orders / leadsCount * 100
  avgDealValue: number;
  branchBreakdown: DomainBranchModelBreakdown[];
}

export interface DomainVehicleFleetPerformance {
  models: DomainVehicleModelPerformance[];
  bestSellingByRevenue: DomainVehicleModelPerformance | null;
  bestSellingByVolume: DomainVehicleModelPerformance | null;
  totalDeliveredUnits: number;
  totalOrdersCount: number;
  totalOrderBacklog: number;
  totalDeliveredRevenue: number;
  totalOrderValue: number;
  totalLeadsCount: number;
  selectedBranch?: RawBranch;
}

export function calculateVehicleModelPerformance(
  leads: NormalizedLead[],
  deliveries: RawDelivery[],
  branches: RawBranch[],
  selectedBranchId?: string,
  startDate?: string,
  endDate?: string
): DomainVehicleFleetPerformance {
  const deliveriesByLeadId = new Map<string, RawDelivery>();
  for (const d of deliveries) {
    deliveriesByLeadId.set(d.lead_id, d);
  }

  const branchesById = new Map<string, RawBranch>();
  for (const b of branches) {
    branchesById.set(b.id, b);
  }

  // Filter leads by branch if selected
  const scopedLeads = selectedBranchId
    ? leads.filter(l => l.branch_id === selectedBranchId)
    : leads;

  // Extract all distinct models dynamically from data
  const distinctModels = Array.from(new Set(leads.map(l => l.model_interested))).sort();

  // Initialize accumulators per model
  interface ModelAccumulator {
    orders: number;
    delivers: number;
    orderBacklog: number;
    deliveredRevenue: number;
    totalOrderValue: number;
    leadsCount: number;
    dealValueSum: number;
    dealCount: number;
    branchMap: Map<string, DomainBranchModelBreakdown>;
  }

  const modelMap = new Map<string, ModelAccumulator>();

  for (const model of distinctModels) {
    const branchMap = new Map<string, DomainBranchModelBreakdown>();
    for (const b of branches) {
      branchMap.set(b.id, {
        branchId: b.id,
        branchName: b.name,
        branchCity: b.city,
        orders: 0,
        delivers: 0,
        orderBacklog: 0,
        deliveredRevenue: 0,
        totalOrderValue: 0,
        leadsCount: 0,
      });
    }

    modelMap.set(model, {
      orders: 0,
      delivers: 0,
      orderBacklog: 0,
      deliveredRevenue: 0,
      totalOrderValue: 0,
      leadsCount: 0,
      dealValueSum: 0,
      dealCount: 0,
      branchMap,
    });
  }

  // Process leads
  for (const lead of scopedLeads) {
    const acc = modelMap.get(lead.model_interested);
    if (!acc) continue;

    const branchEntry = acc.branchMap.get(lead.branch_id);

    // Track total lead interest
    // If date range provided, filter lead created_at
    const leadCreatedInRange =
      !startDate || !endDate || isDateInRange(lead.created_at, startDate, endDate);

    if (leadCreatedInRange) {
      acc.leadsCount++;
      if (branchEntry) branchEntry.leadsCount++;
    }

    if (lead.deal_value > 0) {
      acc.dealValueSum += lead.deal_value;
      acc.dealCount++;
    }

    // Check delivery status
    const delivery = deliveriesByLeadId.get(lead.id);
    let isDelivered = lead.status === 'delivered';
    let isDeliveredInRange = isDelivered;

    if (isDelivered && delivery && startDate && endDate) {
      isDeliveredInRange = isDateInRange(delivery.delivery_date, startDate, endDate);
    }

    if (isDeliveredInRange) {
      acc.delivers++;
      acc.deliveredRevenue += lead.deal_value;

      if (branchEntry) {
        branchEntry.delivers++;
        branchEntry.deliveredRevenue += lead.deal_value;
      }
    }

    // Check orders (order_placed or delivered)
    const hasOrderHistory =
      lead.status === 'order_placed' ||
      lead.status === 'delivered' ||
      lead.status_history.some(h => h.status === 'order_placed');

    if (hasOrderHistory) {
      // Determine order date for time-filtering
      let orderDate = '';
      if (delivery && delivery.order_date) {
        orderDate = delivery.order_date;
      } else {
        const orderHistoryItem = lead.status_history.find(h => h.status === 'order_placed');
        if (orderHistoryItem && orderHistoryItem.timestamp) {
          orderDate = orderHistoryItem.timestamp.slice(0, 10);
        } else {
          orderDate = lead.created_at.slice(0, 10);
        }
      }

      const isOrderInRange =
        !startDate || !endDate || isDateInRange(orderDate, startDate, endDate);

      if (isOrderInRange) {
        acc.orders++;
        acc.totalOrderValue += lead.deal_value;

        if (lead.status === 'order_placed') {
          acc.orderBacklog++;
        }

        if (branchEntry) {
          branchEntry.orders++;
          branchEntry.totalOrderValue += lead.deal_value;
          if (lead.status === 'order_placed') {
            branchEntry.orderBacklog++;
          }
        }
      }
    }
  }

  // Aggregate fleet totals
  let totalDeliveredRevenue = 0;
  let totalDeliveredUnits = 0;
  let totalOrdersCount = 0;
  let totalOrderBacklog = 0;
  let totalOrderValue = 0;
  let totalLeadsCount = 0;

  for (const acc of modelMap.values()) {
    totalDeliveredRevenue += acc.deliveredRevenue;
    totalDeliveredUnits += acc.delivers;
    totalOrdersCount += acc.orders;
    totalOrderBacklog += acc.orderBacklog;
    totalOrderValue += acc.totalOrderValue;
    totalLeadsCount += acc.leadsCount;
  }

  // Build model performance records
  const models: DomainVehicleModelPerformance[] = [];

  for (const [model, acc] of modelMap.entries()) {
    const revenueContributionPercent =
      totalDeliveredRevenue > 0 ? (acc.deliveredRevenue / totalDeliveredRevenue) * 100 : 0;
    const volumeContributionPercent =
      totalDeliveredUnits > 0 ? (acc.delivers / totalDeliveredUnits) * 100 : 0;
    const conversionRate = acc.leadsCount > 0 ? (acc.delivers / acc.leadsCount) * 100 : 0;
    const orderConversionRate = acc.leadsCount > 0 ? (acc.orders / acc.leadsCount) * 100 : 0;
    const avgDealValue = acc.dealCount > 0 ? acc.dealValueSum / acc.dealCount : 0;

    const branchBreakdown: DomainBranchModelBreakdown[] = Array.from(acc.branchMap.values()).sort(
      (a, b) => b.deliveredRevenue - a.deliveredRevenue
    );

    models.push({
      model,
      orders: acc.orders,
      delivers: acc.delivers,
      orderBacklog: acc.orderBacklog,
      deliveredRevenue: acc.deliveredRevenue,
      totalOrderValue: acc.totalOrderValue,
      revenueContributionPercent,
      volumeContributionPercent,
      leadsCount: acc.leadsCount,
      conversionRate,
      orderConversionRate,
      avgDealValue,
      branchBreakdown,
    });
  }

  // Sort models by delivered revenue descending by default
  models.sort((a, b) => b.deliveredRevenue - a.deliveredRevenue);

  // Identify Best Selling Model by Revenue
  const bestSellingByRevenue =
    models.length > 0
      ? [...models].sort((a, b) => b.deliveredRevenue - a.deliveredRevenue)[0]
      : null;

  // Identify Best Selling Model by Volume (Delivered units first, fallback to orders)
  const bestSellingByVolume =
    models.length > 0
      ? [...models].sort((a, b) => {
          if (b.delivers !== a.delivers) return b.delivers - a.delivers;
          return b.orders - a.orders;
        })[0]
      : null;

  const selectedBranch = selectedBranchId ? branchesById.get(selectedBranchId) : undefined;

  return {
    models,
    bestSellingByRevenue,
    bestSellingByVolume,
    totalDeliveredUnits,
    totalOrdersCount,
    totalOrderBacklog,
    totalDeliveredRevenue,
    totalOrderValue,
    totalLeadsCount,
    selectedBranch,
  };
}
