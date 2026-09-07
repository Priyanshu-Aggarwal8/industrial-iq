import React from 'react';
import { LeadStatus, InsightPriority } from '../../types';
import { capitalize } from '../../utils/formatters';

interface StatusBadgeProps {
  status?: LeadStatus;
  priority?: InsightPriority;
  text?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  priority,
  text,
  className = '',
}) => {
  if (priority) {
    switch (priority) {
      case 'critical':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-800/80 ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 animate-pulse" />
            {text || 'Critical'}
          </span>
        );
      case 'high':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-800/80 ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
            {text || 'High Priority'}
          </span>
        );
      case 'medium':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-950/70 text-sky-300 border border-sky-800/80 ${className}`}
          >
            {text || 'Medium'}
          </span>
        );
      case 'info':
      default:
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700 ${className}`}
          >
            {text || 'Info'}
          </span>
        );
    }
  }

  if (status) {
    switch (status) {
      case 'delivered':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 ${className}`}
          >
            Delivered
          </span>
        );
      case 'order_placed':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-950/60 text-purple-300 border border-purple-800/60 ${className}`}
          >
            Order Placed
          </span>
        );
      case 'negotiation':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-950/60 text-blue-300 border border-blue-800/60 ${className}`}
          >
            Negotiation
          </span>
        );
      case 'test_drive':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 ${className}`}
          >
            Test Drive
          </span>
        );
      case 'contacted':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/60 ${className}`}
          >
            Contacted
          </span>
        );
      case 'new':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 ${className}`}
          >
            New Lead
          </span>
        );
      case 'lost':
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-800/60 ${className}`}
          >
            Lost
          </span>
        );
      default:
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 ${className}`}
          >
            {capitalize(status)}
          </span>
        );
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 ${className}`}
    >
      {text || '—'}
    </span>
  );
};

