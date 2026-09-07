export type SalesRepRole = 'branch_manager' | 'sales_officer';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'test_drive'
  | 'negotiation'
  | 'order_placed'
  | 'delivered'
  | 'lost';

export type LeadSource =
  | 'walk_in'
  | 'website'
  | 'referral'
  | 'phone_enquiry'
  | 'auto_expo'
  | 'social_media';

export interface Branch {
  id: string;
  name: string;
  city: string;
}

export interface SalesRep {
  id: string;
  name: string;
  branch_id: string;
  role: SalesRepRole;
  joined: string;
}

export interface StatusHistoryItem {
  status: LeadStatus;
  timestamp: string;
  note: string;
}

export interface Lead {
  id: string;
  customer_name: string;
  phone: string;
  source: LeadSource;
  model_interested: string;
  status: LeadStatus;
  assigned_to: string;
  branch_id: string;
  created_at: string;
  last_activity_at: string;
  status_history: StatusHistoryItem[];
  expected_close_date: string;
  deal_value: number;
  lost_reason: string | null;
  // Normalized / derived attributes
  last_stage_before_lost?: LeadStatus;
  days_inactive?: number;
  has_unrecorded_loss_transition?: boolean;
}

export interface Target {
  branch_id: string;
  month: string; // YYYY-MM
  target_units: number;
  target_revenue: number;
}

export interface Delivery {
  lead_id: string;
  order_date: string; // YYYY-MM-DD
  delivery_date: string; // YYYY-MM-DD
  days_to_deliver: number;
  delay_reason: string | null;
}

export interface Metadata {
  generated_at: string;
  description: string;
  date_range: string;
  notes: string;
}

export interface RawDealershipData {
  metadata: Metadata;
  branches: Branch[];
  sales_reps: SalesRep[];
  leads: Lead[];
  targets: Target[];
  deliveries: Delivery[];
}

export interface DateRangeFilter {
  id: string;
  label: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isMonth?: boolean;
  monthKey?: string; // YYYY-MM
}

export interface ExecutiveKpis {
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

export interface FunnelStageMetric {
  stage: LeadStatus;
  label: string;
  count: number;
  dropCount: number;
  conversionFromPrev: number; // %
  conversionFromFirst: number; // %
}

export interface BranchPerformanceSummary {
  branch: Branch;
  manager?: SalesRep;
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

export interface RepPerformanceSummary {
  rep: SalesRep;
  branch: Branch;
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

export type InsightPriority = 'critical' | 'high' | 'medium' | 'info';
export type InsightCategory =
  | 'attainment'
  | 'bottleneck'
  | 'fulfillment'
  | 'aging'
  | 'coaching'
  | 'channel';

export interface ActionableInsight {
  id: string;
  title: string;
  category: InsightCategory;
  priority: InsightPriority;
  priorityScore: number; // 0-100 for deterministic sorting
  explanation: string;
  evidence: string;
  scopeEntity: 'branch' | 'representative' | 'lead' | 'channel' | 'group';
  scopeId?: string;
  scopeName?: string;
  recommendedAction: string;
  actionUrl?: string; // target view hash, e.g. '#/branches/B3'
  actionLabel?: string;
}

