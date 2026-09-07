/**
 * LAYER 5: PRESENTATION - PREMIUM DATE FILTER
 * Executive-grade interactive period selector.
 * Replaces basic HTML select with an animated segmented/dropdown control.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateFilterRange, DATE_PRESETS } from '../../infrastructure/dates';

interface PremiumDateFilterProps {
  currentFilter: DateFilterRange;
  onFilterChange: (filter: DateFilterRange) => void;
}

export const PremiumDateFilter: React.FC<PremiumDateFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const topShortcuts = DATE_PRESETS.slice(0, 3); // All Time, Dec 2025, Nov 2025

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-subtle"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>{currentFilter.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-64 p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl backdrop-blur-md z-50 overflow-hidden"
          >
            <div className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 mb-1.5">
              Select Time Horizon (2025)
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {DATE_PRESETS.map(preset => {
                const isSelected = preset.id === currentFilter.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onFilterChange(preset);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-xs'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate">{preset.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-white dark:text-neutral-950 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 px-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              Bound: June 1 – Dec 31, 2025
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

