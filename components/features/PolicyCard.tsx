'use client';

import { Subscription } from '@/types';
import { Badge, subscriptionStatusBadge } from '@/components/ui/Badge';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';
import { Hash, Calendar } from 'lucide-react';

interface PolicyCardProps {
  subscription: Subscription;
  userName?: string;
}

export function PolicyCard({ subscription, userName }: PolicyCardProps) {
  const plan = subscription.plan;
  const badge = subscriptionStatusBadge(subscription.status);

  return (
    <div className="rounded-2xl bg-primary-800 p-5 text-white">
      {/* Header row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">NuroCare</p>
          <p className="text-xl font-display font-semibold mt-0.5">{plan?.name ?? 'Health Plan'}</p>
        </div>
        <Badge
          variant={badge.variant}
          className="bg-white/15 text-white border-white/25 text-xs"
        >
          {badge.label}
        </Badge>
      </div>

      {/* Policy holder */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-accent-500/25 border border-accent-400/30 flex items-center justify-center font-bold text-sm text-white">
          {userName ? getInitials(userName) : 'NC'}
        </div>
        <div>
          <p className="text-white/50 text-xs">Policy Holder</p>
          <p className="font-semibold text-sm">{userName ?? 'Member'}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.07] rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/45 text-xs mb-1">
            <Hash className="w-3 h-3" /> Policy No.
          </div>
          <p className="font-mono text-xs font-semibold tracking-wide">{subscription.policy_number}</p>
        </div>
        <div className="bg-white/[0.07] rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/45 text-xs mb-1">
            <Calendar className="w-3 h-3" /> Valid Until
          </div>
          <p className="text-xs font-semibold">{formatDate(subscription.end_date)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
        <p className="text-white/50 text-xs">Monthly Premium</p>
        <p className="font-display font-semibold text-lg text-accent-300">{formatCurrency(plan?.price ?? 0)}</p>
      </div>
    </div>
  );
}
