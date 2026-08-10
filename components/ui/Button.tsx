'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { springs } from './motion';

type ConflictingHandlers =
  | 'onDrag' | 'onDragStart' | 'onDragEnd'
  | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers> {
  /** Visual style of the button */
  variant?: 'primary' | 'teal' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  /** Icon placed before label */
  leadingIcon?: ReactNode;
  /** Icon placed after label */
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, leadingIcon, trailingIcon, className, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      // Deep navy — primary actions
      primary:
        'bg-primary-800 text-white hover:bg-primary-700 focus-visible:ring-primary-800',
      // Solid teal — secondary/positive actions
      teal:
        'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500',
      // Outline navy
      outline:
        'border border-neutral-300 text-primary-800 hover:bg-neutral-50 focus-visible:ring-primary-800',
      // Ghost — minimal
      ghost:
        'text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-400',
      // Danger
      danger:
        'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-400',
    };

    const sizes = {
      sm: 'text-xs px-3 py-2 gap-1.5 rounded-lg',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2',
      xl: 'text-base px-8 py-4 gap-2.5 rounded-2xl font-bold',
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileTap={disabled || loading ? undefined : { scale: 0.96 }}
        transition={springs.snappy}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
            {children}
            {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
