/**
 * Formatting utilities for Industrial IQ.
 * Standardizes currency (INR), percentages, quantities, dates, and durations.
 */

export function formatCurrency(amount: number, compact: boolean = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      // Crores
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      // Lakhs
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, includeSign: boolean = false): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0%';
  }
  const formatted = `${value.toFixed(1)}%`;
  if (includeSign && value > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

export function formatInteger(num: number): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
}

export function formatDate(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatDurationDays(days: number): string {
  if (days === 1) return '1 day';
  return `${days} days`;
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

