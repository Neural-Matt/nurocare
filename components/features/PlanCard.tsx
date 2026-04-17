'use client';

import { Plan } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import {
  Check,
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

// Which plan ID is "most popular"
const POPULAR_PLAN_ID = 'plan-standard';

// Colour scheme per plan
const PLAN_THEMES: Record<string, {
  header: string;
  glow: string;
  priceColor: string;
  iconBg: string;
  iconColor: string;
  borderHighlight: string;
}> = {
  'plan-basic': {
    header: 'from-primary-900 to-primary-800',
    glow: 'bg-accent-500/15',
    priceColor: 'text-accent-400',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-700',
    borderHighlight: 'border-primary-100',
  },
  'plan-standard': {
    header: 'from-accent-700 to-accent-600',
    glow: 'bg-white/10',
    priceColor: 'text-white',
    iconBg: 'bg-accent-50',
    iconColor: 'text-accent-700',
    borderHighlight: 'border-accent-200',
  },
  'plan-premium': {
    header: 'from-warning-600 to-warning-500',
    glow: 'bg-primary-900/20',
    priceColor: 'text-white',
    iconBg: 'bg-warning-50',
    iconColor: 'text-warning-700',
    borderHighlight: 'border-warning-200',
  },
};

const DEFAULT_THEME = PLAN_THEMES['plan-basic'];

interface PlanCardProps {
  plan: Plan;
  isActive?: boolean;
  onSelect: (plan: Plan) => void;
  onViewDetails: (plan: Plan) => void;
}

export function PlanCard({ plan, isActive, onSelect, onViewDetails }: PlanCardProps) {
  const isPopular = plan.id === POPULAR_PLAN_ID;
  const theme = PLAN_THEMES[plan.id] ?? DEFAULT_THEME;

  return (
    <div
      className={cn(
        'relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5',
        isPopular ? 'border-accent-300 shadow-md shadow-accent-500/10' : 'border-slate-100 shadow-card',
      )}
    >
      {/* Popular badge — floats above the card top edge */}
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="inline-flex items-center gap-1.5 bg-accent-500 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-lg shadow-accent-500/30">
            <Star className="w-2.5 h-2.5 fill-white" />
            Most Popular
          </div>
        </div>
      )}

      {/* ── Plan header ── */}
      <div className={cn(
        'bg-gradient-to-br p-5 relative overflow-hidden',
        isPopular ? 'pt-7' : '',
        theme.header,
      )}>
        {/* Glow blob */}
        <div className={cn('absolute -bottom-10 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none', theme.glow)} />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

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
          <span className={cn('font-display font-extrabold text-4xl leading-none', theme.priceColor)}>
            {formatCurrency(plan.price)}
          </span>
          <span className="text-white/40 text-sm font-medium">/month</span>
        </div>

        <p className="relative text-white/60 text-xs mt-2 leading-snug">{plan.description}</p>
      </div>

      {/* ── Features ── */}
      <div className="p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">What&apos;s included</p>
        <ul className="space-y-2.5 mb-5">
          {plan.features.map((feature) => {
            const FeatureIcon = featureIcon(feature);
            const isCheckIcon = FeatureIcon === Check;
            return (
              <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
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
            variant={isActive ? 'teal' : isPopular ? 'gradient' : 'primary'}
            onClick={() => onSelect(plan)}
            fullWidth
            size="lg"
            disabled={isActive}
          >
            {isActive ? '✓ Your Current Plan' : 'Get This Plan'}
          </Button>
          <button
            onClick={() => onViewDetails(plan)}
            className={cn(
              'shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-200 hover:bg-slate-50 active:scale-95',
              theme.borderHighlight,
            )}
            aria-label="View plan details"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
