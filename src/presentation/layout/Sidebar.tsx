/**
 * LAYER 5: PRESENTATION - SIDEBAR NAVIGATION
 * Persistent executive navigation rail with subtle active indicators.
 */

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  GitBranch,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react';

export type AppNavSection =
  | 'landing'
  | 'overview'
  | 'branches'
  | 'representatives'
  | 'leads'
  | 'insights';

interface SidebarProps {
  currentSection: AppNavSection;
  onNavigate: (section: AppNavSection) => void;
  insightsCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  insightsCount,
  isOpen,
  onClose,
}) => {
  const navItems: {
    id: AppNavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'landing', label: 'Platform & Features', icon: Sparkles },
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'branches', label: 'Branch Performance', icon: Building2 },
    { id: 'representatives', label: 'Sales Representatives', icon: Users },
    { id: 'leads', label: 'Lead Intelligence', icon: GitBranch },
    { id: 'insights', label: 'Action Center', icon: ShieldAlert, badge: insightsCount },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="w-9 h-9 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold shadow-xs text-xs tracking-wider">
            IIQ
          </div>
          <div>
            <div className="text-sm font-bold text-neutral-900 dark:text-white tracking-wide flex items-center gap-1.5">
              Industrial IQ
              <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                SaaS
              </span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Dealership Intelligence
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            Intelligence Suite
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-white dark:text-neutral-950' : 'text-neutral-500 dark:text-neutral-400'}`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? 'bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
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
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/60">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Ground Truth Network</span>
          </div>
          <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
            <div className="flex justify-between">
              <span>Branches:</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">5 Dealerships</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Officers:</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">30 Reps</span>
            </div>
            <div className="flex justify-between">
              <span>Verified Leads:</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">510 Records</span>
            </div>
            <div className="flex justify-between">
              <span>Coverage:</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">Jun–Dec 2025</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

