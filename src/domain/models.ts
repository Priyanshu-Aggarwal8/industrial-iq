/**
 * LAYER 3: DOMAIN / ANALYTICS LAYER - MODELS
 * Domain entities and analytical contracts.
 * ZERO dependencies on React, UI, or chart libraries.
 */

import { RawBranch, RawSalesRep, RawLeadStatus } from '../data/schemas';
import { NormalizedLead } from '../data/normalizer';

export interface DomainExecutiveKpis {
  deliveredUnits: number;
  targetUnits: number;
  unitAttainment: number; // percentage (0-100+)
  unitGap: number; // delivered - target
  
  deliveredRevenue: number;
  targetRevenue: number;
  revenueAttainment: number; // percentage (0-100+)
  revenueGap: number; // delivered - target
  
  pipelineActiveCount: number;
  pipelineActiveValue: number;
  
  orderBacklogCount: number;
  orderBacklogValue: number;
  
  totalLeadsCreated: number;
  overallConversionRate: number; // delivered / total
  
  avgDeliveryDays: number;
  deliveryDelayRate: number; // percentage delayed
}

export interface DomainFunnelStageMetric {
  stage: RawLeadStatus;
  label: string;
  count: number;
  dropCount: number;
  conversionFromPrev: number; // %
  conversionFromFirst: number; // %
}

export interface DomainFunnelAnalysis {
  mode: 'cohort' | 'event';
  stages: DomainFunnelStageMetric[];
  totalLeadsInScope: number;
  overallConversionRate: number;
  stageDropoffs: {
    fromStage: string;
    toStage: string;
    lostCount: number;
    dropRate: number;
  }[];
  lostReasonsBreakdown: { reason: string; count: number; percentage: number }[];
}

export interface DomainBranchPerformance {
  branch: RawBranch;
  manager?: RawSalesRep;
  repCount: number;
  leadsCreated: number;
  deliveredUnits: number;
  targetUnits: number;
  unitAttainment: number;
  unitGap: number;
  
  deliveredRevenue: number;
  targetRevenue: number;
  revenueAttainment: number;
  revenueGap: number;
  
  activePipelineCount: number;
  activePipelineValue: number;
  orderBacklogCount: number;
  
  conversionRate: number;
  avgDeliveryDays: number;
  delayedDeliveriesCount: number;
  delayRate: number;
  lostCount: number;
}

export interface DomainRepPerformance {
  rep: RawSalesRep;
  branch: RawBranch;
  leadsAssigned: number;
  deliveredUnits: number;
  deliveredRevenue: number;
  conversionRate: number;
  activeLeadsCount: number;
  activePipelineValue: number;
  orderBacklogCount: number;
  lostCount: number;
  avgInactiveDays: number;
  staleLeadsCount: number; // >= 7 days
}

export type DomainInsightPriority = 'critical' | 'high' | 'medium' | 'info';
export type DomainInsightCategory =
  | 'attainment'
  | 'bottleneck'
  | 'fulfillment'
  | 'aging'
  | 'coaching'
  | 'channel';

export interface DomainActionableInsight {
  id: string;
  title: string;
  category: DomainInsightCategory;
  priority: DomainInsightPriority;
  priorityScore: number; // 0-100 for deterministic ranking
  explanation: string;
  evidence: string;
  scopeEntity: 'branch' | 'representative' | 'lead' | 'channel' | 'group';
  scopeId?: string;
  scopeName?: string;
  recommendedAction: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface DomainDeliveryAnalytics {
  totalDeliveries: number;
  onTimeCount: number;
  delayedCount: number;
  onTimeRate: number;
  delayRate: number;
  avgTurnaroundDays: number;
  minTurnaroundDays: number;
  maxTurnaroundDays: number;
  delayReasonsBreakdown: {
    reason: string;
    count: number;
    percentage: number;
  }[];
  branchBreakdown: {
    branchId: string;
    branchName: string;
    city: string;
    total: number;
    delayed: number;
    delayRate: number;
    avgDays: number;
  }[];
}

