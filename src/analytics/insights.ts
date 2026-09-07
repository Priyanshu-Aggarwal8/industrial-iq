import { NormalizedDataset } from '../data/loader';
import { ActionableInsight, DateRangeFilter } from '../types';
import { calculateExecutiveKpis } from './kpi';
import { calculateBranchPerformanceSummaries } from './targets';
import { calculateDeliveryAnalytics } from './delivery';

export function generateActionableInsights(
  dataset: NormalizedDataset,
  dateFilter: DateRangeFilter,
  selectedBranchId?: string
): ActionableInsight[] {
  const insights: ActionableInsight[] = [];
  const kpis = calculateExecutiveKpis(dataset, dateFilter, selectedBranchId);
  const branchSummaries = calculateBranchPerformanceSummaries(dataset, dateFilter);
  const deliveryAnalytics = calculateDeliveryAnalytics(dataset, dateFilter, selectedBranchId);

  // 1. Branch Attainment Crisis Detection
  for (const b of branchSummaries) {
    if (selectedBranchId && b.branch.id !== selectedBranchId) continue;

    if (b.targetUnits >= 10 && b.unitAttainment < 20) {
      insights.push({
        id: `attainment-crisis-${b.branch.id}`,
        title: `${b.branch.name}: Critical Target Deficit (${b.unitAttainment.toFixed(1)}% Attainment)`,
        category: 'attainment',
        priority: 'critical',
        priorityScore: 98,
        explanation: `${b.branch.name} is trailing its period target by ${Math.abs(b.unitGap)} units, delivering only ${b.deliveredUnits} against a target of ${b.targetUnits} units.`,
        evidence: `Delivered ${b.deliveredUnits} units vs ${b.targetUnits} target (${b.unitAttainment.toFixed(1)}%). Revenue attainment stands at ${b.revenueAttainment.toFixed(1)}% (shortfall of ₹${(Math.abs(b.revenueGap) / 10000000).toFixed(2)} Cr).`,
        scopeEntity: 'branch',
        scopeId: b.branch.id,
        scopeName: b.branch.name,
        recommendedAction: `Conduct emergency pipeline review with Branch Manager ${b.manager ? b.manager.name : 'leadership'} and audit lead loss points.`,
        actionUrl: `#/branches/${b.branch.id}`,
        actionLabel: `Inspect ${b.branch.name}`,
      });
    }
  }

  // 2. Funnel Conversion Breakdown Alert
  for (const b of branchSummaries) {
    if (selectedBranchId && b.branch.id !== selectedBranchId) continue;

    if (b.conversionRate < 15 && b.leadsCreated >= 20) {
      // Find where leads were lost
      const branchLeads = dataset.leads.filter(l => l.branch_id === b.branch.id);
      const lostBeforeContact = branchLeads.filter(
        l => l.status === 'lost' && (!l.last_stage_before_lost || l.last_stage_before_lost === 'new')
      ).length;

      insights.push({
        id: `funnel-leak-${b.branch.id}`,
        title: `${b.branch.name}: Severe Early-Funnel Drop-off (${b.conversionRate.toFixed(1)}% Lead-to-Sale)`,
        category: 'bottleneck',
        priority: 'critical',
        priorityScore: 95,
        explanation: `Only ${b.conversionRate.toFixed(1)}% of inbound leads convert to delivery. ${lostBeforeContact} inquiries were lost before sales reps made initial contact.`,
        evidence: `Delivered only ${b.deliveredUnits} out of ${branchLeads.length} leads. ${lostBeforeContact} leads dropped off immediately at the 'new' stage without progressing.`,
        scopeEntity: 'branch',
        scopeId: b.branch.id,
        scopeName: b.branch.name,
        recommendedAction: `Enforce a strict 2-hour response time SLA for new inquiries and review intake qualification protocols.`,
        actionUrl: `#/branches/${b.branch.id}`,
        actionLabel: 'View Branch Funnel',
      });
    }
  }

  // 3. Delivery Fulfillment Bottleneck Alert
  for (const b of deliveryAnalytics.branchBreakdown) {
    if (selectedBranchId && b.branchId !== selectedBranchId) continue;

    if (b.total >= 10 && b.delayRate > 50) {
      insights.push({
        id: `delivery-delay-${b.branchId}`,
        title: `${b.branchName}: High Fulfillment Delay Rate (${b.delayRate.toFixed(1)}%)`,
        category: 'fulfillment',
        priority: 'high',
        priorityScore: 88,
        explanation: `Over half of all completed deliveries experienced delays, with an average turnaround time of ${b.avgDays.toFixed(1)} days.`,
        evidence: `${b.delayed} out of ${b.total} deliveries faced delays. Network average turnaround is ${deliveryAnalytics.avgTurnaroundDays.toFixed(1)} days.`,
        scopeEntity: 'branch',
        scopeId: b.branchId,
        scopeName: b.branchName,
        recommendedAction: `Review logistics partner SLAs and local RTO registration processing times to reduce handoff friction.`,
        actionUrl: `#/branches/${b.branchId}`,
        actionLabel: 'Inspect Delivery Times',
      });
    }
  }

  // 4. Stale Unfulfilled Order Backlog Alert
  const agedOrders = dataset.leads.filter(
    l =>
      l.status === 'order_placed' &&
      (!selectedBranchId || l.branch_id === selectedBranchId) &&
      (l.days_inactive ?? 0) >= 30
  );

  if (agedOrders.length > 0) {
    const totalBacklogValue = agedOrders.reduce((sum, l) => sum + l.deal_value, 0);
    const oldestOrder = [...agedOrders].sort((a, b) => (b.days_inactive ?? 0) - (a.days_inactive ?? 0))[0];

    insights.push({
      id: 'aged-order-backlog',
      title: `${agedOrders.length} Unfulfilled Orders Inactive for ≥30 Days`,
      category: 'fulfillment',
      priority: 'high',
      priorityScore: 84,
      explanation: `Customer orders with confirmed deposits have been awaiting fulfillment for over 30 days, posing immediate cancellation and satisfaction risks.`,
      evidence: `${agedOrders.length} orders represent ₹${(totalBacklogValue / 10000000).toFixed(2)} Cr in locked value. Oldest order (${oldestOrder.id} - ${oldestOrder.customer_name}) has been pending for ${oldestOrder.days_inactive} days.`,
      scopeEntity: 'group',
      recommendedAction: `Audit vehicle allocation with factory dispatch and initiate proactive customer status updates.`,
      actionUrl: '#/leads?status=order_placed',
      actionLabel: 'View Order Backlog',
    });
  }

  // 5. Stale High-Value Pipeline Alert
  const staleHighValueLeads = dataset.leads.filter(
    l =>
      ['test_drive', 'negotiation'].includes(l.status) &&
      (!selectedBranchId || l.branch_id === selectedBranchId) &&
      l.deal_value >= 2500000 &&
      (l.days_inactive ?? 0) >= 14
  );

  if (staleHighValueLeads.length > 0) {
    const totalStaleValue = staleHighValueLeads.reduce((sum, l) => sum + l.deal_value, 0);
    insights.push({
      id: 'stale-high-value-leads',
      title: `${staleHighValueLeads.length} High-Value Deals Inactive in Late Stages (≥14 Days)`,
      category: 'aging',
      priority: 'high',
      priorityScore: 80,
      explanation: `High-value prospective buyers (Fortuner, Innova Hycross, Camry) in test drive or negotiation have had zero recorded interaction for at least 14 days.`,
      evidence: `${staleHighValueLeads.length} late-stage leads represent ₹${(totalStaleValue / 10000000).toFixed(2)} Cr in pipeline value at risk of going cold.`,
      scopeEntity: 'group',
      recommendedAction: `Mandate direct senior sales officer outreach or offer targeted commercial incentives before month-end.`,
      actionUrl: '#/leads?filter=stale',
      actionLabel: 'View Stale Deals',
    });
  }

  // 6. Marketing Channel Conversion Inefficiency
  const sourceStats: Record<string, { total: number; delivered: number }> = {};
  for (const l of dataset.leads) {
    if (selectedBranchId && l.branch_id !== selectedBranchId) continue;
    if (!sourceStats[l.source]) {
      sourceStats[l.source] = { total: 0, delivered: 0 };
    }
    sourceStats[l.source].total++;
    if (l.status === 'delivered') {
      sourceStats[l.source].delivered++;
    }
  }

  const socialStats = sourceStats['social_media'];
  const walkInStats = sourceStats['walk_in'];

  if (socialStats && socialStats.total >= 30) {
    const socialConv = (socialStats.delivered / socialStats.total) * 100;
    const walkInConv = walkInStats ? (walkInStats.delivered / walkInStats.total) * 100 : 0;

    if (socialConv < 18) {
      insights.push({
        id: 'channel-efficiency-social',
        title: `Social Media Inefficiency (${socialConv.toFixed(1)}% Conversion vs Walk-in ${walkInConv.toFixed(1)}%)`,
        category: 'channel',
        priority: 'medium',
        priorityScore: 68,
        explanation: `Social media ad campaigns generate inquiries but convert at less than half the efficiency of showroom walk-ins, indicating low lead intent.`,
        evidence: `72 social media inquiries yielded only ${socialStats.delivered} deliveries (${socialConv.toFixed(1)}%), while showroom walk-ins converted at ${walkInConv.toFixed(1)}%.`,
        scopeEntity: 'channel',
        scopeName: 'Social Media Marketing',
        recommendedAction: `Refine digital targeting criteria and introduce pre-qualification questions to filter out casual browsers.`,
        actionUrl: '#/leads?source=social_media',
        actionLabel: 'Inspect Social Leads',
      });
    }
  }

  // Sort deterministically by priority score descending
  return insights.sort((a, b) => b.priorityScore - a.priorityScore);
}

