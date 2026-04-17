'use client';

import Link from 'next/link';
import { Facility, FacilityType } from '@/types';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Clock, ChevronRight, Building2, Pill, Stethoscope, Star } from 'lucide-react';

// ── Type config ──────────────────────────────────────────────────────────────

export const FACILITY_TYPE_CONFIG: Record<
  FacilityType,
  { label: string; icon: typeof Building2; bg: string; color: string; badgeBg: string; badgeText: string }
> = {
  hospital: {
    label: 'Hospital',
    icon: Building2,
    bg: 'bg-primary-50',
    color: 'text-primary-700',
    badgeBg: 'bg-primary-50',
    badgeText: 'text-primary-700',
  },
  clinic: {
    label: 'Clinic',
    icon: Stethoscope,
    bg: 'bg-accent-50',
    color: 'text-accent-700',
    badgeBg: 'bg-accent-50',
    badgeText: 'text-accent-700',
  },
  pharmacy: {
    label: 'Pharmacy',
    icon: Pill,
    bg: 'bg-warning-50',
    color: 'text-warning-700',
    badgeBg: 'bg-warning-50',
    badgeText: 'text-warning-700',
  },
};

// ── Stars ─────────────────────────────────────────────────────────────────────

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
      <span className="text-[11px] font-semibold text-slate-600">{rating.toFixed(1)}</span>
    </div>
  );
}

// ── FacilityCard ──────────────────────────────────────────────────────────────

interface FacilityCardProps {
  facility: Facility;
  /** Render as a compact map-popup card instead of full list item */
  compact?: boolean;
  className?: string;
}

export function FacilityCard({ facility, compact = false, className }: FacilityCardProps) {
  const cfg = FACILITY_TYPE_CONFIG[facility.type];
  const Icon = cfg.icon;

  if (compact) {
    return (
      <div className={cn('bg-white rounded-2xl p-3 shadow-md border border-slate-100 min-w-[220px]', className)}>
        <div className="flex items-start gap-2">
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
            <Icon className={cn('w-4 h-4', cfg.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">{facility.name}</p>
            <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', cfg.badgeBg, cfg.badgeText)}>
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
            facility.covered
              ? 'bg-accent-50 text-accent-700'
              : 'bg-slate-100 text-slate-500',
          )}>
            {facility.covered ? '✓ Covered' : 'Not Covered'}
          </span>
          <span className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
            facility.open_now ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600',
          )}>
            {facility.open_now ? 'Open' : 'Closed'}
          </span>
        </div>
        <Link
          href={`/facilities/${facility.id}`}
          className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-primary-800 text-white text-xs font-semibold"
        >
          View details
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  return (
    <Link href={`/facilities/${facility.id}`} className="block">
      <div className={cn(
        'bg-white border border-slate-100/80 shadow-card rounded-2xl p-4',
        'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
        className,
      )}>
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
            <Icon className={cn('w-5 h-5', cfg.color)} strokeWidth={2} />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-[15px] text-slate-900 leading-tight">{facility.name}</p>
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {/* Type badge */}
              <span className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                cfg.badgeBg, cfg.badgeText,
                'border-transparent',
              )}>
                {cfg.label}
              </span>
              {/* Coverage badge */}
              <span className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                facility.covered
                  ? 'bg-accent-50 text-accent-700'
                  : 'bg-slate-100 text-slate-500',
              )}>
                {facility.covered ? '✓ Covered' : 'Not Covered'}
              </span>
              {/* Open/Closed badge */}
              <span className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                facility.open_now
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-600',
              )}>
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  facility.open_now ? 'bg-emerald-500' : 'bg-red-400',
                )} />
                {facility.open_now ? 'Open now' : 'Closed'}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[12px]">{facility.distance_km} km away</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[12px] truncate">{facility.hours}</span>
              </div>
              <RatingStars rating={facility.rating} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
