/**
 * LAYER 4: APPLICATION LAYER - VIEW MODEL CONTRACTS
 * UI-friendly data representations prepared specifically for the Presentation Layer.
 * The Presentation Layer consumes these ViewModels without performing business calculations.
 */

import {
  DomainExecutiveKpis,
  DomainFunnelAnalysis,
  DomainBranchPerformance,
  DomainRepPerformance,
  DomainActionableInsight,
  DomainDeliveryAnalytics,
} from '../domain/models';
import { DomainMonthlyTargetPoint } from '../domain/targets';
import { NormalizedLead } from '../data/normalizer';
import { RawBranch, RawSalesRep, RawDelivery } from '../data/schemas';

export interface OverviewViewModel {
  kpis: DomainExecutiveKpis;
  hero: {
    deliveredRevenueFormatted: string;
    deliveredUnitsFormatted: string;
    unitAttainmentFormatted: string;
    revenueAttainmentFormatted: string;
    targetUnitsFormatted: string;
    targetRevenueFormatted: string;
    unitGapFormatted: string;
    revenueGapFormatted: string;
    activePipelineFormatted: string;
    activePipelineCount: number;
    orderBacklogFormatted: string;
    orderBacklogCount: number;
    winRateFormatted: string;
    deliveryTurnaroundFormatted: string;
    deliveryDelayRateFormatted: string;
    healthStatus: 'healthy' | 'warning' | 'critical';
  };
  monthlyTrends: DomainMonthlyTargetPoint[];
  funnel: DomainFunnelAnalysis;
  branchSummaries: DomainBranchPerformance[];
  prioritizedInsights: DomainActionableInsight[];
}

export interface BranchPerformanceViewModel {
  branch: RawBranch;
  manager?: RawSalesRep;
  summary: DomainBranchPerformance;
  funnel: DomainFunnelAnalysis;
  team: DomainRepPerformance[];
  delivery: DomainDeliveryAnalytics;
  insights: DomainActionableInsight[];
  recentLeads: NormalizedLead[];
}

export interface RepresentativePerformanceViewModel {
  rep: RawSalesRep;
  branch?: RawBranch;
  summary: DomainRepPerformance;
  assignedLeads: NormalizedLead[];
}

export interface LeadDetailsViewModel {
  lead: NormalizedLead;
  branch?: RawBranch;
  rep?: RawSalesRep;
  delivery?: RawDelivery;
  timeline: {
    status: string;
    timestampFormatted: string;
    note: string;
  }[];
}

export interface ActionCenterViewModel {
  insights: DomainActionableInsight[];
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  infoCount: number;
}

export type ActionableInsightsViewModel = ActionCenterViewModel;
