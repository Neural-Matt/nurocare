'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { FacilityCard, FACILITY_TYPE_CONFIG } from '@/components/features/FacilityCard';
import { Input } from '@/components/ui/Input';
import { MOCK_FACILITIES } from '@/lib/mock-facilities';
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl gap-3">
        <Map className="w-8 h-8 text-slate-300 animate-pulse" />
        <p className="text-sm text-slate-400">Loading map…</p>
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
    return MOCK_FACILITIES.filter((f) => {
      const matchesSearch =
        !query.trim() ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.address.toLowerCase().includes(query.toLowerCase()) ||
        f.services.some((s) => s.toLowerCase().includes(query.toLowerCase()));

      const matchesType = typeFilter === 'all' || f.type === typeFilter;
      const matchesCovered = !coveredOnly || f.covered;

      return matchesSearch && matchesType && matchesCovered;
    });
  }, [query, typeFilter, coveredOnly]);

  return (
    <AppShell title="Find Facilities">
      {/* ── Intro ── */}
      <div className="mb-4">
        <h1 className="font-display font-bold text-xl text-primary-800 mb-0.5">
          Hospitals &amp; Pharmacies
        </h1>
        <p className="text-slate-500 text-sm">
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
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
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
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}

        {/* Separator */}
        <div className="w-px h-5 bg-slate-200 shrink-0 mx-1" />

        {/* Covered only toggle */}
        <button
          onClick={() => setCoveredOnly((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0',
            'border transition-all duration-150',
            coveredOnly
              ? 'bg-accent-500 text-white border-accent-500'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Covered only
        </button>

        {/* Spacer pushes view toggle right */}
        <div className="flex-1 min-w-[8px]" />

        {/* List / Map toggle */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200 shrink-0">
          {(['list', 'map'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={v === 'list' ? 'List view' : 'Map view'}
              className={cn(
                'p-2 transition-colors',
                view === v
                  ? 'bg-primary-800 text-white'
                  : 'bg-white text-slate-400 hover:text-slate-600',
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
      <p className="text-[12px] text-slate-400 mb-3 font-medium">
        {filtered.length} facilit{filtered.length !== 1 ? 'ies' : 'y'} found
        {query && ` for "${query}"`}
        {typeFilter !== 'all' && ` · ${FACILITY_TYPE_CONFIG[typeFilter].label}s`}
        {coveredOnly && ' · Covered only'}
      </p>

      {/* ── Map view ── */}
      {view === 'map' && (
        <div className="h-[calc(100vh-320px)] min-h-[360px] rounded-2xl overflow-hidden border border-slate-100 shadow-card">
          <FacilityMap facilities={filtered} />
        </div>
      )}

      {/* ── List view ── */}
      {view === 'list' && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-accent-400 to-primary-600" />
              <div className="flex flex-col items-center py-14 text-center gap-3 px-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center">
                  <Search className="w-7 h-7 text-slate-300" />
                </div>
                <div>
                  <p className="font-display font-bold text-slate-700 mb-1">No facilities found</p>
                  <p className="text-sm text-slate-400 max-w-[220px] leading-snug">
                    Try a different search term or remove some filters.
                  </p>
                </div>
                <button
                  onClick={() => { setQuery(''); setTypeFilter('all'); setCoveredOnly(false); }}
                  className="mt-1 px-4 py-2 rounded-xl bg-primary-800 text-white text-sm font-semibold transition-colors hover:bg-primary-700"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filtered.map((facility, i) => (
                <div
                  key={facility.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <FacilityCard facility={facility} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
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
