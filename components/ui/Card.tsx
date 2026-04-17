import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'flat' | 'outline' | 'navy' | 'teal';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style */
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  /** Optional header rendered above the card body with a subtle divider */
  header?: ReactNode;
  /** Optional footer rendered below the card body with a subtle divider */
  footer?: ReactNode;
}

const cardVariants: Record<CardVariant, string> = {
  // Clean white card — default
  default:  'bg-white border border-slate-100/80 shadow-card',
  // Lifted — more shadow
  elevated: 'bg-white border border-slate-100 shadow-md',
  // No shadow, subtle border only
  flat:     'bg-white border border-slate-200',
  // Border-only (transparent bg)
  outline:  'bg-transparent border-2 border-primary-100',
  // Dark navy card — for highlight/featured blocks
  navy:     'bg-primary-800 border-none text-white',
  // Teal-tinted surface
  teal:     'bg-accent-50 border border-accent-100',
};

export function Card({
  variant = 'default',
  padding = 'md',
  hover,
  header,
  footer,
  className,
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm:   'p-3',
    md:   'p-4',
    lg:   'p-6',
    xl:   'p-8',
  };

  const dividerColor =
    variant === 'navy' ? 'border-white/10' : 'border-slate-100';

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden',
        cardVariants[variant],
        hover && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        !header && !footer && paddings[padding],
        className
      )}
      {...props}
    >
      {header && (
        <div className={cn('border-b', dividerColor, paddings[padding])}>
          {header}
        </div>
      )}

      <div className={header || footer ? paddings[padding] : ''}>
        {children}
      </div>

      {footer && (
        <div className={cn('border-t', dividerColor, paddings[padding])}>
          {footer}
        </div>
      )}
    </div>
  );
}
