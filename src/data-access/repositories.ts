/**
 * LAYER 2: DATA ACCESS LAYER - IMPLEMENTATIONS
 * Implements repository contracts backed by normalized data.
 * Zero UI/presentation dependencies.
 */

import {
  IBranchRepository,
  IRepresentativeRepository,
  ILeadRepository,
  ITargetRepository,
  IDeliveryRepository,
} from './interfaces';
import {
  NormalizedDataset,
  loadAndNormalizeDataset,
  NormalizedLead,
} from '../data/normalizer';
import {
  RawBranch,
  RawSalesRep,
  RawTarget,
  RawDelivery,
} from '../data/schemas';

export class BranchRepository implements IBranchRepository {
  constructor(private dataset: NormalizedDataset) {}

  getAll(): RawBranch[] {
    return this.dataset.branches;
  }

  getById(id: string): RawBranch | undefined {
    return this.dataset.branchesById.get(id);
  }
}

export class RepresentativeRepository implements IRepresentativeRepository {
  constructor(private dataset: NormalizedDataset) {}

  getAll(): RawSalesRep[] {
    return this.dataset.salesReps;
  }

  getById(id: string): RawSalesRep | undefined {
    return this.dataset.salesRepsById.get(id);
  }

  getByBranchId(branchId: string): RawSalesRep[] {
    return this.dataset.salesReps.filter(r => r.branch_id === branchId);
  }
}

export class LeadRepository implements ILeadRepository {
  constructor(private dataset: NormalizedDataset) {}

  getAll(): NormalizedLead[] {
    return this.dataset.leads;
  }

  getById(id: string): NormalizedLead | undefined {
    return this.dataset.leadsById.get(id);
  }

  getByBranchId(branchId: string): NormalizedLead[] {
    return this.dataset.leads.filter(l => l.branch_id === branchId);
  }

  getByRepId(repId: string): NormalizedLead[] {
    return this.dataset.leads.filter(l => l.assigned_to === repId);
  }
}

export class TargetRepository implements ITargetRepository {
  constructor(private dataset: NormalizedDataset) {}

  getAll(): RawTarget[] {
    return this.dataset.targets;
  }

  getByBranchId(branchId: string): RawTarget[] {
    return this.dataset.targets.filter(t => t.branch_id === branchId);
  }

  getByMonth(month: string): RawTarget[] {
    return this.dataset.targets.filter(t => t.month === month);
  }

  getByBranchAndMonth(branchId: string, month: string): RawTarget | undefined {
    return this.dataset.targetsByBranchMonth.get(`${branchId}_${month}`);
  }
}

export class DeliveryRepository implements IDeliveryRepository {
  constructor(private dataset: NormalizedDataset) {}

  getAll(): RawDelivery[] {
    return this.dataset.deliveries;
  }

  getByLeadId(leadId: string): RawDelivery | undefined {
    return this.dataset.deliveriesByLeadId.get(leadId);
  }
}

export interface DataRepositories {
  branches: IBranchRepository;
  salesReps: IRepresentativeRepository;
  leads: ILeadRepository;
  targets: ITargetRepository;
  deliveries: IDeliveryRepository;
}

let cachedRepositories: DataRepositories | null = null;

export function getDataRepositories(): DataRepositories {
  if (cachedRepositories) {
    return cachedRepositories;
  }

  const dataset = loadAndNormalizeDataset();
  cachedRepositories = {
    branches: new BranchRepository(dataset),
    salesReps: new RepresentativeRepository(dataset),
    leads: new LeadRepository(dataset),
    targets: new TargetRepository(dataset),
    deliveries: new DeliveryRepository(dataset),
  };

  return cachedRepositories;
}

