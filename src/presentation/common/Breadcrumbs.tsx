/**
 * LAYER 5: PRESENTATION - BREADCRUMBS
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  onClick?: () => void;
}

export const Breadcrumbs: React.FC<{ crumbs: Crumb[] }> = ({ crumbs }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400 mb-6 overflow-x-auto whitespace-nowrap py-1">
      <button
        onClick={crumbs[0]?.onClick}
        className="flex items-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors p-1 -ml-1 rounded"
        title="Go to Executive Overview"
      >
        <Home className="w-4 h-4 mr-1.5 text-neutral-400 dark:text-neutral-500" />
        <span>Executive Overview</span>
      </button>

      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600 shrink-0" />
            {isLast || !crumb.onClick ? (
              <span className="font-semibold text-neutral-950 dark:text-white">{crumb.label}</span>
            ) : (
              <button
                onClick={crumb.onClick}
                className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors p-1 rounded font-medium"
              >
                {crumb.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

