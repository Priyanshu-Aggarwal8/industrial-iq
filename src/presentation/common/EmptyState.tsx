/**
 * LAYER 5: PRESENTATION - EMPTY STATE
 */

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-12 text-center flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-subtle ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 mb-4 border border-neutral-200 dark:border-neutral-700">
        <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-bold text-neutral-950 dark:text-neutral-50 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 text-sm font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-xl transition-colors shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

