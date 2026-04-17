'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ClaimTimeline } from '@/components/features/ClaimTimeline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useClaims } from '@/hooks/useClaims';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { CLAIM_STATUS_STYLES, CLAIM_LABELS } from '@/components/features/ClaimCard';
import { Claim } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ArrowLeft, ExternalLink, Receipt, Calendar, Tag, FileText,
  Stethoscope, Pill, FlaskConical, Building2, Smile, Info, UserRound, RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CLAIM_ICONS = {
  consultation:    Stethoscope,
  medication:      Pill,
  lab:             FlaskConical,
  hospitalization: Building2,
  dental:          Smile,
};

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ClaimDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { claims, loading, resubmitClaim } = useClaims();
  const { members } = useFamilyMembers();
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [resubmitting, setResubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      const found = claims.find((c) => c.id === id);
      setClaim(found ?? null);
    }
  }, [claims, loading, id]);

  const statusStyle = claim ? CLAIM_STATUS_STYLES[claim.status] : null;
  const ClaimIcon = claim ? (CLAIM_ICONS[claim.type] ?? FileText) : FileText;
  const claimMember = claim?.member_id ? members.find((m) => m.id === claim.member_id) : null;

  async function handleResubmit() {
    if (!claim) return;
    setResubmitting(true);
    await resubmitClaim(claim.id);
    setResubmitting(false);
    // Reflect updated status in local state
    setClaim((c) => c ? { ...c, status: 'submitted' } : c);
  }

  return (
    <AppShell title="Claim Details">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary-800 font-medium mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to claims
      </button>

      {loading || !claim ? (
        claim === null && !loading ? (
          <Card padding="lg" className="flex flex-col items-center py-12 text-center gap-3">
            <FileText className="w-12 h-12 text-slate-200" />
            <p className="font-semibold text-slate-500">Claim not found</p>
            <Button variant="outline" size="sm" onClick={() => router.replace('/claims')}>
              View all claims
            </Button>
          </Card>
        ) : (
          <ClaimDetailSkeleton />
        )
      ) : (
        <div className="space-y-4">

          {/* ── Hero summary card ── */}
          <Card padding="lg">
            {/* Type + Status */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', statusStyle!.iconBg)}>
                  <ClaimIcon className={cn('w-6 h-6', statusStyle!.iconColor)} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Claim Type</p>
                  <p className="font-display font-bold text-slate-900">
                    {CLAIM_LABELS[claim.type] ?? claim.type}
                  </p>
                  {claimMember && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      <UserRound className="w-3 h-3" />
                      {claimMember.name}
                    </span>
                  )}
                </div>
              </div>
              <span className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
                statusStyle!.badge,
              )}>
                <span className={cn('w-1.5 h-1.5 rounded-full', statusStyle!.dot)} />
                {statusStyle!.label}
              </span>
            </div>

            {/* Amount highlight */}
            <div className="bg-gradient-to-br from-primary-800 to-primary-700 rounded-2xl p-4 mb-4 text-white">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">
                Claim Amount
              </p>
              <p className="font-display font-bold text-3xl">
                {formatCurrency(claim.amount)}
              </p>
              <p className="text-white/50 text-xs mt-1.5">ZMW</p>
            </div>

            {/* Detail rows */}
            <div className="space-y-3">
              <DetailRow icon={Calendar} label="Date Submitted" value={formatDate(claim.created_at)} />
              <DetailRow icon={Tag}      label="Reference ID"  value={claim.id.slice(0, 16).toUpperCase()} />
            </div>

            {/* Notes */}
            {claim.notes && (
              <div className="mt-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Notes</p>
                <p className="text-sm text-slate-700 leading-relaxed">{claim.notes}</p>
              </div>
            )}

            {/* Receipt link */}
            {claim.receipt_url && (
              <a
                href={claim.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-sm text-accent-600 font-semibold hover:text-accent-700 transition-colors"
              >
                <Receipt className="w-4 h-4" />
                View Receipt
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            )}
          </Card>

          {/* ── What this status means ── */}
          {claim.status === 'rejected' && (
            <div className="rounded-2xl p-4 bg-red-50 border border-red-100 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700 mb-1">Claim Not Approved</p>
                  <p className="text-xs text-red-600 leading-snug">
                    This claim could not be approved after review. If you believe this is an error,
                    you can resubmit it for a second review or contact support with your reference ID.
                  </p>
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                fullWidth
                loading={resubmitting}
                onClick={handleResubmit}
                leadingIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Resubmit This Claim
              </Button>
            </div>
          )}

          {claim.status === 'reviewing' && (
            <div className="flex items-start gap-3 rounded-2xl p-4 bg-blue-50 border border-blue-100">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-700 mb-1">Currently Under Review</p>
                <p className="text-xs text-blue-600 leading-snug">
                  Our team is reviewing your claim. This usually takes 1–2 business days.
                  You will be notified as soon as there is an update.
                </p>
              </div>
            </div>
          )}

          {claim.status === 'approved' && (
            <div className="flex items-start gap-3 rounded-2xl p-4 bg-emerald-50 border border-emerald-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-700 mb-1">Approved — Payment Processing</p>
                <p className="text-xs text-emerald-600 leading-snug">
                  Great news! Your claim has been approved. Payment will be sent to your
                  registered account within 1–3 business days.
                </p>
              </div>
            </div>
          )}

          {claim.status === 'paid' && (
            <div className="flex items-start gap-3 rounded-2xl p-4 bg-accent-50 border border-accent-100">
              <div className="w-9 h-9 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-accent-700 mb-1">Payment Sent</p>
                <p className="text-xs text-accent-600 leading-snug">
                  The funds for this claim have been disbursed to your registered account.
                  Please allow 1–2 business days for the payment to reflect.
                </p>
              </div>
            </div>
          )}

          {/* ── Timeline card ── */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <p className="font-display font-bold text-slate-800">Claim Progress</p>
              <span className="text-xs text-slate-400 font-medium">
                {claim.status === 'paid' ? 'Completed' : 'In progress'}
              </span>
            </div>
            <ClaimTimeline claim={claim} />
          </Card>

          {/* ── Actions ── */}
          {claim.status === 'rejected' && (
            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push('/claims/new')}
            >
              Submit a New Claim
            </Button>
          )}
        </div>
      )}
    </AppShell>
  );
}
