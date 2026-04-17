'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
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
  bg: string;
  text: string;
  border: string;
}> = {
  success:  { label: 'Paid',      icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  failed:   { label: 'Failed',    icon: XCircle,      bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200'     },
  pending:  { label: 'Pending',   icon: Clock,        bg: 'bg-warning-50', text: 'text-warning-600', border: 'border-warning-200' },
  refunded: { label: 'Refunded',  icon: RefreshCw,    bg: 'bg-slate-50',   text: 'text-slate-500',   border: 'border-slate-200'   },
};

const METHOD_CONFIG: Record<PaymentMethod, { label: string; icon: typeof Smartphone; color: string }> = {
  mtn_momo:     { label: 'MTN MoMo',    icon: Smartphone,  color: 'text-yellow-600' },
  airtel_money: { label: 'Airtel Money',icon: Smartphone,  color: 'text-red-500'    },
  card:         { label: 'Card',        icon: CreditCard,  color: 'text-slate-600'  },
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
      {/* Status icon */}
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', st.bg)}>
        <StIcon className={cn('w-5 h-5', st.text)} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-[14px] leading-tight truncate">{payment.description}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <MtIcon className={cn('w-3 h-3', mt.color)} />
            {mt.label}
          </span>
          <span className="text-slate-200 text-[10px]">·</span>
          <span className="text-[11px] text-slate-400">{formatDate(payment.created_at)}</span>
        </div>
      </div>

      {/* Amount + status */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <p className={cn('font-bold text-[15px]', payment.status === 'failed' ? 'text-red-500 line-through' : 'text-slate-900')}>
          {formatCurrency(payment.amount)}
        </p>
        <span className={cn(
          'text-[10px] font-semibold px-2 py-0.5 rounded-full',
          st.bg, st.text,
        )}>
          {st.label}
        </span>
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
    <div className="relative overflow-hidden rounded-2xl bg-primary-800 p-5 text-white shadow-xl mb-6">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-accent-500/20 blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Active Plan</p>
            </div>
            <p className="text-xl font-display font-bold">{plan?.name}</p>
          </div>
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm',
            isActive
              ? 'bg-accent-500/20 border-accent-400/30 text-accent-300'
              : 'bg-red-500/20 border-red-400/30 text-red-300',
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-accent-400 animate-pulse' : 'bg-red-400')} />
            {isActive ? 'Active' : 'Expired'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <p className="text-white/40 text-[11px] mb-1">Next billing</p>
            <p className="text-sm font-semibold">{formatDate(activeSubscription.end_date)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <p className="text-white/40 text-[11px] mb-1">Monthly</p>
            <p className="text-sm font-bold text-accent-400">{formatCurrency(plan?.price ?? 0)}</p>
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
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-xl text-primary-800">Payments</h1>
        <p className="text-slate-400 text-xs font-medium mt-0.5">
          Subscription billing & history
        </p>
      </div>

      {/* Subscription card */}
      <SubscriptionManageCard />

      {/* Stats */}
      {!loading && payments.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
            <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium mb-1">Total paid</p>
            <p className="font-display font-bold text-sm text-primary-800">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
            <p className="text-[11px] text-emerald-600 uppercase tracking-wide font-medium mb-1">Success</p>
            <p className="font-display font-bold text-sm text-emerald-700">{successCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
            <p className="text-[11px] text-red-500 uppercase tracking-wide font-medium mb-1">Failed</p>
            <p className="font-display font-bold text-sm text-red-600">{failedCount}</p>
          </div>
        </div>
      )}

      {/* Payment list */}
      <div className="mb-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Transaction History</h2>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                  <div className="w-16 h-5 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <Card padding="none" className="overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-accent-400 to-primary-600" />
            <div className="flex flex-col items-center py-12 text-center gap-3 px-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-slate-300" />
              </div>
              <div>
                <p className="font-display font-bold text-slate-700 mb-1">No payments yet</p>
                <p className="text-sm text-slate-400 max-w-[200px] mx-auto leading-snug">
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
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {failedCount} payment{failedCount > 1 ? 's' : ''} failed
            </p>
            <p className="text-xs text-red-500 mt-0.5 leading-snug">
              Please update your payment method to avoid interruption to your coverage.
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
