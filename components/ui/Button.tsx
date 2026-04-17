import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  variant?: 'primary' | 'gradient' | 'teal' | 'orange' | 'outline' | 'outline-teal' | 'ghost' | 'danger';
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
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      // Deep navy — primary actions
      primary:
        'bg-primary-800 text-white hover:bg-primary-700 focus-visible:ring-primary-800 shadow-sm',
      // Gradient blue→teal — hero CTAs
      gradient:
        'bg-gradient-to-r from-primary-800 via-primary-700 to-accent-500 text-white ' +
        'hover:from-primary-700 hover:via-primary-600 hover:to-accent-400 ' +
        'focus-visible:ring-accent-500 shadow-md hover:shadow-lg hover:shadow-accent-500/25 ' +
        'transition-shadow',
      // Teal — secondary/positive actions
      teal:
        'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500 shadow-sm',
      // Orange — CTAs and highlights
      orange:
        'bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-500 shadow-sm',
      // Outline navy
      outline:
        'border-2 border-primary-800 text-primary-800 hover:bg-primary-50 focus-visible:ring-primary-800',
      // Outline teal
      'outline-teal':
        'border-2 border-accent-500 text-accent-600 hover:bg-accent-50 focus-visible:ring-accent-500',
      // Ghost
      ghost:
        'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
      // Danger
      danger:
        'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400',
    };

    const sizes = {
      sm: 'text-xs px-3 py-2 gap-1.5 rounded-lg',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2',
      xl: 'text-base px-8 py-4 gap-2.5 rounded-2xl font-bold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
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
      </button>
    );
  }
);

Button.displayName = 'Button';
