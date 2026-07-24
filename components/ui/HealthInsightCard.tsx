import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HealthInsightProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'info' | 'success' | 'warning' | 'tip';
  animated?: boolean;
}

const variantStyles = {
  info: {
    container: 'bg-blue-50 border-blue-100',
    icon: 'bg-blue-100 text-blue-600',
    title: 'text-blue-900',
    desc: 'text-blue-700',
    action: 'text-blue-700 hover:text-blue-900 hover:bg-blue-100',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-100',
    icon: 'bg-emerald-100 text-emerald-600',
    title: 'text-emerald-900',
    desc: 'text-emerald-700',
    action: 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100',
  },
  warning: {
    container: 'bg-amber-50 border-amber-100',
    icon: 'bg-amber-100 text-amber-600',
    title: 'text-amber-900',
    desc: 'text-amber-700',
    action: 'text-amber-700 hover:text-amber-900 hover:bg-amber-100',
  },
  tip: {
    container: 'bg-accent-50 border-accent-200',
    icon: 'bg-accent-100 text-accent-600',
    title: 'text-accent-900',
    desc: 'text-accent-700',
    action: 'text-accent-700 hover:text-accent-900 hover:bg-accent-100',
  },
};

export function HealthInsightCard({
  icon,
  title,
  description,
  action,
  variant = 'info',
  animated = false,
}: HealthInsightProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-all duration-200 hover:shadow-md',
        styles.container,
        animated && 'animate-slide-in-right'
      )}
    >
      <div className="flex gap-3">
        <div className={cn('p-2.5 rounded-xl shrink-0', styles.icon)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-semibold text-sm mb-0.5', styles.title)}>
            {title}
          </h3>
          <p className={cn('text-xs leading-relaxed', styles.desc)}>
            {description}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'text-xs font-semibold mt-2.5 px-2.5 py-1.5 rounded-lg transition-colors',
                styles.action
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
