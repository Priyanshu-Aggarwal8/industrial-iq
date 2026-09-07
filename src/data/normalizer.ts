/**
 * LAYER 1: DATA LAYER - NORMALIZER & VALIDATOR
 * Normalizes, validates, and indexes dealership_data.json.
 * Pure logic: NO React, NO DOM, NO UI dependencies.
 */

import rawDataJson from '../../dealership_data.json';
import {
  RawDealershipData,
  RawBranch,
  RawSalesRep,
  RawLead,
  RawTarget,
  RawDelivery,
  RawLeadStatus,
} from './schemas';

export interface NormalizedLead extends RawLead {
  days_inactive: number;
  last_stage_before_lost?: RawLeadStatus;
  has_unrecorded_loss_transition: boolean;
}

export interface NormalizedDataset {
  branches: RawBranch[];
  salesReps: RawSalesRep[];
  leads: NormalizedLead[];
  targets: RawTarget[];
  deliveries: RawDelivery[];
  branchesById: Map<string, RawBranch>;
  salesRepsById: Map<string, RawSalesRep>;
  leadsById: Map<string, NormalizedLead>;
  deliveriesByLeadId: Map<string, RawDelivery>;
  targetsByBranchMonth: Map<string, RawTarget>;
}

export const DATASET_REFERENCE_TIMESTAMP = '2025-12-31T23:59:59Z';

let cachedDataset: NormalizedDataset | null = null;

export function loadAndNormalizeDataset(): NormalizedDataset {
  if (cachedDataset) {
    return cachedDataset;
  }

  const raw = rawDataJson as unknown as RawDealershipData;

  // 1. Validate & Index Branches
  const branchesById = new Map<string, RawBranch>();
  for (const b of raw.branches) {
    if (!b.id || !b.name || !b.city) {
      throw new Error(`Invalid branch record in dataset: ${JSON.stringify(b)}`);
    }
    branchesById.set(b.id, b);
  }

  // 2. Validate & Index Sales Reps
  const salesRepsById = new Map<string, RawSalesRep>();
  for (const r of raw.sales_reps) {
    if (!r.id || !r.name || !r.branch_id || !r.role) {
      throw new Error(`Invalid sales rep record in dataset: ${JSON.stringify(r)}`);
    }
    if (!branchesById.has(r.branch_id)) {
      throw new Error(`Sales rep ${r.id} belongs to missing branch ${r.branch_id}`);
    }
    salesRepsById.set(r.id, r);
  }

  // 3. Validate & Index Deliveries
  const deliveriesByLeadId = new Map<string, RawDelivery>();
  for (const d of raw.deliveries) {
    if (!d.lead_id || !d.order_date || !d.delivery_date || typeof d.days_to_deliver !== 'number') {
      throw new Error(`Invalid delivery record in dataset: ${JSON.stringify(d)}`);
    }
    deliveriesByLeadId.set(d.lead_id, d);
  }

  // 4. Validate & Normalize Leads
  const leadsById = new Map<string, NormalizedLead>();
  const normalizedLeads: NormalizedLead[] = [];
  const refDateMs = new Date(DATASET_REFERENCE_TIMESTAMP).getTime();

  const validProgressionStages: RawLeadStatus[] = [
    'new',
    'contacted',
    'test_drive',
    'negotiation',
    'order_placed',
    'delivered',
  ];

  for (const l of raw.leads) {
    if (!l.id || !l.customer_name || !l.status || !l.created_at) {
      throw new Error(`Invalid lead record in dataset: ${JSON.stringify(l)}`);
    }

    const lastActMs = new Date(l.last_activity_at).getTime();
    const daysInactive = Math.max(0, Math.floor((refDateMs - lastActMs) / (1000 * 60 * 60 * 24)));

    const historyStages = l.status_history.map(h => h.status);
    const reachedStages = validProgressionStages.filter(s => historyStages.includes(s));
    const furthestStage = reachedStages.length > 0 ? reachedStages[reachedStages.length - 1] : 'new';

    let hasUnrecordedLoss = false;
    let normalizedLostReason = l.lost_reason;

    // Normalizing the 14 late-December leads where status is 'lost' but status_history has no 'lost' record
    if (l.status === 'lost') {
      const hasLostInHistory = historyStages.includes('lost');
      if (!hasLostInHistory) {
        hasUnrecordedLoss = true;
        if (!normalizedLostReason) {
          normalizedLostReason = 'Unspecified / Late-Dec Loss';
        }
      }
    }

    const normalizedLead: NormalizedLead = {
      ...l,
      lost_reason: normalizedLostReason,
      last_stage_before_lost: l.status === 'lost' ? furthestStage : undefined,
      days_inactive: daysInactive,
      has_unrecorded_loss_transition: hasUnrecordedLoss,
    };

    leadsById.set(normalizedLead.id, normalizedLead);
    normalizedLeads.push(normalizedLead);
  }

  // 5. Validate & Index Targets
  const targetsByBranchMonth = new Map<string, RawTarget>();
  for (const t of raw.targets) {
    if (!t.branch_id || !t.month || typeof t.target_units !== 'number' || typeof t.target_revenue !== 'number') {
      throw new Error(`Invalid target record in dataset: ${JSON.stringify(t)}`);
    }
    targetsByBranchMonth.set(`${t.branch_id}_${t.month}`, t);
  }

  cachedDataset = {
    branches: raw.branches,
    salesReps: raw.sales_reps,
    leads: normalizedLeads,
    targets: raw.targets,
    deliveries: raw.deliveries,
    branchesById,
    salesRepsById,
    leadsById,
    deliveriesByLeadId,
    targetsByBranchMonth,
  };

  return cachedDataset;
}

