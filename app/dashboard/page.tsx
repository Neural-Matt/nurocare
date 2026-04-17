'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useClaims } from '@/hooks/useClaims';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { AppShell } from '@/components/layout/AppShell';
import { ClaimCard } from '@/components/features/ClaimCard';
import { Badge, subscriptionStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton, ListSkeleton } from '@/components/ui/Skeleton';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MOCK_FACILITIES } from '@/lib/mock-facilities';
import {
  Stethoscope,
  FileText,
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
  CheckCircle2,
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Find Care',   icon: MapPin,          gradient: 'from-warning-400 to-warning-600', href: '/facilities'   },
  { label: 'New Claim',   icon: FileText,         gradient: 'from-accent-500 to-accent-700',   href: '/claims/new'   },
  { label: 'See Doctor',  icon: MessageCircle,    gradient: 'from-primary-700 to-primary-900', href: '/telemedicine' },
  { label: 'Drug Search', icon: Pill,             gradient: 'from-blue-500 to-blue-700',        href: '/drugs'        },
];

function GreetingHeader({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = useState('Hello');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);
  return (
    <div className="flex items-center justify-between mb-1">
      <div>
        <p className="text-slate-400 text-sm font-medium">{greeting},</p>
        <h1 className="text-[26px] font-display font-bold text-primary-800 mt-0.5 leading-tight">
          {firstName} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </h1>
      </div>
      <div className="flex items-center gap-1.5 bg-warning-50 border border-warning-100 text-warning-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
        Healthy streak
      </div>
    </div>
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
      <Skeleton className="h-px w-full bg-white/10" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24 bg-white/20" />
        <Skeleton className="h-5 w-20 bg-white/20" />
      </div>
    </div>
  );
}

function ActivePolicyCard({
  subscription,
  userName,
}: {
  subscription: NonNullable<ReturnType<typeof useSubscriptions>['activeSubscription']>;
  userName?: string;
}) {
  const plan = subscription.plan;
  const badge = subscriptionStatusBadge(subscription.status);
  const isExpired = subscription.status === 'expired' || subscription.status === 'cancelled';
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary-800 p-5 text-white shadow-xl">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-warning-500/10 blur-2xl pointer-events-none" />
      <div className="relative flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">NuroCare</p>
          </div>
          <p className="text-xl font-display font-bold">{plan?.name ?? 'Health Plan'}</p>
        </div>
        <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm', isExpired ? 'bg-red-500/20 border-red-400/30 text-red-300' : 'bg-accent-500/20 border-accent-400/30 text-accent-300')}>
          <span className={cn('w-1.5 h-1.5 rounded-full', isExpired ? 'bg-red-400' : 'bg-accent-400 animate-pulse')} />
          {badge.label}
        </span>
      </div>
      <div className="relative flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-accent-500/25 border border-accent-400/40 flex items-center justify-center font-bold text-sm text-white shrink-0">
          {userName ? getInitials(userName) : 'NC'}
        </div>
        <div>
          <p className="text-white/40 text-xs">Policy Holder</p>
          <p className="font-semibold text-sm">{userName ?? 'Member'}</p>
        </div>
      </div>
      <div className="relative grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1.5"><Hash className="w-3 h-3" />Policy No.</div>
          <p className="font-mono text-xs font-semibold tracking-wide text-white/90">{subscription.policy_number}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1.5"><Calendar className="w-3 h-3" />Valid Until</div>
          <p className="text-xs font-semibold text-white/90">{formatDate(subscription.end_date)}</p>
        </div>
      </div>
      <div className="relative pt-3.5 border-t border-white/10 flex justify-between items-center">
        <p className="text-white/40 text-xs">Monthly Premium</p>
        <p className="font-display font-bold text-lg text-accent-400">{formatCurrency(plan?.price ?? 0)}</p>
      </div>
    </div>
  );
}

function NoPolicyCard({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary-800 p-5 text-white shadow-xl">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-accent-500/15 blur-2xl pointer-events-none" />
      <div className="relative flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-white/60" />
        </div>
        <div className="flex-1">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">No Active Plan</p>
          <p className="text-lg font-display font-bold mb-1">Get Covered Today</p>
          <p className="text-white/50 text-sm leading-snug mb-4">Choose a health plan to start enjoying benefits.</p>
          <Button variant="teal" size="sm" onClick={onBrowse} trailingIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>Browse Plans</Button>
        </div>
      </div>
    </div>
  );
}

