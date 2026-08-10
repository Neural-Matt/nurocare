import { cn, formatCurrency } from '@/lib/utils';

type MetricSize = 'sm' | 'md' | 'lg' | 'xl';
type MetricColor = 'default' | 'inverse' | 'accent' | 'primary';

const valueSizes: Record<MetricSize, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl sm:text-4xl',
  xl: 'text-4xl sm:text-5xl',
};

const unitSizes: Record<MetricSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

const colors: Record<MetricColor, string> = {
  default: 'text-neutral-900',
  inverse: 'text-white',
  accent: 'text-accent-600',
  primary: 'text-primary-800',
};

const mutedColors: Record<MetricColor, string> = {
  default: 'text-neutral-400',
  inverse: 'text-white/50',
  accent: 'text-accent-400',
  primary: 'text-primary-400',
};

interface MetricNumberProps {
  value: string | number;
  /** Trailing unit, e.g. "days", "claims" — rendered smaller and muted. */
  unit?: string;
  size?: MetricSize;
  color?: MetricColor;
  className?: string;
}

/**
 * Weighted display for a bare metric (a count, a day count, a percentage).
 * Financial figures should use `CurrencyDisplay` instead so the currency
 * marker gets consistent smaller/muted treatment.
 */
export function MetricNumber({ value, unit, size = 'md', color = 'default', className }: MetricNumberProps) {
  return (
    <span className={cn('font-display font-bold tabular-nums tracking-tight inline-flex items-baseline gap-1.5', colors[color], className)}>
      <span className={valueSizes[size]}>{value}</span>
      {unit && <span className={cn('font-medium', unitSizes[size], mutedColors[color])}>{unit}</span>}
    </span>
  );
}

interface CurrencyDisplayProps {
  amount: number;
  size?: MetricSize;
  color?: MetricColor;
  className?: string;
}

/**
 * Weighted display for money — the number carries the visual weight, the
 * currency marker (e.g. "ZMW") renders smaller and muted alongside it, so a
 * K10,000 premium reads as significant rather than as plain body text.
 */
export function CurrencyDisplay({ amount, size = 'md', color = 'default', className }: CurrencyDisplayProps) {
  const formatted = formatCurrency(amount);
  const match = formatted.match(/^([^\d-]*)(-?[\d,.\s]+)$/);
  const symbol = match?.[1]?.trim();
  const numeric = match?.[2]?.trim() ?? formatted;

  return (
    <span className={cn('font-display font-bold tabular-nums tracking-tight inline-flex items-baseline gap-1', colors[color], className)}>
      {symbol && <span className={cn('font-semibold', unitSizes[size], mutedColors[color])}>{symbol}</span>}
      <span className={valueSizes[size]}>{numeric}</span>
    </span>
  );
}
