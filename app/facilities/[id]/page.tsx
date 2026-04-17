'use client';

import { notFound, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getFacilityById, MOCK_FACILITIES } from '@/lib/mock-facilities';
import { FACILITY_TYPE_CONFIG } from '@/components/features/FacilityCard';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Shield,
  ShieldOff,
  ChevronRight,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mini map for detail page — same dynamic import pattern
const FacilityMap = dynamic(
  () => import('@/components/features/FacilityMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl">
        <p className="text-sm text-slate-400">Loading map…</p>
      </div>
    ),
  }
);

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn('w-4 h-4', n <= Math.round(rating) ? 'fill-warning-400 text-warning-400' : 'text-slate-200')}
        />
      ))}
      <span className="text-sm font-semibold text-slate-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function FacilityDetailPage() {
  const params = useParams();
  const facility = getFacilityById(params.id as string);

  if (!facility) notFound();

  const cfg = FACILITY_TYPE_CONFIG[facility.type];
  const Icon = cfg.icon;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}&destination_place_name=${encodeURIComponent(facility.name)}`;

  // Show 3 other facilities nearby for discovery
  const nearby = MOCK_FACILITIES.filter((f) => f.id !== facility.id).slice(0, 3);

  return (
    <AppShell title={facility.name}>
      {/* ── Hero card ── */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-card overflow-hidden mb-4">
        {/* Coloured header band */}
        <div className={cn(
          'px-5 pt-5 pb-4',
          facility.type === 'hospital' ? 'bg-primary-800' :
          facility.type === 'clinic'   ? 'bg-gradient-to-r from-accent-700 to-accent-500' :
                                         'bg-gradient-to-r from-warning-600 to-warning-400',
        )}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                  {cfg.label}
                </p>
                <h1 className="font-display font-bold text-xl text-white leading-tight">
                  {facility.name}
                </h1>
              </div>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full',
              facility.covered
                ? 'bg-white/20 text-white'
                : 'bg-black/20 text-white/70',
            )}>
              {facility.covered
                ? <><Shield className="w-3.5 h-3.5" />NuroCare Covered</>
                : <><ShieldOff className="w-3.5 h-3.5" />Not in Network</>
              }
            </span>
            <span className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full',
              facility.open_now ? 'bg-emerald-500/30 text-white' : 'bg-black/20 text-white/70',
            )}>
              <span className={cn(
                'w-1.5 h-1.5 rounded-full',
                facility.open_now ? 'bg-emerald-400' : 'bg-white/40',
              )} />
              {facility.open_now ? 'Open now' : 'Currently closed'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-700">{facility.address}</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <a href={`tel:${facility.phone.replace(/\s/g, '')}`}
               className="text-sm text-accent-600 font-semibold hover:text-accent-700 transition-colors">
              {facility.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <p className="text-sm text-slate-700">{facility.hours}</p>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4 text-slate-400 shrink-0" />
            <StarRow rating={facility.rating} />
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{facility.distance_km} km</span> from your location
            </p>
          </div>
        </div>
      </div>

      {/* ── Get Directions CTA ── */}
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="gradient" fullWidth size="lg" className="mb-4" leadingIcon={<Navigation className="w-4 h-4" />}>
          Get Directions
        </Button>
      </a>

      {/* ── Call button ── */}
      <a href={`tel:${facility.phone.replace(/\s/g, '')}`}>
        <Button variant="outline" fullWidth size="lg" className="mb-5" leadingIcon={<Phone className="w-4 h-4" />}>
          Call {facility.phone}
        </Button>
      </a>

      {/* ── Services ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-4 mb-4">
        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-3">Services offered</p>
        <div className="space-y-2">
          {facility.services.map((service) => (
            <div key={service} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
              <p className="text-sm text-slate-700">{service}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Coverage notice ── */}
      {facility.covered ? (
        <div className="flex items-start gap-3 bg-accent-50 border border-accent-100 rounded-2xl p-4 mb-4">
          <Shield className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-accent-800 mb-0.5">In-network facility</p>
            <p className="text-xs text-accent-700 leading-relaxed">
              This facility is covered under your NuroCare plan. Present your digital membership card at reception for cashless treatment.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
          <ShieldOff className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-slate-600 mb-0.5">Out-of-network facility</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              This facility is not directly covered by your plan. You can still visit and submit a reimbursement claim afterwards.
            </p>
            <Link
              href="/claims/new"
              className="text-xs font-semibold text-accent-600 hover:text-accent-700 mt-1.5 inline-flex items-center gap-1"
            >
              Submit a claim <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Mini map ── */}
      <div className="mb-4">
        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location</p>
        <div className="h-48 rounded-2xl overflow-hidden border border-slate-100 shadow-card">
          <FacilityMap facilities={[facility]} />
        </div>
      </div>

      {/* ── Nearby facilities ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">More nearby</p>
          <Link href="/facilities" className="text-xs font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-0.5">
            See all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {nearby.map((f) => {
            const c = FACILITY_TYPE_CONFIG[f.type];
            const NearbyIcon = c.icon;
            return (
              <Link key={f.id} href={`/facilities/${f.id}`}>
                <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-3 shadow-card hover:shadow-card-hover transition-all">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', c.bg)}>
                    <NearbyIcon className={cn('w-4 h-4', c.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{f.name}</p>
                    <p className="text-xs text-slate-400">{f.distance_km} km · {c.label}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
