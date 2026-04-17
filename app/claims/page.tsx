'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ClaimCard } from '@/components/features/ClaimCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ListSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { useClaims } from '@/hooks/useClaims';
import { useRouter } from 'next/navigation';
import { ClaimStatus } from '@/types';
import { Plus, FileText, Activity, CreditCard, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STATUS_TABS: { label: string; value: ClaimStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Approved', value: 'approved' },
  { label: 'Paid', value: 'paid' },
  { label: 'Rejected', value: 'rejected' },
];

export default function ClaimsPage() {
  const { claims, loading } = useClaims();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ClaimStatus | 'all'>('all');

  const filtered =
    activeTab === 'all' ? claims : claims.filter((c) => c.status === activeTab);

  const totalSubmitted = claims.reduce((s, c) => s + c.amount, 0);
  const totalPaid = claims
    .filter((c) => c.status === 'paid')
    .reduce((s, c) => s + c.amount, 0);
  const pending = claims.filter((c) =>
    ['submitted', 'reviewing', 'approved'].includes(c.status),
  ).length;

  return (
    <AppShell title="My Claims">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-xl text-primary-800">My Claims</h1>
          <p className="text-slate-400 text-xs font-medium mt-0.5">
            {loading ? '...' : `${claims.length} total claim${claims.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button
          size="sm"
          variant="gradient"
          onClick={() => router.push('/claims/new')}
          leadingIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Claim
        </Button>
      </div>

      {/* ── Stats bar ── */}
      {!loading && claims.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5" />
              <p className="text-[11px] font-medium uppercase tracking-wide">Total</p>
            </div>
            <p className="font-display font-bold text-sm text-primary-800">
              {formatCurrency(totalSubmitted)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <CreditCard className="w-3.5 h-3.5" />
              <p className="text-[11px] font-medium uppercase tracking-wide">Paid</p>
            </div>
            <p className="font-display font-bold text-sm text-accent-600">
              {formatCurrency(totalPaid)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <p className="text-[11px] font-medium uppercase tracking-wide">Pending</p>
            </div>
            <p className="font-display font-bold text-sm text-warning-600">
              {pending}
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 space-y-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      )}

      {/* Status filter tabs */}
      {!loading && claims.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
          {STATUS_TABS.filter(
            (t) => t.value === 'all' || claims.some((c) => c.status === t.value),
          ).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 shrink-0',
                activeTab === tab.value
                  ? 'bg-primary-800 text-white border-primary-800 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-primary-300 hover:text-primary-700',
              )}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  {claims.filter((c) => c.status === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <ListSkeleton count={4} />
      ) : claims.length === 0 ? (
        <Card padding="none" className="overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-accent-400 via-primary-600 to-accent-500" />
          <div className="flex flex-col items-center py-14 text-center gap-4 px-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center">
              <FileText className="w-9 h-9 text-slate-300" />
            </div>
            <div>
              <p className="font-display font-bold text-slate-700 text-lg mb-1">
                No claims yet
              </p>
              <p className="text-sm text-slate-400 max-w-[220px] mx-auto leading-snug">
                Submit a claim for consultations, medications or lab tests.
              </p>
            </div>
            <Button
              variant="gradient"
              onClick={() => router.push('/claims/new')}
              leadingIcon={<Plus className="w-4 h-4" />}
            >
              Make Your First Claim
            </Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card padding="lg" className="text-center py-10">
          <p className="text-slate-400 font-medium">No {activeTab} claims</p>
          <p className="text-sm text-slate-300 mt-1">Try a different filter</p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onClick={() => router.push(`/claims/${claim.id}`)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
