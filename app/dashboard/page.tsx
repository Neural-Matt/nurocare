'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useClaims } from '@/hooks/useClaims';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { HealthInsightCard } from '@/components/ui/HealthInsightCard';
import { IconChip } from '@/components/ui/IconChip';
import { DonutChart } from '@/components/ui/DonutChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { Stagger, Reveal, RevealOnScroll, springs } from '@/components/ui/motion';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MOCK_FACILITIES } from '@/lib/mock-facilities';
import {
  MapPin,
  Plus,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Hash,
  Activity,
  ArrowUpRight,
  CreditCard,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Pill,
  Users,
  Building2,
  Star,
  Droplet,
  Footprints,
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
      className="mb-6"
    >
      <p className="text-neutral-400 text-sm font-medium">{greeting},</p>
      <h1 className="text-3xl font-display font-bold text-primary-800 mt-1 leading-tight">
        {firstName} <span className="inline-block">👋</span>
      </h1>
      <p className="text-neutral-400 text-sm mt-1">Here's your health overview</p>
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
    <Card variant="navy" padding="lg">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-accent-400" />
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Active Policy</p>
          </div>
          <p className="text-2xl font-display font-semibold">{plan?.name ?? 'Health Plan'}</p>
        </div>
        <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border', isExpired ? 'bg-red-500/15 border-red-400/25 text-red-300' : 'bg-accent-500/15 border-accent-400/25 text-accent-300')}>
          <span className={cn('w-1.5 h-1.5 rounded-full', isExpired ? 'bg-red-400' : 'bg-accent-400')} />
          {isExpired ? 'Expired' : 'Active'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white/[0.07] rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 text-white/45 text-xs mb-2"><Hash className="w-3 h-3" />No.</div>
          <p className="font-mono text-xs font-semibold text-white/90 truncate">{subscription.policy_number}</p>
        </div>
        <div className="bg-white/[0.07] rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 text-white/45 text-xs mb-2"><Calendar className="w-3 h-3" />Expires</div>
          <p className="text-xs font-semibold text-white/90">{formatDate(subscription.end_date)}</p>
        </div>
        <div className="bg-white/[0.07] rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1 text-white/45 text-xs mb-2"><Clock className="w-3 h-3" />Days</div>
          <p className="text-xs font-semibold text-accent-300">{Math.max(daysLeft, 0)}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
        <p className="text-white/50 text-xs">Monthly Premium</p>
        <p className="font-display font-semibold text-lg text-accent-300">{formatCurrency(plan?.price ?? 0)}</p>
      </div>
    </Card>
  );
}

function QuickActionsGrid({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <section className="mb-6">
      <Stagger className="grid grid-cols-4 gap-2" gap={0.05}>
        {QUICK_ACTIONS.map(({ label, icon: Icon, color, href }) => (
          <Reveal key={label}>
            <button
              onClick={() => onNavigate(href)}
              className="group w-full flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 rounded-2xl"
            >
              <div className="w-full aspect-square rounded-2xl bg-white border border-neutral-150 flex items-center justify-center shadow-card transition-shadow duration-200 group-hover:shadow-card-hover">
                <IconChip icon={<Icon className="w-5 h-5" strokeWidth={1.75} />} color={color} size="lg" className="bg-transparent" />
              </div>
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

const CLAIM_STATUS_CHART: { key: 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'paid'; label: string; stroke: string; dot: string }[] = [
  { key: 'paid',      label: 'Paid',        stroke: 'stroke-accent-500',  dot: 'bg-accent-500'  },
  { key: 'approved',  label: 'Approved',    stroke: 'stroke-emerald-500', dot: 'bg-emerald-500' },
  { key: 'reviewing', label: 'In Review',   stroke: 'stroke-blue-500',    dot: 'bg-blue-500'    },
  { key: 'submitted', label: 'Submitted',   stroke: 'stroke-neutral-300', dot: 'bg-neutral-300' },
  { key: 'rejected',  label: 'Rejected',    stroke: 'stroke-red-500',     dot: 'bg-red-500'     },
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

function WellnessSection() {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Today's Wellness</h2>
      <Stagger className="space-y-2">
        <Reveal>
          <HealthInsightCard
            icon={<Footprints className="w-4 h-4" />}
            title="Keep Moving"
            description="You've walked 4,200 steps today. Aim for 8,000 to stay active."
            action={{ label: 'View Goal', onClick: () => {} }}
            variant="tip"
          />
        </Reveal>
        <Reveal>
          <HealthInsightCard
            icon={<Droplet className="w-4 h-4" />}
            title="Stay Hydrated"
            description="Drink 2 more glasses of water to reach your daily goal."
            action={{ label: 'Set Reminder', onClick: () => {} }}
            variant="info"
          />
        </Reveal>
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
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold', m.gender === 'female' ? 'bg-rose-400' : 'bg-blue-400')}>
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
  const nearby = MOCK_FACILITIES.filter((f) => f.open_now).slice(0, 2);

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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-600">Open</span>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
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

            <WellnessSection />

            <div className="mb-2 md:mb-0">
              <Card variant="default" padding="md" className="text-center">
                <p className="text-xs text-neutral-600 mb-2">Ready to take control?</p>
                <p className="text-sm font-semibold text-primary-800 mb-3">Explore all your health benefits</p>
                <Button
                  variant="teal"
                  size="sm"
                  fullWidth
                  onClick={() => router.push('/plans')}
                  leadingIcon={<Sparkles className="w-4 h-4" />}
                >
                  Discover More
                </Button>
              </Card>
            </div>
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
