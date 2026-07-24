import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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

const variantStyles = {
  default: 'bg-white border-slate-100 text-slate-900',
  accent: 'bg-accent-50 border-accent-100 text-accent-900',
  warning: 'bg-warning-50 border-warning-100 text-warning-900',
  success: 'bg-emerald-50 border-emerald-100 text-emerald-900',
};

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
        'rounded-2xl border shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-accent-200',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-slate-500 uppercase tracking-wide', labelSizes[size])}>
            {label}
          </p>
          <div className="flex items-end gap-2 mt-1.5">
            <p className={cn('font-display font-bold', valueSizes[size])}>
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
        {icon && (
          <div className={cn(
            'p-2 rounded-xl shrink-0',
            variant === 'default' && 'bg-slate-100 text-slate-600',
            variant === 'accent' && 'bg-accent-200 text-accent-700',
            variant === 'warning' && 'bg-warning-200 text-warning-700',
            variant === 'success' && 'bg-emerald-200 text-emerald-700',
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
