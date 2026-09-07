/**
 * LAYER 2: DATA ACCESS LAYER - INTERFACES
 * Repository contracts decoupling the application and domain logic
 * from raw JSON storage. Enables future API/database replacement.
 */

import {
  RawBranch,
  RawSalesRep,
  RawTarget,
  RawDelivery,
} from '../data/schemas';
import { NormalizedLead } from '../data/normalizer';

export interface IBranchRepository {
  getAll(): RawBranch[];
  getById(id: string): RawBranch | undefined;
}

export interface IRepresentativeRepository {
  getAll(): RawSalesRep[];
  getById(id: string): RawSalesRep | undefined;
  getByBranchId(branchId: string): RawSalesRep[];
}

export interface ILeadRepository {
  getAll(): NormalizedLead[];
  getById(id: string): NormalizedLead | undefined;
  getByBranchId(branchId: string): NormalizedLead[];
  getByRepId(repId: string): NormalizedLead[];
}

export interface ITargetRepository {
  getAll(): RawTarget[];
  getByBranchId(branchId: string): RawTarget[];
  getByMonth(month: string): RawTarget[];
  getByBranchAndMonth(branchId: string, month: string): RawTarget | undefined;
}

export interface IDeliveryRepository {
  getAll(): RawDelivery[];
  getByLeadId(leadId: string): RawDelivery | undefined;
}

