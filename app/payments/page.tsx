'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { Badge } from '@/components/ui/Badge';
import { CurrencyDisplay, MetricNumber } from '@/components/ui/MetricNumber';
import { usePayments } from '@/hooks/usePayments';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { PaymentRecord, PaymentStatus, PaymentMethod } from '@/types';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import {
  CheckCircle2, XCircle, Clock, RefreshCw,
  Smartphone, CreditCard, Building2,
  ShieldCheck, AlertCircle, ToggleRight, ToggleLeft,
  ChevronRight,
} from 'lucide-react';

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PaymentStatus, {
  label: string;
  icon: typeof CheckCircle2;
  chip: 'success' | 'error' | 'warning' | 'neutral';
  border: string;
}> = {
  success:  { label: 'Paid',      icon: CheckCircle2, chip: 'success', border: 'border-accent-200'  },
  failed:   { label: 'Failed',    icon: XCircle,      chip: 'error',   border: 'border-danger-200'  },
  pending:  { label: 'Pending',   icon: Clock,        chip: 'warning', border: 'border-warning-200' },
  refunded: { label: 'Refunded',  icon: RefreshCw,    chip: 'neutral', border: 'border-neutral-200'   },
};

const METHOD_CONFIG: Record<PaymentMethod, { label: string; icon: typeof Smartphone; color: string }> = {
  mtn_momo:     { label: 'MTN MoMo',    icon: Smartphone,  color: 'text-yellow-600' },
  airtel_money: { label: 'Airtel Money',icon: Smartphone,  color: 'text-red-500'    },
  card:         { label: 'Card',        icon: CreditCard,  color: 'text-neutral-600'  },
  bank:         { label: 'Bank',        icon: Building2,   color: 'text-primary-700'},
};

// ── Payment row ───────────────────────────────────────────────────────────────

function PaymentRow({ payment }: { payment: PaymentRecord }) {
  const st = STATUS_CONFIG[payment.status];
  const mt = METHOD_CONFIG[payment.method];
  const StIcon = st.icon;
  const MtIcon = mt.icon;

  return (
    <div className={cn(
      'bg-white rounded-2xl border shadow-card p-4 flex items-center gap-4',
      st.border,
    )}>
      <IconChip icon={<StIcon className="w-5 h-5" />} color={st.chip} size="lg" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-neutral-900 text-[14px] leading-tight truncate">{payment.description}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
            <MtIcon className={cn('w-3 h-3', mt.color)} />
            {mt.label}
          </span>
          <span className="text-neutral-200 text-[10px]">·</span>
          <span className="text-[11px] text-neutral-400">{formatDate(payment.created_at)}</span>
        </div>
      </div>

      {/* Amount + status */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <p className={cn('font-bold text-[15px]', payment.status === 'failed' ? 'text-danger-500 line-through' : 'text-neutral-900')}>
          {formatCurrency(payment.amount)}
        </p>
        <Badge variant={st.chip === 'error' ? 'error' : st.chip === 'success' ? 'success' : st.chip === 'warning' ? 'warning' : 'neutral'}>
          {st.label}
        </Badge>
      </div>
    </div>
  );
}

// ── Subscription management card ─────────────────────────────────────────────

function SubscriptionManageCard() {
  const { activeSubscription } = useSubscriptions();

  if (!activeSubscription) return null;

  const plan = activeSubscription.plan;
  const isActive = activeSubscription.status === 'active';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-900 p-6 md:p-8 text-white mb-6">
      {/* Subtle grid + glow — same textured-navy language used across the app */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(500px 260px at 100% 0%, rgba(20,184,166,0.16), transparent 60%)' }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Active Plan</p>
          </div>
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm shrink-0',
            isActive
              ? 'bg-accent-500/20 border-accent-400/30 text-accent-300'
              : 'bg-danger-500/20 border-danger-400/30 text-danger-300',
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-accent-400 animate-pulse' : 'bg-danger-400')} />
            {isActive ? 'Active' : 'Expired'}
          </span>
        </div>

        <p className="font-display font-medium text-3xl md:text-4xl mb-8">{plan?.name}</p>

        <div className="flex flex-wrap items-end gap-x-10 gap-y-6 pt-6 border-t border-white/10 mb-6">
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1.5">Monthly</p>
            <CurrencyDisplay amount={plan?.price ?? 0} size="lg" color="inverse" />
          </div>
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1.5">Next billing</p>
            <p className="text-sm font-semibold text-white/80">{formatDate(activeSubscription.end_date)}</p>
          </div>
        </div>

        {/* Auto-renew toggle (UI only for now) */}
        <AutoRenewToggle />
      </div>
    </div>
  );
}

function AutoRenewToggle() {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-white/10">
      <div>
        <p className="text-sm font-semibold">Auto-renew</p>
        <p className="text-white/40 text-xs mt-0.5">Automatically renew at next billing date</p>
      </div>
      <div className="text-accent-400">
        <ToggleRight className="w-8 h-8" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const { payments, loading } = usePayments();

  const successCount = payments.filter((p) => p.status === 'success').length;
  const failedCount = payments.filter((p) => p.status === 'failed').length;
  const totalPaid = payments
    .filter((p) => p.status === 'success')
    .reduce((s, p) => s + p.amount, 0);

  return (
    <AppShell title="Payments">
      <div className="max-w-lg md:max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display font-medium text-4xl text-neutral-900 tracking-[-0.02em] mb-1.5">Payments</h1>
        <p className="text-neutral-500 text-base">
          Subscription billing &amp; history
        </p>
      </div>

      {/* Subscription card */}
      <SubscriptionManageCard />

      {/* Stats — one bordered bar, dividers instead of three separate cards */}
      {!loading && payments.length > 0 && (
        <div className="grid grid-cols-3 rounded-2xl border border-neutral-150 bg-white shadow-card mb-6 overflow-hidden">
          <div className="p-5">
            <p className="text-[11px] text-neutral-400 uppercase tracking-wide font-medium mb-2">Total paid</p>
            <CurrencyDisplay amount={totalPaid} size="md" />
          </div>
          <div className="p-5 border-l border-neutral-150">
            <p className="text-[11px] text-accent-600 uppercase tracking-wide font-medium mb-2">Success</p>
            <MetricNumber value={successCount} size="md" color="accent" />
          </div>
          <div className="p-5 border-l border-neutral-150">
            <p className="text-[11px] text-danger-500 uppercase tracking-wide font-medium mb-2">Failed</p>
            <MetricNumber value={failedCount} size="md" className="text-danger-600" />
          </div>
        </div>
      )}

      {/* Payment list */}
      <div className="mb-4">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Transaction History</h2>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-100 shadow-card p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-neutral-100 rounded w-3/4" />
                    <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  </div>
                  <div className="w-16 h-5 bg-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <Card padding="none" className="overflow-hidden">
            <div className="h-1.5 w-full bg-accent-500" />
            <div className="flex flex-col items-center py-12 text-center gap-3 px-6">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-neutral-300" />
              </div>
              <div>
                <p className="font-display font-bold text-neutral-700 mb-1">No payments yet</p>
                <p className="text-sm text-neutral-400 max-w-[200px] mx-auto leading-snug">
                  Your billing history will appear here once you have a plan.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <PaymentRow key={p.id} payment={p} />
            ))}
          </div>
        )}
      </div>

      {/* Failed payment notice */}
      {failedCount > 0 && (
        <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-danger-700">
              {failedCount} payment{failedCount > 1 ? 's' : ''} failed
            </p>
            <p className="text-xs text-danger-500 mt-0.5 leading-snug">
              Please update your payment method to avoid interruption to your coverage.
            </p>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
