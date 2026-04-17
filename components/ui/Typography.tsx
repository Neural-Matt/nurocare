import { cn } from '@/lib/utils';
import { ElementType, HTMLAttributes } from 'react';

// ─────────────────────────────────────────────
// Typography scale for NuroCare design system
//
// Headings  → font-display (Plus Jakarta Sans), tight leading
// Body      → font-sans (Inter), relaxed leading
// Caption   → font-sans, muted color, small size
// ─────────────────────────────────────────────


// ── Heading ──────────────────────────────────
type HeadingSize = 'hero' | 'h1' | 'h2' | 'h3' | 'h4';
type HeadingColor = 'default' | 'primary' | 'accent' | 'inverse' | 'muted';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  size?: HeadingSize;
  color?: HeadingColor;
  /** Render the teal-to-warning gradient text */
  gradient?: boolean;
}

const headingSizes: Record<HeadingSize, string> = {
  hero: 'text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.07] tracking-tight',
  h1:   'text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight',
  h2:   'text-2xl sm:text-3xl font-bold leading-tight tracking-tight',
  h3:   'text-xl sm:text-2xl font-bold leading-snug',
  h4:   'text-base sm:text-lg font-semibold leading-snug',
};

const headingColors: Record<HeadingColor, string> = {
  default: 'text-slate-900',
  primary: 'text-primary-800',
  accent:  'text-accent-600',
  inverse: 'text-white',
  muted:   'text-slate-500',
};

export function Heading({
  as: Tag = 'h2',
  size = 'h2',
  color = 'default',
  gradient = false,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        'font-display',
        headingSizes[size],
        gradient
          ? 'text-gradient bg-gradient-to-r from-accent-400 via-accent-300 to-warning-400'
          : headingColors[color],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ── Text (body) ───────────────────────────────
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
type TextColor = 'default' | 'secondary' | 'muted' | 'primary' | 'accent' | 'inverse' | 'error';

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: TextSize;
  color?: TextColor;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  leading?: 'tight' | 'snug' | 'normal' | 'relaxed';
}

const textSizes: Record<TextSize, string> = {
  xs:   'text-xs',
  sm:   'text-sm',
  base: 'text-base',
  lg:   'text-lg',
  xl:   'text-xl',
};

const textColors: Record<TextColor, string> = {
  default:   'text-slate-900',
  secondary: 'text-slate-600',
  muted:     'text-slate-400',
  primary:   'text-primary-800',
  accent:    'text-accent-600',
  inverse:   'text-white',
  error:     'text-red-500',
};

const textWeights: Record<NonNullable<TextProps['weight']>, string> = {
  normal:   'font-normal',
  medium:   'font-medium',
  semibold: 'font-semibold',
  bold:     'font-bold',
};

const textLeadings: Record<NonNullable<TextProps['leading']>, string> = {
  tight:   'leading-tight',
  snug:    'leading-snug',
  normal:  'leading-normal',
  relaxed: 'leading-relaxed',
};

export function Text({
  as: Tag = 'p',
  size = 'base',
  color = 'default',
  weight = 'normal',
  leading = 'relaxed',
  className,
  children,
  ...props
}: TextProps) {
  const Component = Tag;
  return (
    <Component
      className={cn(
        'font-sans',
        textSizes[size],
        textColors[color],
        textWeights[weight],
        textLeadings[leading],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// ── Caption ───────────────────────────────────
interface CaptionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  color?: 'default' | 'muted' | 'primary' | 'accent' | 'error' | 'inverse';
  uppercase?: boolean;
}

const captionColors: Record<NonNullable<CaptionProps['color']>, string> = {
  default: 'text-slate-500',
  muted:   'text-slate-400',
  primary: 'text-primary-800',
  accent:  'text-accent-600',
  error:   'text-red-500',
  inverse: 'text-white/60',
};

export function Caption({
  as: Tag = 'span',
  color = 'default',
  uppercase = false,
  className,
  children,
  ...props
}: CaptionProps) {
  const Component = Tag;
  return (
    <Component
      className={cn(
        'font-sans text-xs leading-normal',
        captionColors[color],
        uppercase && 'uppercase tracking-widest font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// ── Label (form labels) ───────────────────────
interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  required?: boolean;
}

export function Label({ htmlFor, required, className, children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('font-sans text-sm font-medium text-slate-700 leading-none', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
    </label>
  );
}

// ── Overline (section label above headings) ───
interface OverlineProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  color?: 'default' | 'accent' | 'primary' | 'inverse';
}

const overlineColors: Record<NonNullable<OverlineProps['color']>, string> = {
  default: 'text-primary-800',
  accent:  'text-accent-500',
  primary: 'text-primary-800',
  inverse: 'text-white/60',
};

export function Overline({
  as: Tag = 'p',
  color = 'default',
  className,
  children,
  ...props
}: OverlineProps) {
  const Component = Tag;
  return (
    <Component
      className={cn(
        'font-display text-sm font-semibold uppercase tracking-widest',
        overlineColors[color],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
