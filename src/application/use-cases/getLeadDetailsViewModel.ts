/**
 * LAYER 4: APPLICATION LAYER - USE CASE: GET LEAD DETAILS VIEW MODEL
 */

import { DataRepositories } from '../../data-access/repositories';
import { LeadDetailsViewModel } from '../view-models';
import { formatDateTime } from '../../infrastructure/formatters';

export function getLeadDetailsViewModel(
  repos: DataRepositories,
  leadId: string
): LeadDetailsViewModel | null {
  const lead = repos.leads.getById(leadId);
  if (!lead) return null;

  const branch = repos.branches.getById(lead.branch_id);
  const rep = repos.salesReps.getById(lead.assigned_to);
  const delivery = repos.deliveries.getByLeadId(lead.id);

  const timeline = lead.status_history.map(item => ({
    status: item.status,
    timestampFormatted: formatDateTime(item.timestamp),
    note: item.note,
  }));

  return {
    lead,
    branch,
    rep,
    delivery,
    timeline,
  };
}

