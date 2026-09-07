import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useFilter, AppRoute } from '../../context/FilterContext';

interface Crumb {
  label: string;
  route?: AppRoute;
  params?: Record<string, string>;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  const { navigateTo } = useFilter();

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6 overflow-x-auto whitespace-nowrap py-1">
      <button
        onClick={() => navigateTo('overview')}
        className="flex items-center hover:text-slate-200 transition-colors p-1 -ml-1 rounded"
        title="Go to Executive Overview"
      >
        <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
        <span>Executive Overview</span>
      </button>

      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            {isLast || !crumb.route ? (
              <span className="font-medium text-slate-200">{crumb.label}</span>
            ) : (
              <button
                onClick={() => navigateTo(crumb.route!, crumb.params)}
                className="hover:text-slate-200 transition-colors p-1 rounded"
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

