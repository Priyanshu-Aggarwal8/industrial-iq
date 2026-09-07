import React from 'react';
import {
  X,
  User,
  Phone,
  Car,
  DollarSign,
  Building2,
  Calendar,
  Clock,
  Truck,
  AlertTriangle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  formatCurrency,
  formatDateTime,
  formatDate,
  formatDurationDays,
  capitalize,
} from '../../utils/formatters';

export const LeadDetailModal: React.FC = () => {
  const { inspectingLead, setInspectingLeadId, dataset, navigateTo } = useFilter();

  if (!inspectingLead) return null;

  const branch = dataset.branchesById.get(inspectingLead.branch_id);
  const rep = dataset.salesRepsById.get(inspectingLead.assigned_to);
  const delivery = dataset.deliveriesByLeadId.get(inspectingLead.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {inspectingLead.id}
              </span>
              <StatusBadge status={inspectingLead.status} />
              {inspectingLead.has_unrecorded_loss_transition && (
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                  Late-Dec Terminal Loss
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {inspectingLead.customer_name}
            </h2>
          </div>

          <button
            onClick={() => setInspectingLeadId(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Deal Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Car className="w-3.5 h-3.5 text-sky-400" />
                Vehicle Model
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {inspectingLead.model_interested}
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Deal Value
              </div>
              <div className="text-sm font-bold text-emerald-400">
                {formatCurrency(inspectingLead.deal_value)}
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                Branch Location
              </div>
              <button
                onClick={() => {
                  setInspectingLeadId(null);
                  if (branch) navigateTo('branches', { branchId: branch.id });
                }}
                className="text-sm font-semibold text-slate-200 hover:text-sky-400 text-left transition-colors"
              >
                {branch ? `${branch.name} (${branch.city})` : inspectingLead.branch_id}
              </button>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Assigned Sales Officer
              </div>
              <button
                onClick={() => {
                  setInspectingLeadId(null);
                  if (rep) navigateTo('representatives', { repId: rep.id });
                }}
                className="text-sm font-semibold text-slate-200 hover:text-sky-400 text-left transition-colors"
              >
                {rep ? rep.name : inspectingLead.assigned_to}
              </button>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                Contact & Source
              </div>
              <div className="text-sm font-medium text-slate-300">
                {capitalize(inspectingLead.source)}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {inspectingLead.phone}
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Inactivity / Status
              </div>
              <div className="text-sm font-medium text-slate-300">
                {inspectingLead.days_inactive !== undefined
                  ? `${inspectingLead.days_inactive} days idle`
                  : '—'}
              </div>
              <div className="text-[11px] text-slate-500">
                Close: {formatDate(inspectingLead.expected_close_date)}
              </div>
            </div>
          </div>

          {/* Delivery or Fulfillment Information */}
          {delivery && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-800/60 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                <Truck className="w-4 h-4" />
                Completed Delivery Record
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Order Date</span>
                  <span className="text-slate-200 font-medium font-mono">
                    {delivery.order_date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Delivery Date</span>
                  <span className="text-slate-200 font-medium font-mono">
                    {delivery.delivery_date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Turnaround</span>
                  <span className="text-slate-200 font-medium">
                    {formatDurationDays(delivery.days_to_deliver)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Fulfillment Status</span>
                  {delivery.delay_reason ? (
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Delayed: {delivery.delay_reason}
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium">On-Time Delivery</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {inspectingLead.status === 'order_placed' && (
            <div className="p-4 bg-purple-950/20 border border-purple-800/60 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
                <Clock className="w-4 h-4" />
                Unfulfilled Order Backlog
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Order placed and customer deposit confirmed. Delivery is pending factory allocation and RTO registration. Currently inactive for{' '}
                <span className="font-bold text-amber-400">{inspectingLead.days_inactive} days</span>.
              </p>
            </div>
          )}

          {inspectingLead.status === 'lost' && (
            <div className="p-4 bg-rose-950/20 border border-rose-800/60 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300 mb-1">
                <AlertTriangle className="w-4 h-4" />
                Deal Lost Breakdown
              </div>
              <div className="text-xs text-slate-300">
                Reason: <span className="font-semibold text-rose-300">{inspectingLead.lost_reason || 'Unspecified'}</span>
                {inspectingLead.last_stage_before_lost && (
                  <span className="text-slate-400 ml-2">
                    (Dropped off at {capitalize(inspectingLead.last_stage_before_lost)})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Chronological Lifecycle Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              Lead Journey & Activity Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {inspectingLead.status_history.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-sky-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  </div>

                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/70 hover:border-slate-700 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        <span className="text-xs font-semibold text-slate-200">
                          {capitalize(item.status)}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {formatDateTime(item.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic pl-1 border-l-2 border-slate-800 mt-2">
                      "{item.note}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setInspectingLeadId(null)}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

