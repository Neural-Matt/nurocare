'use client';

import { Claim, ClaimStatus } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { ChevronRight, Stethoscope, Pill, FlaskConical, Building2, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconChip } from '@/components/ui/IconChip';

const CLAIM_ICONS = {
  consultation:    Stethoscope,
  medication:      Pill,
  lab:             FlaskConical,
  hospitalization: Building2,
  dental:          Smile,
};

export const CLAIM_LABELS: Record<string, string> = {
  consultation:    'Consultation',
  medication:      'Medication',
  lab:             'Lab Test',
  hospitalization: 'Hospitalization',
  dental:          'Dental',
};

// Mirrors claimStatusBadge() in components/ui/Badge.tsx — one semantic
// mapping per status, reused everywhere a claim's status is shown so the
// same claim never renders in two different colors on different screens.
// submitted=neutral, reviewing=warning, approved=primary(info), rejected=danger, paid=accent
interface StatusStyle {
  badge: string;
  dot: string;
  label: string;
  chip: 'neutral' | 'primary' | 'success' | 'error' | 'accent' | 'warning';
  /** Left border accent color — makes status scannable at a glance */
  borderAccent: string;
}

export const CLAIM_STATUS_STYLES: Record<ClaimStatus, StatusStyle> = {
  submitted: { badge: 'bg-neutral-100 text-neutral-600 border-neutral-200',  dot: 'bg-neutral-400',             label: 'Submitted',    chip: 'neutral', borderAccent: 'border-l-neutral-300'  },
  reviewing: { badge: 'bg-warning-50 text-warning-700 border-warning-200',   dot: 'bg-warning-500 animate-pulse', label: 'Under Review', chip: 'warning', borderAccent: 'border-l-warning-400'  },
  approved:  { badge: 'bg-primary-50 text-primary-700 border-primary-200',  dot: 'bg-primary-500',             label: 'Approved',     chip: 'primary', borderAccent: 'border-l-primary-400'  },
  rejected:  { badge: 'bg-danger-50 text-danger-600 border-danger-200',     dot: 'bg-danger-500',              label: 'Rejected',     chip: 'error',   borderAccent: 'border-l-danger-400'   },
  paid:      { badge: 'bg-accent-50 text-accent-700 border-accent-200',     dot: 'bg-accent-500',              label: 'Paid',         chip: 'accent',  borderAccent: 'border-l-accent-400'   },
};

interface ClaimCardProps { claim: Claim; onClick?: () => void; }

export function ClaimCard({ claim, onClick }: ClaimCardProps) {
  const Icon = CLAIM_ICONS[claim.type] ?? Stethoscope;
  const s = CLAIM_STATUS_STYLES[claim.status];

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={cn(
        'group bg-white rounded-2xl border border-neutral-150 border-l-4 shadow-card p-4 flex items-center gap-3.5 transition-shadow duration-200',
        s.borderAccent,
        onClick && 'cursor-pointer hover:shadow-card-hover active:scale-[0.99]',
      )}
    >
      <IconChip
        icon={<Icon className="w-5 h-5" />}
        color={s.chip}
        size="lg"
        className="rounded-2xl"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-neutral-900 truncate">{CLAIM_LABELS[claim.type] ?? claim.type}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{formatRelativeTime(claim.created_at)}</p>
      </div>
      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
        <p className="font-bold text-sm text-neutral-900">{formatCurrency(claim.amount)}</p>
        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border', s.badge)}>
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', s.dot)} />
          {s.label}
        </span>
      </div>
      {onClick && <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0 group-hover:text-neutral-400 transition-colors" />}
    </div>
  );
}
