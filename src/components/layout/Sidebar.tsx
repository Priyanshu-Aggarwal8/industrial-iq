import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  GitBranch,
  AlertTriangle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useFilter, AppRoute } from '../../context/FilterContext';
import { generateActionableInsights } from '../../analytics/insights';

interface NavItem {
  id: AppRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentRoute, navigateTo, dataset, dateFilter, selectedBranchId } = useFilter();

  const insightsCount = React.useMemo(() => {
    return generateActionableInsights(dataset, dateFilter, selectedBranchId).length;
  }, [dataset, dateFilter, selectedBranchId]);

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'branches', label: 'Branch Performance', icon: Building2 },
    { id: 'representatives', label: 'Sales Representatives', icon: Users },
    { id: 'leads', label: 'Lead Intelligence', icon: GitBranch },
    { id: 'insights', label: 'Action Center', icon: AlertTriangle, badge: insightsCount },
  ];

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/90 bg-slate-950/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-sky-500/20 text-xs tracking-wider">
            IIQ
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              Industrial IQ
              <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                SaaS
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium tracking-tight">
              Dealership Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Rail */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Intelligence Suite
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-sky-700'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/80'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Network Metadata Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-semibold text-slate-300">Ground Truth Network</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Branches:</span>
              <span className="text-slate-200 font-medium">5 Dealerships</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Reps:</span>
              <span className="text-slate-200 font-medium">30 Officers</span>
            </div>
            <div className="flex justify-between">
              <span>Total Leads:</span>
              <span className="text-slate-200 font-medium">510 Leads</span>
            </div>
            <div className="flex justify-between">
              <span>Dataset Range:</span>
              <span className="text-slate-200 font-medium">Jun–Dec 2025</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

