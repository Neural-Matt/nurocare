'use client';

import { Plan } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Pill,
  Building2,
  Smile,
  Eye,
  Heart,
  Globe,
  Zap,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Map feature keywords to icons
const FEATURE_ICON_MAP: Array<{ keywords: string[]; icon: typeof Stethoscope }> = [
  { keywords: ['gp', 'consultation', 'doctor', 'specialist', 'visit'],    icon: Stethoscope },
  { keywords: ['medication', 'pharmacy', 'medicine', 'prescription'],       icon: Pill },
  { keywords: ['hospital', 'hospitalization', 'inpatient', 'stay'],         icon: Building2 },
  { keywords: ['dental', 'teeth'],                                           icon: Smile },
  { keywords: ['eye', 'vision', 'optical'],                                  icon: Eye },
  { keywords: ['maternity', 'prenatal', 'birth'],                            icon: Heart },
  { keywords: ['international', 'abroad', 'global'],                         icon: Globe },
  { keywords: ['emergency', 'urgent'],                                        icon: Zap },
];

function featureIcon(text: string): typeof Stethoscope {
  const lower = text.toLowerCase();
  for (const { keywords, icon } of FEATURE_ICON_MAP) {
    if (keywords.some((k) => lower.includes(k))) return icon;
  }
  return Check as typeof Stethoscope;
}

// Which plan is "most popular" — keyed by name, not id: real plan rows get
// a database-generated uuid, so an id-based key would only ever match the
// old hardcoded mock data and silently stop working once wired to Supabase.
const POPULAR_PLAN_NAME = 'Standard Health';

// Colour scheme per plan — flat solid headers, no gradient wash
const PLAN_THEMES: Record<string, {
  header: string;
  priceColor: string;
  iconBg: string;
  iconColor: string;
  borderHighlight: string;
}> = {
  'Basic Care': {
    header: 'bg-primary-800',
    priceColor: 'text-accent-400',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-700',
    borderHighlight: 'border-primary-100',
  },
  'Standard Health': {
    header: 'bg-accent-600',
    priceColor: 'text-white',
    iconBg: 'bg-accent-50',
    iconColor: 'text-accent-700',
    borderHighlight: 'border-accent-200',
  },
  'Premium Plus': {
    header: 'bg-warning-600',
    priceColor: 'text-white',
    iconBg: 'bg-warning-50',
    iconColor: 'text-warning-700',
    borderHighlight: 'border-warning-200',
  },
};

const DEFAULT_THEME = PLAN_THEMES['Basic Care'];

interface PlanCardProps {
  plan: Plan;
  isActive?: boolean;
  onSelect: (plan: Plan) => void;
  onViewDetails: (plan: Plan) => void;
}

export function PlanCard({ plan, isActive, onSelect, onViewDetails }: PlanCardProps) {
  const isPopular = plan.name === POPULAR_PLAN_NAME;
  const theme = PLAN_THEMES[plan.name] ?? DEFAULT_THEME;

  return (
    <div
      className={cn(
        'relative bg-white rounded-3xl border transition-shadow duration-300 hover:shadow-card-hover',
        isPopular ? 'border-accent-300 shadow-card-hover' : 'border-neutral-150 shadow-card',
      )}
    >
      {/* Popular badge — floats above the card top edge, outside the clipped inner wrapper */}
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="inline-flex items-center gap-1.5 bg-accent-500 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-lg shadow-accent-500/30">
            <Star className="w-2.5 h-2.5 fill-white" />
            Most Popular
          </div>
        </div>
      )}

      <div className="rounded-3xl overflow-hidden">
      {/* ── Plan header ── */}
      <div className={cn(
        'p-5 relative',
        isPopular ? 'pt-7' : '',
        theme.header,
      )}>
        <div className="relative flex items-start justify-between mb-3">
          <div>
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-widest mb-1">NuroCare</p>
            <h3 className="text-white font-display font-bold text-2xl leading-tight">{plan.name}</h3>
          </div>
          {isActive && (
            <span className="inline-flex items-center gap-1 bg-white/15 text-white border border-white/25 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Active
            </span>
          )}
        </div>

        {/* Price */}
        <div className="relative flex items-baseline gap-1.5">
          <span className={cn('font-display font-semibold text-4xl leading-none', theme.priceColor)}>
            {formatCurrency(plan.price)}
          </span>
          <span className="text-white/40 text-sm font-medium">/month</span>
        </div>

        <p className="relative text-white/60 text-xs mt-2 leading-snug">{plan.description}</p>
      </div>

      {/* ── Features ── */}
      <div className="p-5">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">What&apos;s included</p>
        <ul className="space-y-2.5 mb-5">
          {plan.features.map((feature) => {
            const FeatureIcon = featureIcon(feature);
            const isCheckIcon = FeatureIcon === Check;
            return (
              <li key={feature} className="flex items-center gap-3 text-sm text-neutral-700">
                <div className={cn(
                  'w-7 h-7 rounded-xl flex items-center justify-center shrink-0',
                  theme.iconBg,
                )}>
                  {isCheckIcon
                    ? <Check className={cn('w-3.5 h-3.5 stroke-[3]', theme.iconColor)} />
                    : <FeatureIcon className={cn('w-3.5 h-3.5', theme.iconColor)} />
                  }
                </div>
                <span className="leading-tight">{feature}</span>
              </li>
            );
          })}
        </ul>

        {/* ── Actions ── */}
        <div className="flex gap-2.5">
          <Button
            variant={isActive ? 'teal' : 'primary'}
            onClick={() => onSelect(plan)}
            fullWidth
            size="lg"
            disabled={isActive}
            leadingIcon={isActive ? <CheckCircle2 className="w-4 h-4" /> : undefined}
          >
            {isActive ? 'Your Current Plan' : 'Get This Plan'}
          </Button>
          <button
            onClick={() => onViewDetails(plan)}
            className={cn(
              'shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-colors duration-200 hover:bg-neutral-50 active:scale-95',
              theme.borderHighlight,
            )}
            aria-label="View plan details"
          >
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
