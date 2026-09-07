import rawDataJson from '../../dealership_data.json';
import {
  RawDealershipData,
  Lead,
  Branch,
  SalesRep,
  Target,
  Delivery,
  LeadStatus,
} from '../types';
import { DATASET_REFERENCE_TIMESTAMP } from '../utils/dates';

export interface NormalizedDataset {
  raw: RawDealershipData;
  branches: Branch[];
  branchesById: Map<string, Branch>;
  salesReps: SalesRep[];
  salesRepsById: Map<string, SalesRep>;
  leads: Lead[];
  leadsById: Map<string, Lead>;
  targets: Target[];
  deliveries: Delivery[];
  deliveriesByLeadId: Map<string, Delivery>;
  normalizationLog: {
    totalLeads: number;
    unrecordedLossLeadsCount: number;
    validatedBranchesCount: number;
    validatedRepsCount: number;
    validatedDeliveriesCount: number;
    validatedTargetsCount: number;
  };
}

let cachedDataset: NormalizedDataset | null = null;

export function loadAndNormalizeDataset(): NormalizedDataset {
  if (cachedDataset) {
    return cachedDataset;
  }

  const raw = rawDataJson as unknown as RawDealershipData;

  // 1. Validate & index Branches
  const branchesById = new Map<string, Branch>();
  for (const b of raw.branches) {
    if (!b.id || !b.name || !b.city) {
      throw new Error(`Malformed branch record: ${JSON.stringify(b)}`);
    }
    branchesById.set(b.id, b);
  }

  // 2. Validate & index Sales Reps
  const salesRepsById = new Map<string, SalesRep>();
  for (const r of raw.sales_reps) {
    if (!r.id || !r.name || !r.branch_id || !r.role) {
      throw new Error(`Malformed sales rep record: ${JSON.stringify(r)}`);
    }
    if (!branchesById.has(r.branch_id)) {
      throw new Error(`Sales rep ${r.id} belongs to unknown branch ${r.branch_id}`);
    }
    salesRepsById.set(r.id, r);
  }

  // 3. Validate & index Deliveries
  const deliveriesByLeadId = new Map<string, Delivery>();
  for (const d of raw.deliveries) {
    if (!d.lead_id || !d.order_date || !d.delivery_date || typeof d.days_to_deliver !== 'number') {
      throw new Error(`Malformed delivery record: ${JSON.stringify(d)}`);
    }
    deliveriesByLeadId.set(d.lead_id, d);
  }

  // 4. Validate & Normalize Leads
  const leadsById = new Map<string, Lead>();
  const normalizedLeads: Lead[] = [];
  let unrecordedLossCount = 0;
  const refDateMs = new Date(DATASET_REFERENCE_TIMESTAMP).getTime();

  for (const l of raw.leads) {
    if (!l.id || !l.customer_name || !l.created_at || !l.status) {
      throw new Error(`Malformed lead record: ${JSON.stringify(l)}`);
    }

    const lastActMs = new Date(l.last_activity_at).getTime();
    const daysInactive = Math.max(0, Math.floor((refDateMs - lastActMs) / (1000 * 60 * 60 * 24)));

    // Identify the last recorded stage in history
    const historyStages = l.status_history.map(h => h.status);
    const validProgressionStages: LeadStatus[] = [
      'new',
      'contacted',
      'test_drive',
      'negotiation',
      'order_placed',
      'delivered',
    ];
    
    // Find the furthest non-lost stage reached
    const reachedStages = validProgressionStages.filter(s => historyStages.includes(s));
    const furthestStage = reachedStages.length > 0 ? reachedStages[reachedStages.length - 1] : 'new';

    let hasUnrecordedLoss = false;
    let normalizedLostReason = l.lost_reason;

    // Check for the 14 late-December leads where status is 'lost' but status_history has no 'lost' entry
    if (l.status === 'lost') {
      const hasLostInHistory = historyStages.includes('lost');
      if (!hasLostInHistory) {
        hasUnrecordedLoss = true;
        unrecordedLossCount++;
        if (!normalizedLostReason) {
          normalizedLostReason = 'Unspecified / Late-Dec Loss';
        }
      }
    }

    const normalizedLead: Lead = {
      ...l,
      lost_reason: normalizedLostReason,
      last_stage_before_lost: l.status === 'lost' ? furthestStage : undefined,
      days_inactive: daysInactive,
      has_unrecorded_loss_transition: hasUnrecordedLoss,
    };

    leadsById.set(normalizedLead.id, normalizedLead);
    normalizedLeads.push(normalizedLead);
  }

  // 5. Validate Targets
  for (const t of raw.targets) {
    if (!t.branch_id || !t.month || typeof t.target_units !== 'number' || typeof t.target_revenue !== 'number') {
      throw new Error(`Malformed target record: ${JSON.stringify(t)}`);
    }
  }

  cachedDataset = {
    raw,
    branches: raw.branches,
    branchesById,
    salesReps: raw.sales_reps,
    salesRepsById,
    leads: normalizedLeads,
    leadsById,
    targets: raw.targets,
    deliveries: raw.deliveries,
    deliveriesByLeadId,
    normalizationLog: {
      totalLeads: normalizedLeads.length,
      unrecordedLossLeadsCount: unrecordedLossCount,
      validatedBranchesCount: raw.branches.length,
      validatedRepsCount: raw.sales_reps.length,
      validatedDeliveriesCount: raw.deliveries.length,
      validatedTargetsCount: raw.targets.length,
    },
  };

  return cachedDataset;
}

