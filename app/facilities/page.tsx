'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { FacilityCard, FACILITY_TYPE_CONFIG } from '@/components/features/FacilityCard';
import { Input } from '@/components/ui/Input';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Stagger, Reveal } from '@/components/ui/motion';
import { useFacilities } from '@/hooks/useFacilities';
import { FacilityType } from '@/types';
import {
  Search, Map, List, SlidersHorizontal,
  ShieldCheck, Building2, Stethoscope, Pill, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamic import — Leaflet requires browser APIs (no SSR)
const FacilityMap = dynamic(
  () => import('@/components/features/FacilityMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 rounded-2xl gap-3">
        <Map className="w-8 h-8 text-neutral-300 animate-pulse" />
        <p className="text-sm text-neutral-400">Loading map…</p>
      </div>
    ),
  }
);

type ViewMode = 'list' | 'map';

const TYPE_FILTERS: { value: FacilityType | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all',      label: 'All',       icon: SlidersHorizontal },
  { value: 'hospital', label: 'Hospitals', icon: Building2          },
  { value: 'clinic',   label: 'Clinics',   icon: Stethoscope        },
  { value: 'pharmacy', label: 'Pharmacy',  icon: Pill               },
];

function FacilitiesPage() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as FacilityType | null) ?? 'all';

  const { facilities, loading } = useFacilities();
  const [query, setQuery]             = useState('');
  const [typeFilter, setTypeFilter]   = useState<FacilityType | 'all'>(initialType);
  const [coveredOnly, setCoveredOnly] = useState(false);
  const [view, setView]               = useState<ViewMode>('list');

  // Sync type filter if URL param changes (e.g. from drug reference link)
  useEffect(() => {
    const t = searchParams.get('type') as FacilityType | null;
    if (t) setTypeFilter(t);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      const matchesSearch =
        !query.trim() ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.address.toLowerCase().includes(query.toLowerCase()) ||
        f.services.some((s) => s.toLowerCase().includes(query.toLowerCase()));

      const matchesType = typeFilter === 'all' || f.type === typeFilter;
      const matchesCovered = !coveredOnly || f.covered;

      return matchesSearch && matchesType && matchesCovered;
    });
  }, [facilities, query, typeFilter, coveredOnly]);

  const clearFilters = () => { setQuery(''); setTypeFilter('all'); setCoveredOnly(false); };

  return (
    <AppShell title="Find Facilities">
      <div className="max-w-lg md:max-w-5xl mx-auto">
        {/* ── Intro ── */}
        <div className="mb-6">
          <h1 className="font-display font-medium text-4xl text-neutral-900 tracking-[-0.02em] mb-2">
            Hospitals &amp; Pharmacies
          </h1>
          <p className="text-neutral-500 text-base">
            Find covered hospitals, clinics and pharmacies near you.
          </p>
        </div>

        {/* ── Search ── */}
        <div className="mb-3">
          <Input
            placeholder="Search by name, address or service…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              query ? (
                <button onClick={() => setQuery('')} aria-label="Clear search">
                  <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* ── Filters + view toggle row ── */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
          {/* Type filters */}
          {TYPE_FILTERS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0',
                'border transition-all duration-150',
                typeFilter === value
                  ? 'bg-primary-800 text-white border-primary-800'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}

          {/* Separator */}
          <div className="w-px h-5 bg-neutral-200 shrink-0 mx-1" />

          {/* Covered only toggle */}
          <button
            onClick={() => setCoveredOnly((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0',
              'border transition-all duration-150',
              coveredOnly
                ? 'bg-accent-500 text-white border-accent-500'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300',
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Covered only
          </button>

          {/* Spacer pushes view toggle right */}
          <div className="flex-1 min-w-[8px]" />

          {/* List / Map toggle */}
          <div className="flex rounded-xl overflow-hidden border border-neutral-200 shrink-0">
            {(['list', 'map'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={v === 'list' ? 'List view' : 'Map view'}
                className={cn(
                  'p-2 transition-colors',
                  view === v
                    ? 'bg-primary-800 text-white'
                    : 'bg-white text-neutral-400 hover:text-neutral-600',
                )}
              >
                {v === 'list'
                  ? <List className="w-4 h-4" />
                  : <Map className="w-4 h-4" />
                }
              </button>
            ))}
          </div>
        </div>

        {/* ── Result count ── */}
        {!loading && (
          <p className="text-[12px] text-neutral-400 mb-3 font-medium">
            {filtered.length} facilit{filtered.length !== 1 ? 'ies' : 'y'} found
            {query && ` for "${query}"`}
            {typeFilter !== 'all' && ` · ${FACILITY_TYPE_CONFIG[typeFilter].label}s`}
            {coveredOnly && ' · Covered only'}
          </p>
        )}

        {/* ── Loading state ── */}
        {loading && <ListSkeleton count={5} />}

        {/* ── Map view ── */}
        {!loading && view === 'map' && (
          <div className="h-[calc(100vh-320px)] min-h-[360px] rounded-2xl overflow-hidden border border-neutral-150 shadow-card">
            <FacilityMap facilities={filtered} />
          </div>
        )}

        {/* ── List view ── */}
        {!loading && view === 'list' && (
          <>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card border border-neutral-150 overflow-hidden">
                <EmptyState
                  icon={Search}
                  title="No facilities found"
                  description="Try a different search term or remove some filters."
                  action={{ label: 'Clear all filters', onClick: clearFilters }}
                />
              </div>
            ) : (
              <Stagger className="pb-4 space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4" gap={0.05}>
                {filtered.map((facility) => (
                  <Reveal key={facility.id}>
                    <FacilityCard facility={facility} />
                  </Reveal>
                ))}
              </Stagger>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function FacilitiesPageWrapper() {
  return (
    <Suspense>
      <FacilitiesPage />
    </Suspense>
  );
}
