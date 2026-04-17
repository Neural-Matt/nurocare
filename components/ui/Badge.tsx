import { cn } from '@/lib/utils';
import { ClaimStatus, SubscriptionStatus } from '@/types';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-accent-50 text-accent-700 border-accent-200',
  warning: 'bg-warning-50 text-warning-600 border-warning-200',
  error:   'bg-red-50 text-red-600 border-red-200',
  info:    'bg-primary-50 text-primary-800 border-primary-100',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Map claim status to badge variant */
export function claimStatusBadge(status: ClaimStatus) {
  const map: Record<ClaimStatus, { variant: BadgeVariant; label: string }> = {
    submitted: { variant: 'info', label: 'Submitted' },
    reviewing: { variant: 'warning', label: 'Under Review' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'error', label: 'Rejected' },
    paid: { variant: 'success', label: 'Paid' },
  };
  return map[status] ?? { variant: 'neutral', label: status };
}

/** Map subscription status to badge variant */
export function subscriptionStatusBadge(status: SubscriptionStatus) {
  const map: Record<SubscriptionStatus, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    expired: { variant: 'error', label: 'Expired' },
    cancelled: { variant: 'neutral', label: 'Cancelled' },
    pending: { variant: 'warning', label: 'Pending' },
  };
  return map[status] ?? { variant: 'neutral', label: status };
}
