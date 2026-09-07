/**
 * LAYER 5: PRESENTATION - HEADER
 * Persistent application header housing the PremiumDateFilter,
 * branch scope dropdown, and search input.
 */

import React from 'react';
import { Menu, Building, Search, CheckCircle2 } from 'lucide-react';
import { PremiumDateFilter } from './PremiumDateFilter';
import { DateFilterRange } from '../../infrastructure/dates';
import { RawBranch } from '../../data/schemas';

interface HeaderProps {
  pageTitle: string;
  branches: RawBranch[];
  selectedBranchId?: string;
  onBranchChange: (branchId?: string) => void;
  currentFilter: DateFilterRange;
  onFilterChange: (filter: DateFilterRange) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  branches,
  selectedBranchId,
  onBranchChange,
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onMenuClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
              {pageTitle}
            </h1>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Verified Ground Truth Data
              </span>
            </div>
          </div>
        </div>

        {/* Right: Global Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Branch Scope Selector */}
          <div className="relative flex items-center">
            <Building className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3 pointer-events-none" />
            <select
              value={selectedBranchId || ''}
              onChange={e => onBranchChange(e.target.value ? e.target.value : undefined)}
              className="pl-9 pr-8 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer shadow-subtle"
            >
              <option value="">All Dealership Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          {/* Premium Date Filter */}
          <PremiumDateFilter
            currentFilter={currentFilter}
            onFilterChange={onFilterChange}
          />

          {/* Search Box */}
          <div className="relative flex-1 sm:w-56 lg:w-48">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads, models..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