function QuickActionsGrid({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <section>
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ label, icon: Icon, gradient, href }) => (
          <button key={label} onClick={() => onNavigate(href)} className="group flex flex-col items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 rounded-2xl">
            <div className={cn('w-full aspect-square rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5 group-active:scale-95', gradient)}>
              <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[11px] font-semibold text-slate-600 text-center leading-tight">{label}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function FamilyOverviewSection() {
  const { members, loading } = useFamilyMembers();
  const router = useRouter();
  if (!loading && members.length === 0) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Family Coverage</h2>
        <button onClick={() => router.push('/family')} className="text-xs text-accent-600 font-semibold flex items-center gap-0.5 hover:text-accent-500 transition-colors">
          Manage <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      {loading ? (
        <div className="flex gap-2">{[0,1,2].map(i => <Skeleton key={i} className="h-16 flex-1 rounded-2xl" />)}</div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-accent-400 to-primary-600" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-accent-600" />
              <p className="text-sm font-semibold text-primary-800">{members.length} family member{members.length !== 1 ? 's' : ''} covered</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold', m.gender === 'female' ? 'bg-rose-400' : 'bg-blue-400')}>
                    {getInitials(m.name)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-800">{m.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{m.relationship}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}

function NearbyFacilitiesSection() {
  const router = useRouter();
  const nearby = MOCK_FACILITIES.filter((f) => f.open_now).slice(0, 3);
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nearby Facilities</h2>
        <button onClick={() => router.push('/facilities')} className="text-xs text-accent-600 font-semibold flex items-center gap-0.5 hover:text-accent-500 transition-colors">
          See all <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2">
        {nearby.map((f) => (
          <button key={f.id} onClick={() => router.push(`/facilities/${f.id}`)} className="w-full text-left">
            <Card padding="none" className="hover:border-accent-200 transition-colors">
              <div className="flex items-center gap-3 p-3.5">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', f.type === 'hospital' ? 'bg-blue-50' : f.type === 'pharmacy' ? 'bg-emerald-50' : 'bg-violet-50')}>
                  <Building2 className={cn('w-5 h-5', f.type === 'hospital' ? 'text-blue-500' : f.type === 'pharmacy' ? 'text-emerald-500' : 'text-violet-500')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary-800 truncate">{f.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{f.distance_km} km</span>
                    <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-warning-400 text-warning-400" />{f.rating}</span>
                    {f.covered && <span className="text-accent-600 font-semibold flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" />Covered</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-700">Open</span>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </section>
  );
}

function RecentActivitySection({
  claims, loading, onViewAll, onNewClaim, onClaimClick,
}: {
  claims: ReturnType<typeof useClaims>['claims'];
  loading: boolean;
  onViewAll: () => void;
  onNewClaim: () => void;
  onClaimClick: (id: string) => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h2>
        {claims.length > 0 && (
          <button onClick={onViewAll} className="text-xs text-accent-600 font-semibold flex items-center gap-0.5 hover:text-accent-500 transition-colors">
            See all <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {loading ? (
        <ListSkeleton count={3} />
      ) : claims.length === 0 ? (
        <Card padding="none" className="overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-accent-400 via-primary-600 to-accent-500" />
          <div className="flex flex-col items-center text-center gap-3 px-6 py-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center">
              <FileText className="w-7 h-7 text-slate-300" />
            </div>
            <div>
              <p className="font-display font-bold text-slate-700 mb-1">No claims yet</p>
              <p className="text-sm text-slate-400 leading-snug max-w-[200px] mx-auto">Submit a claim for consultations, medications or lab tests</p>
            </div>
            <Button variant="gradient" size="sm" onClick={onNewClaim} leadingIcon={<Plus className="w-3.5 h-3.5" />} className="mt-1">
              Make Your First Claim
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {claims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} onClick={() => onClaimClick(claim.id)} />
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

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const recentClaims = claims.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-6 pb-4">
        <GreetingHeader firstName={firstName} />

        <section>
          {subLoading ? (
            <PolicyCardSkeleton />
          ) : activeSubscription ? (
            <ActivePolicyCard subscription={activeSubscription} userName={profile?.full_name ?? undefined} />
          ) : (
            <NoPolicyCard onBrowse={() => router.push('/plans')} />
          )}
        </section>

        <QuickActionsGrid onNavigate={(href) => router.push(href)} />

        <FamilyOverviewSection />

        <NearbyFacilitiesSection />

        <RecentActivitySection
          claims={recentClaims}
          loading={claimsLoading}
          onViewAll={() => router.push('/claims')}
          onNewClaim={() => router.push('/claims/new')}
          onClaimClick={(id) => router.push(`/claims/${id}`)}
        />
      </div>
    </AppShell>
  );
}
