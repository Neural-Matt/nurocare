'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useClaims } from '@/hooks/useClaims';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { useFacilities } from '@/hooks/useFacilities';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { HealthInsightCard } from '@/components/ui/HealthInsightCard';
import { IconChip } from '@/components/ui/IconChip';
import { DonutChart } from '@/components/ui/DonutChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { CurrencyDisplay, MetricNumber } from '@/components/ui/MetricNumber';
import { Stagger, Reveal, RevealOnScroll, springs } from '@/components/ui/motion';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Plus,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Activity,
  ArrowUpRight,
  CreditCard,
  AlertCircle,
  MessageCircle,
  Pill,
  Users,
  Building2,
  Star,
  Clock,
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Find Care',    icon: MapPin,        color: 'warning', href: '/facilities'   },
  { label: 'New Claim',    icon: Plus,          color: 'accent',  href: '/claims/new'   },
  { label: 'Telemedicine', icon: MessageCircle, color: 'primary', href: '/telemedicine' },
  { label: 'Drugs',        icon: Pill,          color: 'neutral', href: '/drugs'        },
] as const;

function GreetingHeader({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = useState('Hello');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
      className="mb-8 md:mb-10 flex items-end justify-between gap-4"
    >
      <div>
        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-[0.16em] mb-1.5">{greeting}</p>
        <h1 className="text-[2.25rem] md:text-5xl font-display font-medium text-neutral-900 leading-[0.98] tracking-[-0.02em]">
          {firstName}
        </h1>
      </div>
      <span className="text-3xl md:text-4xl mb-0.5 hidden sm:block">👋</span>
    </motion.div>
  );
}

function PolicyCardSkeleton() {
  return (
    <div className="rounded-2xl bg-primary-800 p-5 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 bg-white/20" />
          <Skeleton className="h-6 w-36 bg-white/20" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16 rounded-xl bg-white/20" />
        <Skeleton className="h-16 rounded-xl bg-white/20" />
      </div>
    </div>
  );
}

