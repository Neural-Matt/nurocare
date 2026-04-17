'use client';

import { Claim, ClaimStatus } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { ChevronRight, Stethoscope, Pill, FlaskConical, Building2, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

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

// submitted=gray, reviewing=blue, approved=green, rejected=red, paid=teal
interface StatusStyle {
  badge: string;
  dot: string;
  label: string;
  iconBg: string;
  iconColor: string;
  /** Left border accent color — makes status scannable at a glance */
  borderAccent: string;
}

export const CLAIM_STATUS_STYLES: Record<ClaimStatus, StatusStyle> = {
  submitted: { badge: 'bg-slate-100 text-slate-600 border-slate-200',       dot: 'bg-slate-400',              label: 'Submitted',    iconBg: 'bg-slate-50',   iconColor: 'text-slate-500',  borderAccent: 'border-l-slate-300'    },
  reviewing: { badge: 'bg-blue-50 text-blue-700 border-blue-200',           dot: 'bg-blue-500 animate-pulse', label: 'Under Review', iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',   borderAccent: 'border-l-blue-400'     },
  approved:  { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',  dot: 'bg-emerald-500',            label: 'Approved',     iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',borderAccent: 'border-l-emerald-400'  },
  rejected:  { badge: 'bg-red-50 text-red-600 border-red-200',              dot: 'bg-red-500',                label: 'Rejected',     iconBg: 'bg-red-50',     iconColor: 'text-red-500',    borderAccent: 'border-l-red-400'      },
  paid:      { badge: 'bg-accent-50 text-accent-700 border-accent-200',     dot: 'bg-accent-500',             label: 'Paid',         iconBg: 'bg-accent-50',  iconColor: 'text-accent-600', borderAccent: 'border-l-accent-400'   },
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
        'group bg-white rounded-2xl border border-slate-100 border-l-4 shadow-card p-4 flex items-center gap-3.5 transition-all duration-200',
        s.borderAccent,
        onClick && 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.99]',
      )}
    >
      <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center shrink-0', s.iconBg)}>
        <Icon className={cn('w-5 h-5', s.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-900 truncate">{CLAIM_LABELS[claim.type] ?? claim.type}</p>
        <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(claim.created_at)}</p>
      </div>
      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
        <p className="font-bold text-sm text-slate-900">{formatCurrency(claim.amount)}</p>
        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border', s.badge)}>
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', s.dot)} />
          {s.label}
        </span>
      </div>
      {onClick && <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-400 transition-colors" />}
    </div>
  );
}
