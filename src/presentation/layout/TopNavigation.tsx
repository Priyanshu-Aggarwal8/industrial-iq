/**
 * LAYER 5: PRESENTATION - TOP NAVIGATION HEADER
 * Executive SaaS application header with bespoke Industrial IQ brand mark,
 * scaled-up legible typography, and seamless dark mode transitions.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  Car,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { AppNavSection } from './Sidebar';
import { DateFilterRange, DATE_PRESETS } from '../../infrastructure/dates';
import { RawBranch } from '../../data/schemas';
import { IndustrialIqLogo } from '../common/Logo';

interface TopNavigationProps {
  currentSection: AppNavSection;
  onNavigate: (section: AppNavSection) => void;
  insightsCount: number;
  branches: RawBranch[];
  selectedBranchId?: string;
  onBranchChange: (branchId?: string) => void;
  currentFilter: DateFilterRange;
  onFilterChange: (filter: DateFilterRange) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentSection,
  onNavigate,
  insightsCount,
  branches,
  selectedBranchId,
  onBranchChange,
  currentFilter,
  onFilterChange,
  theme = 'light',
  onToggleTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

  const navItems: { id: AppNavSection; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'landing', label: 'Platform', icon: Sparkles },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'branches', label: 'Branches', icon: Building2 },
    { id: 'representatives', label: 'Sales Officers', icon: Users },
    { id: 'leads', label: 'Pipeline & Leads', icon: Car },
    { id: 'insights', label: 'Action Center', icon: Sparkles, badge: insightsCount },
  ];

  const selectedBranch = branches.find(b => b.id === selectedBranchId);
  const selectedBranchName = selectedBranch ? selectedBranch.name : 'All Dealerships';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-150">
      {/* Single Working Header Bar */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand + Dealership Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Bespoke Industrial IQ Brand Mark */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="Industrial IQ Home"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 shadow-sm transition-transform group-hover:scale-95 shrink-0">
              <IndustrialIqLogo size={18} />
            </div>
            <span className="font-bold text-base tracking-tight text-neutral-950 dark:text-neutral-50 hidden md:inline-block">
              Industrial IQ
            </span>
          </div>

          <span className="text-neutral-300 dark:text-neutral-700 font-light text-base select-none">/</span>

          {/* Dealership Scope Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsBranchMenuOpen(!isBranchMenuOpen);
                setIsDateMenuOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 transition-all shadow-subtle"
            >
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-[150px] md:max-w-[180px]">
                {selectedBranchName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-150 shrink-0 ${isBranchMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Backdrop click dismiss */}
            {isBranchMenuOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsBranchMenuOpen(false)}
              />
            )}

            {/* Dealership Dropdown Popover */}
            <AnimatePresence>
              {isBranchMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 mt-2 w-72 sm:w-80 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-2 z-50 text-sm"
                >
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    Dealership Branch
                  </div>
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    <button
                      onClick={() => {
                        onBranchChange(undefined);
                        setIsBranchMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        !selectedBranchId
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm">All Dealerships</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Aggregated group-wide intelligence</div>
                      </div>
                      {!selectedBranchId && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>

                    {branches.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          onBranchChange(b.id);
                          setIsBranchMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                          selectedBranchId === b.id
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-sm">{b.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{b.city}</div>
                        </div>
                        {selectedBranchId === b.id && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: In-App Navigation Tabs (Inline Single Header) */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
          {navItems.map(item => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Time Horizon Filter + Mode Toggle + Profile + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Dedicated Visible Time Horizon Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDateMenuOpen(!isDateMenuOpen);
                setIsBranchMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-subtle border ${
                isDateMenuOpen
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white border-neutral-300 dark:border-neutral-600'
                  : 'text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white'
              }`}
              title="Select time horizon"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-[160px] md:max-w-[200px]">
                {currentFilter.label}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-150 shrink-0 ${isDateMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Backdrop click dismiss */}
            {isDateMenuOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDateMenuOpen(false)}
              />
            )}

            {/* Date Presets Dropdown Popover */}
            <AnimatePresence>
              {isDateMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-2 z-50 text-sm"
                >
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    Time Horizon (2025)
                  </div>
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {DATE_PRESETS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onFilterChange(p);
                          setIsDateMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-colors ${
                          currentFilter.id === p.id
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white'
                        }`}
                      >
                        <span className="font-medium">{p.label}</span>
                        {currentFilter.id === p.id && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Mode Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800 cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          {/* Executive Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs flex items-center justify-center border border-neutral-300 dark:border-neutral-700 shadow-sm shrink-0 select-none">
            IQ
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-4 py-4 space-y-2"
          >
            {navItems.map(item => {
              const isActive = currentSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
