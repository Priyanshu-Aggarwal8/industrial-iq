/**
 * LAYER 1: DATA LAYER
 * Raw schemas and types representing the authoritative data structures
 * in dealership_data.json. Zero dependencies on React, UI, or charts.
 */

export type RawSalesRepRole = 'branch_manager' | 'sales_officer';

export type RawLeadStatus =
  | 'new'
  | 'contacted'
  | 'test_drive'
  | 'negotiation'
  | 'order_placed'
  | 'delivered'
  | 'lost';

export type RawLeadSource =
  | 'walk_in'
  | 'website'
  | 'referral'
  | 'phone_enquiry'
  | 'auto_expo'
  | 'social_media';

export interface RawBranch {
  id: string;
  name: string;
  city: string;
}

export interface RawSalesRep {
  id: string;
  name: string;
  branch_id: string;
  role: RawSalesRepRole;
  joined: string;
}

export interface RawStatusHistoryItem {
  status: RawLeadStatus;
  timestamp: string;
  note: string;
}

export interface RawLead {
  id: string;
  customer_name: string;
  phone: string;
  source: RawLeadSource;
  model_interested: string;
  status: RawLeadStatus;
  assigned_to: string;
  branch_id: string;
  created_at: string;
  last_activity_at: string;
  status_history: RawStatusHistoryItem[];
  expected_close_date: string;
  deal_value: number;
  lost_reason: string | null;
}

export interface RawTarget {
  branch_id: string;
  month: string; // YYYY-MM
  target_units: number;
  target_revenue: number;
}

export interface RawDelivery {
  lead_id: string;
  order_date: string; // YYYY-MM-DD
  delivery_date: string; // YYYY-MM-DD
  days_to_deliver: number;
  delay_reason: string | null;
}

export interface RawMetadata {
  generated_at: string;
  description: string;
  date_range: string;
  notes: string;
}

export interface RawDealershipData {
  metadata: RawMetadata;
  branches: RawBranch[];
  sales_reps: RawSalesRep[];
  leads: RawLead[];
  targets: RawTarget[];
  deliveries: RawDelivery[];
}

