'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useClaims } from '@/hooks/useClaims';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { HealthInsightCard } from '@/components/ui/HealthInsightCard';
import { Skeleton } from '@/components/ui/Skeleton';
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
  CheckCircle2,
  Heart,
  Droplet,
  Footprints,
  Clock,
  Zap,
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Find Care',   icon: MapPin,          gradient: 'from-warning-400 to-warning-600', href: '/facilities'   },
  { label: 'New Claim',   icon: Plus,            gradient: 'from-accent-500 to-accent-700',   href: '/claims/new'   },
  { label: 'Telemedicine', icon: MessageCircle,   gradient: 'from-primary-700 to-primary-900', href: '/telemedicine' },
  { label: 'Drugs',       icon: Pill,            gradient: 'from-blue-500 to-blue-700',        href: '/drugs'        },
];

function GreetingHeader({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = useState('Hello');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);
  return (
    <div className="mb-6 animate-fade-in">
      <p className="text-slate-400 text-sm font-medium">{greeting},</p>
      <h1 className="text-3xl font-display font-bold text-primary-800 mt-1 leading-tight">
        {firstName} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
      </h1>
      <p className="text-slate-400 text-sm mt-1">Here's your health overview</p>
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
  const isExpired = subscription.status === 'expired' || subscription.status === 'cancelled';
  const daysLeft = subscription.end_date ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <Card variant="navy" padding="lg" className="relative overflow-hidden animate-bounce-in">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-warning-500/10 blur-2xl pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-accent-400" />
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Active Policy</p>
            </div>
            <p className="text-2xl font-display font-bold">{plan?.name ?? 'Health Plan'}</p>
          </div>
          <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border', isExpired ? 'bg-red-500/20 border-red-400/30 text-red-300' : 'bg-accent-500/20 border-accent-400/30 text-accent-300')}>
            <span className={cn('w-2 h-2 rounded-full', isExpired ? 'bg-red-400' : 'bg-accent-400 animate-pulse')} />
            {isExpired ? 'Expired' : 'Active'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-1 text-white/50 text-xs mb-2"><Hash className="w-3 h-3" />No.</div>
            <p className="font-mono text-xs font-semibold text-white/90 truncate">{subscription.policy_number}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-1 text-white/50 text-xs mb-2"><Calendar className="w-3 h-3" />Expires</div>
            <p className="text-xs font-semibold text-white/90">{formatDate(subscription.end_date)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-1 text-white/50 text-xs mb-2"><Clock className="w-3 h-3" />Days</div>
            <p className="text-xs font-semibold text-accent-300">{Math.max(daysLeft, 0)}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
          <p className="text-white/50 text-xs">Monthly Premium</p>
          <p className="font-display font-bold text-lg text-accent-300">{formatCurrency(plan?.price ?? 0)}</p>
        </div>
      </div>
    </Card>
  );
}

function QuickActionsGrid({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map(({ label, icon: Icon, gradient, href }, idx) => (
          <button 
            key={label} 
            onClick={() => onNavigate(href)} 
            className="group flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 rounded-2xl animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={cn('w-full aspect-square rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 group-active:scale-95', gradient)}>
              <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <p className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{label}</p>
          </button>
        ))}
      </div>
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

function WellnessSection() {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Wellness</h2>
      <div className="space-y-2">
        <HealthInsightCard
          icon={<Footprints className="w-4 h-4" />}
          title="Keep Moving"
          description="You've walked 4,200 steps today. Aim for 8,000 to stay active."
          action={{ label: 'View Goal', onClick: () => {} }}
          variant="tip"
          animated
        />
        <HealthInsightCard
          icon={<Droplet className="w-4 h-4" />}
          title="Stay Hydrated"
          description="Drink 2 more glasses of water to reach your daily goal."
          action={{ label: 'Set Reminder', onClick: () => {} }}
          variant="info"
          animated
        />
      </div>
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
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Family Coverage</h2>
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
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
                <p className="text-xs font-semibold text-slate-600">+{members.length - 3} more</p>
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
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nearby Care</h2>
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
            <Card padding="none" interactive className="hover:border-accent-200">
              <div className="flex items-center gap-3 p-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', f.type === 'hospital' ? 'bg-blue-100' : f.type === 'pharmacy' ? 'bg-emerald-100' : 'bg-violet-100')}>
                  <Building2 className={cn('w-5 h-5', f.type === 'hospital' ? 'text-blue-600' : f.type === 'pharmacy' ? 'text-emerald-600' : 'text-violet-600')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary-800 truncate">{f.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                    <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{f.distance_km} km</span>
                    <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-warning-400 text-warning-400" />{f.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-glow-pulse" />
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
  const { user, profile } = useAuth();
  const { activeSubscription, loading: subLoading } = useSubscriptions();
  const { claims, loading: claimsLoading } = useClaims();
  const router = useRouter();

  return (
    <AppShell>
      <GreetingHeader firstName={profile?.full_name?.split(' ')[0] ?? 'there'} />

      {/* Active Policy Card */}
      {subLoading ? (
        <div className="mb-6"><PolicyCardSkeleton /></div>
      ) : activeSubscription ? (
        <div className="mb-6"><ActivePolicyCard subscription={activeSubscription} userName={profile?.full_name || undefined} /></div>
      ) : (
        <Card variant="navy" padding="lg" className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-white/60" />
            </div>
            <div className="flex-1">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">No Active Plan</p>
              <p className="text-lg font-display font-bold mb-2">Get Covered Today</p>
              <p className="text-white/70 text-sm mb-4">Browse our plans and start protecting your health.</p>
              <Button variant="teal" size="sm" onClick={() => router.push('/plans')} trailingIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Browse Plans
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <QuickActionsGrid onNavigate={(href) => router.push(href)} />

      {/* Metrics */}
      {claims.length > 0 && <MetricsGrid claims={claims} loading={claimsLoading} />}

      {/* Wellness Tips */}
      <WellnessSection />

      {/* Family Overview */}
      <FamilyOverviewSection />

      {/* Nearby Facilities */}
      <NearbyFacilitiesSection />

      {/* CTA to explore more */}
      <div className="mb-2">
        <Card variant="gradient-subtle" padding="md" className="text-center">
          <p className="text-xs text-slate-600 mb-2">Ready to take control?</p>
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
    </AppShell>
  );
}
