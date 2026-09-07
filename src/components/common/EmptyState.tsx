import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`iq-card p-12 text-center flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4 border border-slate-700/60">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-medium text-sky-400 bg-sky-950/60 border border-sky-800 rounded-lg hover:bg-sky-900/60 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

