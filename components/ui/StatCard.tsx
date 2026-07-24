import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { IconChip } from './IconChip';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  variant?: 'default' | 'accent' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Card surface is always flat neutral — only the icon chip carries color.
const iconColor = {
  default: 'neutral',
  accent: 'accent',
  warning: 'warning',
  success: 'success',
} as const;

const sizeStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const valueSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
};

const labelSizes = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
};

const iconChipSizes = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

export function StatCard({
  label,
  value,
  icon,
  trend,
  variant = 'default',
  size = 'md',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-neutral-150 bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover',
        sizeStyles[size],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-neutral-500 uppercase tracking-wide', labelSizes[size])}>
            {label}
          </p>
          <div className="flex items-end gap-2 mt-1.5">
            <p className={cn('font-display font-bold text-neutral-900', valueSizes[size])}>
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  'text-xs font-semibold flex items-center gap-0.5 mb-0.5',
                  trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
        </div>
        {icon && <IconChip icon={icon} color={iconColor[variant]} size={iconChipSizes[size]} />}
      </div>
    </div>
  );
}
