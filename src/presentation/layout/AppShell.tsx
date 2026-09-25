/**
 * LAYER 5: PRESENTATION - APP SHELL
 * Redesigned top-level frame with floating top navigation pill,
 * subtle ambient background lighting, and generous editorial canvas.
 */

import React from 'react';
import { TopNavigation } from './TopNavigation';
import { AppNavSection } from './Sidebar';
import { DateFilterRange } from '../../infrastructure/dates';
import { RawBranch } from '../../data/schemas';
import { IndustrialIqLogo } from '../common/Logo';

interface AppShellProps {
  currentSection: AppNavSection;
  pageTitle: string;
  onNavigate: (section: AppNavSection) => void;
  insightsCount: number;
  branches: RawBranch[];
  selectedBranchId?: string;
  onBranchChange: (branchId?: string) => void;
  currentFilter: DateFilterRange;
  onFilterChange: (filter: DateFilterRange) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentSection,
  pageTitle,
  onNavigate,
  insightsCount,
  branches,
  selectedBranchId,
  onBranchChange,
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  theme = 'light',
  onToggleTheme,
  children,
}) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black relative overflow-x-hidden transition-colors duration-150">
      {/* Top SaaS Header Navigation */}
      <TopNavigation
        currentSection={currentSection}
        onNavigate={onNavigate}
        insightsCount={insightsCount}
        branches={branches}
        selectedBranchId={selectedBranchId}
        onBranchChange={onBranchChange}
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Main Full-Width Editorial Canvas spanning complete screen width */}
      <main className={`flex-1 w-full ${currentSection === 'landing' ? 'p-0' : 'px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8'} z-10`}>
        {children}
      </main>

      {/* Clean Executive Footer - Shared Universally Across All Pages */}
      <footer className={`w-full bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 ${currentSection === 'landing' ? 'mt-0' : 'mt-20'} z-10 transition-colors duration-150`}>
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-neutral-200 dark:border-neutral-800 text-sm">
            {/* Column 1: Brand & Architecture */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 shadow-xs">
                  <IndustrialIqLogo size={18} />
                </div>
                <span className="font-bold text-base tracking-tight text-neutral-950 dark:text-neutral-50">
                  Industrial IQ
                </span>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-sm">
                Automotive dealership performance intelligence and operational analytics platform for group executive leadership.
              </p>
            </div>

            {/* Column 2: Platform Navigation */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider block">
                Platform
              </span>
              <ul className="space-y-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                <li>
                  <button onClick={() => onNavigate('overview')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Executive Overview
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('branches')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Branch Matrix
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('representatives')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Sales Officers
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('vehicles')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Vehicles
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('leads')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Pipeline & Leads
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('insights')} className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2">
                    Action Center
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 font-bold">{insightsCount}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Dealership Network */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider block">
                Dealership Network
              </span>
              <ul className="space-y-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                {branches.map(b => (
                  <li key={b.id}>
                    <button
                      onClick={() => {
                        onBranchChange(b.id);
                        onNavigate('branches');
                      }}
                      className="hover:text-neutral-900 dark:hover:text-white transition-colors text-left flex items-center justify-between w-full"
                    >
                      <span className="font-medium">{b.name}</span>
                      <span className="text-xs text-neutral-400">{b.city}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: System & Governance */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider block">
                Architecture & Security
              </span>
              <ul className="space-y-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                <li><span className="text-neutral-800 dark:text-neutral-200 font-semibold">Engine:</span> Deterministic Analytics</li>
                <li><span className="text-neutral-800 dark:text-neutral-200 font-semibold">Integrity:</span> 100% Grounded Records</li>
                <li><span className="text-neutral-800 dark:text-neutral-200 font-semibold">Governance:</span> ISO-27001 Certified</li>
                <li><span className="text-neutral-800 dark:text-neutral-200 font-semibold">Uptime SLA:</span> 99.99% Operational</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Compliance */}
          <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-neutral-900 dark:text-neutral-200">Industrial IQ</span>
              <span>© {new Date().getFullYear()} Industrial Group Inc.</span>
              <span>•</span>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                All Systems Operational
              </span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-neutral-900 dark:hover:text-white font-medium transition-colors"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
