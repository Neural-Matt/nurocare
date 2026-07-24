'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { HTMLAttributes, ReactNode } from 'react';
import { springs } from './motion';

type CardVariant = 'default' | 'navy' | 'teal';

type ConflictingHandlers =
  | 'onDrag' | 'onDragStart' | 'onDragEnd'
  | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, ConflictingHandlers> {
  /** Visual style */
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  /** Optional header rendered above the card body with a subtle divider */
  header?: ReactNode;
  /** Optional footer rendered below the card body with a subtle divider */
  footer?: ReactNode;
}

const cardVariants: Record<CardVariant, string> = {
  // Clean white card — default, flat
  default: 'bg-white border border-neutral-150 shadow-card',
  // Dark navy card — for the one or two genuinely-featured surfaces
  navy:    'bg-primary-800 border-none text-white',
  // Teal-tinted surface — reserve for true active/positive state, not decoration
  teal:    'bg-accent-50 border border-accent-100',
};

export function Card({
  variant = 'default',
  padding = 'md',
  hover,
  interactive = false,
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

  const dividerColor = variant === 'navy' ? 'border-white/10' : 'border-neutral-150';

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      transition={springs.snappy}
      className={cn(
        'rounded-2xl overflow-hidden transition-colors duration-150',
        cardVariants[variant],
        hover && 'hover:shadow-card-hover hover:border-neutral-200',
        interactive && 'cursor-pointer',
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
    </motion.div>
  );
}
