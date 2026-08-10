'use client';

import Link from 'next/link';
import { Facility, FacilityType } from '@/types';
import { cn } from '@/lib/utils';
import { IconChip } from '@/components/ui/IconChip';
import { MapPin, Phone, Clock, ChevronRight, Building2, Pill, Stethoscope, Star, ShieldCheck } from 'lucide-react';

// ── Type config ──────────────────────────────────────────────────────────────
// Legitimate 3-way category color-code (not decoration): hospital = navy,
// clinic = teal, pharmacy = orange. Keep in sync with PIN_COLORS in
// FacilityMapInner.tsx.

export const FACILITY_TYPE_CONFIG: Record<
  FacilityType,
  {
    label: string;
    icon: typeof Building2;
    /** IconChip color prop for this category */
    chipColor: 'primary' | 'accent' | 'warning';
    badgeBg: string;
    badgeText: string;
  }
> = {
  hospital: {
    label: 'Hospital',
    icon: Building2,
    chipColor: 'primary',
    badgeBg: 'bg-primary-50',
    badgeText: 'text-primary-700',
  },
  clinic: {
    label: 'Clinic',
    icon: Stethoscope,
    chipColor: 'accent',
    badgeBg: 'bg-accent-50',
    badgeText: 'text-accent-700',
  },
  pharmacy: {
    label: 'Pharmacy',
    icon: Pill,
    chipColor: 'warning',
    badgeBg: 'bg-warning-50',
    badgeText: 'text-warning-700',
  },
};

// ── Stars ─────────────────────────────────────────────────────────────────────

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
      <span className="text-[11px] font-semibold text-neutral-600">{rating.toFixed(1)}</span>
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
      <div className={cn('bg-white rounded-2xl p-3 shadow-elevated border border-neutral-150 min-w-[220px]', className)}>
        <div className="flex items-start gap-2">
          <IconChip icon={<Icon className="w-4 h-4" />} color={cfg.chipColor} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900 leading-tight truncate">{facility.name}</p>
            <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', cfg.badgeBg, cfg.badgeText)}>
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className={cn(
            'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
            facility.covered
              ? 'bg-accent-50 text-accent-700'
              : 'bg-neutral-100 text-neutral-500',
          )}>
            {facility.covered && <ShieldCheck className="w-3 h-3" />}
            {facility.covered ? 'Covered' : 'Not Covered'}
          </span>
          <span className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
            facility.open_now ? 'bg-accent-50 text-accent-700' : 'bg-danger-50 text-danger-600',
          )}>
            {facility.open_now ? 'Open' : 'Closed'}
          </span>
        </div>
        <Link
          href={`/facilities/${facility.id}`}
          className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-primary-800 text-white text-xs font-semibold transition-colors hover:bg-primary-700"
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
        'bg-white border border-neutral-150 shadow-card rounded-2xl p-4',
        'transition-shadow duration-200 hover:shadow-card-hover',
        className,
      )}>
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <IconChip icon={<Icon className="w-5 h-5" strokeWidth={2} />} color={cfg.chipColor} size="lg" />

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-[15px] text-neutral-900 leading-tight">{facility.name}</p>
              <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {/* Type badge */}
              <span className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-transparent',
                cfg.badgeBg, cfg.badgeText,
              )}>
                {cfg.label}
              </span>
              {/* Coverage badge */}
              <span className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                facility.covered
                  ? 'bg-accent-50 text-accent-700'
                  : 'bg-neutral-100 text-neutral-500',
              )}>
                {facility.covered && <ShieldCheck className="w-3 h-3" />}
                {facility.covered ? 'Covered' : 'Not Covered'}
              </span>
              {/* Open/Closed badge */}
              <span className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                facility.open_now
                  ? 'bg-accent-50 text-accent-700'
                  : 'bg-danger-50 text-danger-600',
              )}>
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  facility.open_now ? 'bg-accent-500' : 'bg-danger-400',
                )} />
                {facility.open_now ? 'Open now' : 'Closed'}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-neutral-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[12px]">{facility.distance_km} km away</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
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
