import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type IconChipColor = 'primary' | 'accent' | 'warning' | 'success' | 'error' | 'neutral';
type IconChipSize = 'sm' | 'md' | 'lg';

interface IconChipProps {
  icon: ReactNode;
  color?: IconChipColor;
  size?: IconChipSize;
  className?: string;
}

const colors: Record<IconChipColor, string> = {
  primary: 'bg-primary-50 text-primary-800',
  accent:  'bg-accent-100 text-accent-700',
  warning: 'bg-warning-100 text-warning-700',
  success: 'bg-emerald-100 text-emerald-700',
  error:   'bg-red-100 text-red-700',
  neutral: 'bg-neutral-100 text-neutral-700',
};

const sizes: Record<IconChipSize, string> = {
  sm: 'w-8 h-8 rounded-lg [&>svg]:w-4 [&>svg]:h-4',
  md: 'w-9 h-9 rounded-xl [&>svg]:w-[18px] [&>svg]:h-[18px]',
  lg: 'w-12 h-12 rounded-xl [&>svg]:w-6 [&>svg]:h-6',
};

/**
 * The one place a card/tile is allowed to carry accent color: a small
 * icon square on an otherwise flat, neutral surface. Centralizes the
 * "flat card + colored icon chip" pattern used across StatCard,
 * HealthInsightCard, quick actions, and feature/claim-type lists.
 */
export function IconChip({ icon, color = 'accent', size = 'md', className }: IconChipProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center shrink-0',
        colors[color],
        sizes[size],
        className
      )}
    >
      {icon}
    </div>
  );
}
