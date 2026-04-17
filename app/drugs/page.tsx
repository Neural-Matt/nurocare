'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MOCK_DRUGS } from '@/lib/mock-drugs';
import { Drug } from '@/types';
import { Search, Pill, AlertTriangle, Stethoscope, Info, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Derive unique categories
const ALL_CATEGORIES = ['All', ...Array.from(new Set(MOCK_DRUGS.map((d) => d.category))).sort()];

export default function DrugsPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Drug | null>(null);

  const results = useMemo(() => {
    return MOCK_DRUGS.filter((d) => {
      const matchesQuery = !query.trim() ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.generic_name.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase());
      const matchesCat = category === 'All' || d.category === category;
      return matchesQuery && matchesCat;
    });
  }, [query, category]);

  return (
    <AppShell title="Drug Reference">
      {/* Search bar */}
      <div className="mb-4">
        <Input
          placeholder="Search by name, generic name or category…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={query ? (
            <button onClick={() => setQuery('')} className="p-0.5 rounded-full hover:bg-slate-100">
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : undefined}
        />
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 transition-all duration-150',
              category === cat
                ? 'bg-primary-800 text-white border-primary-800 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-primary-300 hover:text-primary-700',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 mb-4">
        {results.length} result{results.length !== 1 ? 's' : ''}
        {query && ` for "${query}"`}
        {category !== 'All' && ` in ${category}`}
      </p>

      {/* Results */}
      {results.length === 0 ? (
        <Card className="flex flex-col items-center py-10 text-center gap-2">
          <Pill className="w-10 h-10 text-slate-200" />
          <p className="font-medium text-slate-500">No matches found</p>
          <p className="text-xs text-slate-400">Try searching by drug name, generic name, or category</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((drug) => (
            <Card key={drug.id} hover onClick={() => setSelected(drug)} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Pill className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900 text-sm">{drug.name}</p>
                  {drug.prescription_required && (
                    <Badge variant="warning" className="text-[10px]">Rx Only</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{drug.generic_name}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{drug.usage}</p>
              </div>
              <Badge variant="neutral" className="flex-shrink-0 text-[10px]">{drug.category}</Badge>
            </Card>
          ))}
        </div>
      )}

      {/* Drug Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Pill className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{selected.generic_name}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <Badge variant="neutral">{selected.category}</Badge>
                  {selected.prescription_required ? (
                    <Badge variant="warning">Prescription Required</Badge>
                  ) : (
                    <Badge variant="success">Over The Counter</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Usage */}
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-primary-700 text-xs font-semibold mb-1">
                <Stethoscope className="w-3.5 h-3.5" />
                USAGE
              </div>
              <p className="text-sm text-slate-700">{selected.usage}</p>
            </div>

            {/* Dosage */}
            <div className="bg-accent-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-accent-700 text-xs font-semibold mb-1">
                <Info className="w-3.5 h-3.5" />
                DOSAGE
              </div>
              <p className="text-sm text-slate-700">{selected.dosage}</p>
            </div>

            {/* Side effects */}
            <div className="bg-red-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                POSSIBLE SIDE EFFECTS
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.side_effects.map((effect) => (
                  <span
                    key={effect}
                    className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center">
              This information is for reference only. Always consult a healthcare provider.
            </p>

            {/* Find nearby pharmacies CTA */}
            <Button
              variant="teal"
              fullWidth
              onClick={() => {
                setSelected(null);
                router.push('/facilities?type=pharmacy');
              }}
              leadingIcon={<MapPin className="w-4 h-4" />}
            >
              Find Nearby Pharmacies
            </Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
