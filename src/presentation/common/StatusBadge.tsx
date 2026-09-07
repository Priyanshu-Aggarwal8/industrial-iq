/**
 * LAYER 5: PRESENTATION - STATUS & PRIORITY BADGES
 * Semantic visual indicators for lead stages and insight priority levels.
 */

import React from 'react';
import { RawLeadStatus } from '../../data/schemas';
import { DomainInsightPriority } from '../../domain/models';
import { capitalize } from '../../infrastructure/formatters';

interface StatusBadgeProps {
  status?: RawLeadStatus | string;
  priority?: DomainInsightPriority;
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
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800 shadow-xs ${className}`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
            {text || 'Critical'}
          </span>
        );
      case 'high':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800 ${className}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
            {text || 'High Priority'}
          </span>
        );
      case 'medium':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800 ${className}`}
          >
            {text || 'Medium'}
          </span>
        );
      case 'info':
      default:
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 ${className}`}
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
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80 ${className}`}
          >
            Delivered
          </span>
        );
      case 'order_placed':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800/80 ${className}`}
          >
            Order Placed
          </span>
        );
      case 'negotiation':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/80 ${className}`}
          >
            Negotiation
          </span>
        );
      case 'test_drive':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800/80 ${className}`}
          >
            Test Drive
          </span>
        );
      case 'contacted':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80 ${className}`}
          >
            Contacted
          </span>
        );
      case 'new':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800/80 ${className}`}
          >
            New Lead
          </span>
        );
      case 'lost':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80 ${className}`}
          >
            Lost
          </span>
        );
      default:
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 ${className}`}
          >
            {capitalize(status)}
          </span>
        );
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 ${className}`}
    >
      {text || '—'}
    </span>
  );
};

