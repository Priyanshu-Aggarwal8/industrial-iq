import React from 'react';
import {
  Menu,
  Calendar,
  Building,
  Search,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import { DATE_PRESETS } from '../../utils/dates';

export const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const {
    currentRoute,
    dataset,
    dateFilter,
    setDateFilter,
    selectedBranchId,
    setSelectedBranchId,
    searchQuery,
    setSearchQuery,
    navigateTo,
  } = useFilter();

  const getPageTitle = () => {
    switch (currentRoute) {
      case 'overview':
        return 'Executive Overview';
      case 'branches':
        return 'Branch Performance & Targets';
      case 'representatives':
        return 'Sales Representative Intelligence';
      case 'leads':
        return 'Lead & Pipeline Intelligence';
      case 'insights':
        return 'Action Center & Bottleneck Alerts';
      default:
        return 'Dealership Intelligence';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {getPageTitle()}
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center text-emerald-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified Dealership Data (Jun–Dec 2025)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Global Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Branch Filter */}
          <div className="relative flex items-center">
            <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedBranchId || ''}
              onChange={e => setSelectedBranchId(e.target.value ? e.target.value : undefined)}
              className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 appearance-none cursor-pointer"
            >
              <option value="">All Branches (Group)</option>
              {dataset.branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          {/* Time Period Filter */}
          <div className="relative flex items-center">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={dateFilter.id}
              onChange={e => {
                const preset = DATE_PRESETS.find(p => p.id === e.target.value);
                if (preset) setDateFilter(preset);
              }}
              className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-lg bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 appearance-none cursor-pointer"
            >
              {DATE_PRESETS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:w-56 lg:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads, models..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (e.target.value && currentRoute !== 'leads') {
                  navigateTo('leads');
                }
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

