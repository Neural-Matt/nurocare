import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { IconChip } from './IconChip';

interface HealthInsightProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'info' | 'success' | 'warning' | 'tip';
  className?: string;
}

// Flat neutral card + colored icon chip only — the card itself never tints.
const iconColor = {
  info: 'primary',
  success: 'success',
  warning: 'warning',
  tip: 'accent',
} as const;

const actionColor = {
  info: 'text-primary-800 hover:bg-primary-50',
  success: 'text-accent-700 hover:bg-accent-50',
  warning: 'text-warning-700 hover:bg-warning-50',
  tip: 'text-accent-700 hover:bg-accent-50',
};

export function HealthInsightCard({
  icon,
  title,
  description,
  action,
  variant = 'info',
  className,
}: HealthInsightProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-neutral-150 bg-white p-4 transition-shadow duration-200 hover:shadow-card-hover',
        className
      )}
    >
      <div className="flex gap-3">
        <IconChip icon={icon} color={iconColor[variant]} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-0.5 text-neutral-900">
            {title}
          </h3>
          <p className="text-xs leading-relaxed text-neutral-600">
            {description}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'text-xs font-semibold mt-2.5 px-2.5 py-1.5 -ml-2.5 rounded-lg transition-colors',
                actionColor[variant]
              )}
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