function ActivePolicyCard({
  subscription,
}: {
  subscription: NonNullable<ReturnType<typeof useSubscriptions>['activeSubscription']>;
}) {
  const plan = subscription.plan;
  const isExpired = subscription.status === 'expired' || subscription.status === 'cancelled';
  const daysLeft = subscription.end_date ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-900 text-white p-6 md:p-8">
      {/* Textured depth — same grain/glow language as the marketing hero, so the app doesn't feel like a different product */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(600px 320px at 100% 0%, rgba(20,184,166,0.16), transparent 60%)',
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Active Policy</p>
          </div>
          <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0', isExpired ? 'bg-danger-500/15 border-danger-400/25 text-danger-300' : 'bg-accent-500/15 border-accent-400/25 text-accent-300')}>
            <span className={cn('w-1.5 h-1.5 rounded-full', isExpired ? 'bg-danger-400' : 'bg-accent-400')} />
            {isExpired ? 'Expired' : 'Active'}
          </span>
        </div>

        <p className="font-display font-medium text-3xl md:text-4xl mb-8 leading-tight">{plan?.name ?? 'Health Plan'}</p>

        <div className="flex flex-wrap items-end justify-between gap-6 pt-6 border-t border-white/10">
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1.5">Monthly Premium</p>
            <CurrencyDisplay amount={plan?.price ?? 0} size="lg" color="inverse" />
          </div>
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1.5">Renews In</p>
            <MetricNumber value={Math.max(daysLeft, 0)} unit="days" size="lg" color="inverse" />
          </div>
          <div className="text-right ml-auto">
            <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1.5">Policy No.</p>
            <p className="font-mono text-sm font-medium text-white/80">{subscription.policy_number}</p>
            <p className="text-white/40 text-xs mt-0.5">Expires {formatDate(subscription.end_date)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionsGrid({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <section className="mb-8">
      <Stagger
        className="grid grid-cols-4 rounded-2xl border border-neutral-150 bg-white overflow-hidden shadow-card"
        gap={0.05}
      >
        {QUICK_ACTIONS.map(({ label, icon: Icon, color, href }, i) => (
          <Reveal key={label}>
            <button
              onClick={() => onNavigate(href)}
              className={cn(
                'group w-full flex flex-col items-center gap-2 py-5 transition-colors duration-150 hover:bg-neutral-25 focus:outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-800',
                i > 0 && 'border-l border-neutral-150',
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-150 group-hover:-translate-y-0.5',
                  color === 'warning' ? 'text-warning-500' :
                  color === 'accent'  ? 'text-accent-500' :
                  color === 'primary' ? 'text-primary-700' : 'text-neutral-500',
                )}
                strokeWidth={1.75}
              />
              <p className="text-[10px] font-semibold text-neutral-600 text-center leading-tight">{label}</p>
            </button>
          </Reveal>
        ))}
      </Stagger>
    </section>
  );
}

function MetricsGrid({ claims, loading }: { claims: ReturnType<typeof useClaims>['claims']; loading: boolean }) {
  const totalSubmitted = claims.reduce((s, c) => s + c.amount, 0);
  const totalPaid = claims.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const pending = claims.filter((c) => ['submitted', 'reviewing', 'approved'].includes(c.status)).length;

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <StatCard
        label="Submitted"
        value={formatCurrency(totalSubmitted)}
        icon={<Activity className="w-4 h-4" />}
        variant="default"
        size="md"
      />
      <StatCard
        label="Paid"
        value={formatCurrency(totalPaid)}
        icon={<CreditCard className="w-4 h-4" />}
        variant="success"
        size="md"
      />
      <StatCard
        label="Pending"
        value={pending}
        icon={<Clock className="w-4 h-4" />}
        variant="warning"
        size="md"
      />
    </div>
  );
}

// Colors mirror the semantic mapping in claimStatusBadge() so a claim's
// color means the same thing everywhere in the app, not just on this chart.
const CLAIM_STATUS_CHART: { key: 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'paid'; label: string; stroke: string; dot: string }[] = [
  { key: 'paid',      label: 'Paid',        stroke: 'stroke-accent-500',  dot: 'bg-accent-500'  },
  { key: 'approved',  label: 'Approved',    stroke: 'stroke-primary-700', dot: 'bg-primary-700' },
  { key: 'reviewing', label: 'In Review',   stroke: 'stroke-warning-500', dot: 'bg-warning-500' },
  { key: 'submitted', label: 'Submitted',   stroke: 'stroke-neutral-300', dot: 'bg-neutral-300' },
  { key: 'rejected',  label: 'Rejected',    stroke: 'stroke-danger-500',  dot: 'bg-danger-500'  },
];

function ClaimsBreakdownWidget({ claims }: { claims: ReturnType<typeof useClaims>['claims'] }) {
  const router = useRouter();
  const counts = CLAIM_STATUS_CHART.map((s) => ({
    ...s,
    value: claims.filter((c) => c.status === s.key).length,
  }));
  const nonZero = counts.filter((s) => s.value > 0);

  if (claims.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Claims Activity</h2>
      <Card padding="lg">
        <div className="flex items-center gap-5">
          <DonutChart
            segments={counts.map((s) => ({ label: s.label, value: s.value, colorClass: s.stroke }))}
            size={96}
            strokeWidth={12}
            centerValue={String(claims.length)}
            centerLabel="total"
          />
          <div className="flex-1 min-w-0 space-y-2">
            {nonZero.map((s) => (
              <div key={s.key} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-neutral-600">
                  <span className={cn('w-2 h-2 rounded-full shrink-0', s.dot)} />
                  {s.label}
                </span>
                <span className="font-semibold text-neutral-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => router.push('/claims')}
          className="w-full mt-4 pt-3 border-t border-neutral-100 text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors flex items-center justify-center gap-1"
        >
          View all claims <ChevronRight className="w-3 h-3" />
        </button>
      </Card>
    </section>
  );
}

interface Insight {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: 'info' | 'success' | 'warning' | 'tip';
  action?: { label: string; href: string };
}

/**
 * Real, data-driven insights — replaces a previous widget that showed
 * hardcoded step/hydration numbers with no tracking behind them. Everything
 * here is derived from the member's actual subscription and claims.
 */
function InsightsSection({
  subscription,
  claims,
}: {
  subscription: ReturnType<typeof useSubscriptions>['activeSubscription'];
  claims: ReturnType<typeof useClaims>['claims'];
}) {
  const router = useRouter();
  const insights: Insight[] = [];

  if (subscription) {
    const daysLeft = subscription.end_date
      ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;
    const planName = subscription.plan?.name ?? 'plan';

    if (daysLeft !== null && daysLeft >= 0 && daysLeft <= 30) {
      insights.push({
        icon: <Calendar className="w-4 h-4" />,
        title: 'Renewal coming up',
        description: `Your ${planName} renews in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Renew early to avoid a gap in cover.`,
        variant: 'warning',
        action: { label: 'View plan', href: '/plans' },
      });
    } else if (daysLeft !== null && daysLeft >= 0) {
      insights.push({
        icon: <ShieldCheck className="w-4 h-4" />,
        title: "You're covered",
        description: `Your ${planName} is active, with ${daysLeft} days left before renewal.`,
        variant: 'tip',
      });
    }
  }

  const inReview = claims.filter((c) => c.status === 'submitted' || c.status === 'reviewing').length;
  if (inReview > 0) {
    insights.push({
      icon: <Activity className="w-4 h-4" />,
      title: inReview === 1 ? 'A claim is being reviewed' : `${inReview} claims are being reviewed`,
      description: "We'll notify you the moment there's an update — no need to check back.",
      variant: 'info',
      action: { label: 'View claims', href: '/claims' },
    });
  }

  const approved = claims.filter((c) => c.status === 'approved').length;
  if (approved > 0) {
    insights.push({
      icon: <CreditCard className="w-4 h-4" />,
      title: approved === 1 ? 'A claim was approved' : `${approved} claims were approved`,
      description: 'Approved claims are queued for payout to your registered payment method.',
      variant: 'success',
      action: { label: 'View claims', href: '/claims' },
    });
  }

  if (insights.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">NuroCare Insights</h2>
      <Stagger className="space-y-2">
        {insights.map((insight) => (
          <Reveal key={insight.title}>
            <HealthInsightCard
              icon={insight.icon}
              title={insight.title}
              description={insight.description}
              variant={insight.variant}
              action={insight.action ? { label: insight.action.label, onClick: () => router.push(insight.action!.href) } : undefined}
            />
          </Reveal>
        ))}
      </Stagger>
    </section>
  );
}

function FamilyOverviewSection() {
  const { members, loading } = useFamilyMembers();
  const router = useRouter();

  if (!loading && members.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Family Coverage</h2>
        <button
          onClick={() => router.push('/family')}
          className="text-xs text-accent-600 font-semibold flex items-center gap-0.5 hover:text-accent-500 transition-colors"
        >
          Manage <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      {loading ? (
        <Skeleton className="h-20 rounded-2xl" />
      ) : (
        <Card padding="md">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-accent-600" />
            <p className="text-sm font-semibold text-primary-800">{members.length} family member{members.length !== 1 ? 's' : ''} covered</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {members.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center gap-2 bg-accent-50 rounded-xl px-3 py-2 border border-accent-100">
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold', m.gender === 'female' ? 'bg-accent-400' : 'bg-primary-400')}>
                  {getInitials(m.name)}
                </div>
                <p className="text-xs font-semibold text-primary-800">{m.name.split(' ')[0]}</p>
              </div>
            ))}
            {members.length > 3 && (
              <div className="flex items-center gap-2 bg-neutral-100 rounded-xl px-3 py-2 border border-neutral-200">
                <p className="text-xs font-semibold text-neutral-600">+{members.length - 3} more</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </section>
  );
}

function NearbyFacilitiesSection() {
  const router = useRouter();
  const { facilities, loading } = useFacilities();
  const nearby = facilities.filter((f) => f.open_now).slice(0, 2);

  if (!loading && nearby.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Nearby Care</h2>
        <button
          onClick={() => router.push('/facilities')}
          className="text-xs text-accent-600 font-semibold flex items-center gap-0.5 hover:text-accent-500 transition-colors"
        >
          See all <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-2">
          {nearby.map((f) => (
            <button key={f.id} onClick={() => router.push(`/facilities/${f.id}`)} className="w-full text-left">
              <Card padding="none" interactive hover>
                <div className="flex items-center gap-3 p-3">
                  <IconChip
                    icon={<Building2 className="w-5 h-5" />}
                    color={f.type === 'hospital' ? 'primary' : f.type === 'pharmacy' ? 'success' : 'accent'}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-800 truncate">{f.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500">
                      <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{f.distance_km} km</span>
                      <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-warning-400 text-warning-400" />{f.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    <span className="text-[10px] font-semibold text-accent-600">Open</span>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const { activeSubscription, loading: subLoading } = useSubscriptions();
  const { claims, loading: claimsLoading } = useClaims();
  const router = useRouter();

  return (
    <AppShell>
      <div className="max-w-lg md:max-w-6xl mx-auto">
        <GreetingHeader firstName={profile?.full_name?.split(' ')[0] ?? 'there'} />

        <div className="md:grid md:grid-cols-3 md:gap-6 md:items-start">
          {/* ── Main column ── */}
          <div className="md:col-span-2">
            {subLoading ? (
              <div className="mb-6"><PolicyCardSkeleton /></div>
            ) : activeSubscription ? (
              <RevealOnScroll className="mb-6">
                <ActivePolicyCard subscription={activeSubscription} />
              </RevealOnScroll>
            ) : (
              <Card variant="navy" padding="lg" className="mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-white/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">No Active Plan</p>
                    <p className="text-lg font-display font-semibold mb-2">Get Covered Today</p>
                    <p className="text-white/70 text-sm mb-4">Browse our plans and start protecting your health.</p>
                    <Button variant="teal" size="sm" onClick={() => router.push('/plans')} trailingIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                      Browse Plans
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <QuickActionsGrid onNavigate={(href) => router.push(href)} />

            {claims.length > 0 && <MetricsGrid claims={claims} loading={claimsLoading} />}

            <InsightsSection subscription={activeSubscription} claims={claims} />
          </div>

          {/* ── Side rail (desktop) ── */}
          <div className="md:col-span-1">
            <ClaimsBreakdownWidget claims={claims} />
            <FamilyOverviewSection />
            <NearbyFacilitiesSection />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
