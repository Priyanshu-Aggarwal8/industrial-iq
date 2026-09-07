import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  target?: string | number;
  attainment?: number;
  gap?: string;
  statusText?: string;
  statusVariant?: 'healthy' | 'warning' | 'critical' | 'neutral';
  icon?: LucideIcon;
  subtext?: string;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  target,
  attainment,
  gap,
  statusText,
  statusVariant = 'neutral',
  icon: Icon,
  subtext,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (statusVariant) {
      case 'healthy':
        return {
          pill: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
          bar: 'bg-emerald-500',
          indicator: 'text-emerald-400',
        };
      case 'warning':
        return {
          pill: 'bg-amber-950/70 text-amber-300 border-amber-800/80',
          bar: 'bg-amber-500',
          indicator: 'text-amber-400',
        };
      case 'critical':
        return {
          pill: 'bg-rose-950/70 text-rose-300 border-rose-800/80',
          bar: 'bg-rose-500',
          indicator: 'text-rose-400',
        };
      case 'neutral':
      default:
        return {
          pill: 'bg-slate-800/80 text-slate-300 border-slate-700',
          bar: 'bg-sky-500',
          indicator: 'text-slate-400',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`iq-card p-5 flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          {Icon && <Icon className="w-4 h-4 text-slate-500" />}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {value}
          </div>
          {statusText && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${styles.pill}`}>
              {statusText}
            </span>
          )}
        </div>

        {subtitle && (
          <div className="text-xs text-slate-400 mt-1 font-medium">
            {subtitle}
          </div>
        )}
      </div>

      {(attainment !== undefined || target !== undefined) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">
              Target: <span className="text-slate-200 font-medium">{target ?? '—'}</span>
            </span>
            {gap && (
              <span className={`font-mono text-xs ${styles.indicator}`}>
                {gap}
              </span>
            )}
          </div>

          {attainment !== undefined && (
            <div className="w-full bg-slate-800/90 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, attainment))}%` }}
              />
            </div>
          )}
        </div>
      )}

      {subtext && (
        <div className="text-[11px] text-slate-500 mt-2 font-mono">
          {subtext}
        </div>
      )}
    </div>
  );
};

