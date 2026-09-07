import { DateRangeFilter } from '../types';

export const DATASET_MIN_DATE = '2025-06-01';
export const DATASET_MAX_DATE = '2025-12-31';
// Reference timestamp for calculating lead inactivity/aging relative to dataset close
export const DATASET_REFERENCE_TIMESTAMP = '2025-12-31T23:59:59Z';

export const DATE_PRESETS: DateRangeFilter[] = [
  {
    id: 'all',
    label: 'All Time (Jun–Dec 2025)',
    startDate: '2025-06-01',
    endDate: '2025-12-31',
  },
  {
    id: '2025-12',
    label: 'December 2025',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    isMonth: true,
    monthKey: '2025-12',
  },
  {
    id: '2025-11',
    label: 'November 2025',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    isMonth: true,
    monthKey: '2025-11',
  },
  {
    id: '2025-10',
    label: 'October 2025',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    isMonth: true,
    monthKey: '2025-10',
  },
  {
    id: 'q4',
    label: 'Q4 2025 (Oct–Dec)',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
  },
  {
    id: 'q3',
    label: 'Q3 2025 (Jul–Sep)',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
  },
  {
    id: '2025-09',
    label: 'September 2025',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    isMonth: true,
    monthKey: '2025-09',
  },
  {
    id: '2025-08',
    label: 'August 2025',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    isMonth: true,
    monthKey: '2025-08',
  },
  {
    id: '2025-07',
    label: 'July 2025',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    isMonth: true,
    monthKey: '2025-07',
  },
  {
    id: '2025-06',
    label: 'June 2025',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    isMonth: true,
    monthKey: '2025-06',
  },
];

export function isDateInRange(
  dateString: string,
  startDate: string,
  endDate: string
): boolean {
  if (!dateString) return false;
  const targetDate = dateString.slice(0, 10); // YYYY-MM-DD
  return targetDate >= startDate && targetDate <= endDate;
}

export function getMonthsCovered(startDate: string, endDate: string): string[] {
  const startMonth = startDate.slice(0, 7);
  const endMonth = endDate.slice(0, 7);
  const allMonths = [
    '2025-06',
    '2025-07',
    '2025-08',
    '2025-09',
    '2025-10',
    '2025-11',
    '2025-12',
  ];
  return allMonths.filter(m => m >= startMonth && m <= endMonth);
}

export function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1.slice(0, 10));
  const d2 = new Date(date2.slice(0, 10));
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

