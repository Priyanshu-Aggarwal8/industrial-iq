/**
 * LAYER 5: PRESENTATION - LEAD LIFECYCLE MODAL
 * Visually stunning chronological lifecycle modal with animated stage nodes,
 * fulfillment audit telemetry, and late-December loss discrepancy handling.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Calendar,
  User,
  Building2,
  Phone,
  Car,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ArrowRight,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { LeadDetailsViewModel } from '../../application/view-models';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate, formatDateTime, formatInteger } from '../../infrastructure/formatters';

interface LeadLifecycleModalProps {
  viewModel: LeadDetailsViewModel | null;
  onClose: () => void;
  onSelectBranch?: (branchId: string) => void;
  onSelectRep?: (repId: string) => void;
}

export const LeadLifecycleModal: React.FC<LeadLifecycleModalProps> = ({
  viewModel,
  onClose,
  onSelectBranch,
  onSelectRep,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!viewModel) return null;

  const { lead, branch, rep, delivery, timeline } = viewModel;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/60 dark:bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Surface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header Banner */}
          <div className="p-6 sm:p-8 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/60 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 px-2.5 py-0.5 rounded-md">
                  {lead.id}
                </span>
                <StatusBadge status={lead.status} />
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  Source: <strong className="text-neutral-900 dark:text-neutral-200 uppercase">{lead.source}</strong>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight">
                {lead.customer_name}
              </h2>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 flex-wrap font-mono">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  {lead.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-neutral-400" />
                  Model: <strong className="text-neutral-900 dark:text-white">{lead.model_interested}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <DollarSign className="w-4 h-4" />
                  {formatCurrency(lead.deal_value)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            {/* Attribution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center border border-blue-200 dark:border-blue-900 shrink-0">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-mono font-bold block">Dealership Branch</span>
                  {branch ? (
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectBranch) onSelectBranch(branch.id);
                      }}
                      className="text-sm font-bold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                    >
                      {branch.name} ({branch.city})
                    </button>
                  ) : (
                    <span className="text-sm text-neutral-400">Unassigned</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center border border-blue-200 dark:border-blue-900 shrink-0">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-mono font-bold block">Assigned Sales Officer</span>
                  {rep ? (
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectRep) onSelectRep(rep.id);
                      }}
                      className="text-sm font-bold text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                    >
                      {rep.name} ({rep.role === 'branch_manager' ? 'Branch GM' : 'Sales Officer'})
                    </button>
                  ) : (
                    <span className="text-sm text-neutral-400">Unassigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Record */}
            {delivery && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-neutral-950/60 border border-emerald-200 dark:border-emerald-900/50 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Fulfillment & Delivery Record
                  </span>
                  {delivery.delay_reason ? (
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/50">
                      Delayed: {delivery.delay_reason}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                      On-Time SLA
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm font-mono">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-200/70 dark:border-neutral-800">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block uppercase">Order Date</span>
                    <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block">{formatDate(delivery.order_date)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-200/70 dark:border-neutral-800">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block uppercase">Delivered Date</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{formatDate(delivery.delivery_date)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-200/70 dark:border-neutral-800">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block uppercase">Turnaround</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">{delivery.days_to_deliver} days</span>
                  </div>
                </div>
              </div>
            )}

            {/* Lost Reason Alert */}
            {lead.status === 'lost' && (
              <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-neutral-950/60 border border-rose-200 dark:border-rose-900/50 space-y-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs sm:text-sm font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                    Lost Opportunity Reason
                  </span>
                </div>
                <p className="text-base font-bold text-neutral-900 dark:text-white">
                  {lead.lost_reason || 'Unspecified Reason'}
                </p>
                {lead.has_unrecorded_loss_transition && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-neutral-900 border border-amber-200 dark:border-amber-800/40 text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Audit Notice:</strong> This lead is one of 14 late-December records where status is lost but the terminal exit was omitted from raw status history. Normalized to preserve the audit trail and last reached stage.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Lifecycle Timeline */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Stage Progression Audit Trail ({timeline.length} events)
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                {timeline.map((step, idx) => {
                  const isLatest = idx === timeline.length - 1;

                  return (
                    <div key={idx} className="relative group">
                      <span
                        className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isLatest
                            ? 'bg-blue-600 border-white ring-4 ring-blue-500/20'
                            : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-white' : 'bg-neutral-400 dark:bg-neutral-500'}`} />
                      </span>

                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 group-hover:border-blue-400 dark:group-hover:border-neutral-700 transition-colors space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <StatusBadge status={step.status} />
                          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                            {step.timestampFormatted}
                          </span>
                        </div>
                        {step.note && (
                          <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-mono bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-950/80 flex items-center justify-between text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
            <span>Created on {formatDate(lead.created_at)}</span>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
