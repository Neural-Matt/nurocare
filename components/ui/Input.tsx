import { cn } from '@/lib/utils';
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  /** Icon or element placed at the left edge (inside the field) */
  leftIcon?: ReactNode;
  /** Icon or element placed at the right edge (inside the field) */
  rightIcon?: ReactNode;
  /** Field display size */
  size?: 'sm' | 'md' | 'lg';
  /** Show teal success ring */
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, size = 'md', success, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const sizeStyles = {
      sm: 'px-3 py-2 text-xs',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base',
    };

    const leftPad = {
      sm: 'pl-8',
      md: 'pl-10',
      lg: 'pl-12',
    };

    const rightPad = {
      sm: 'pr-8',
      md: 'pr-10',
      lg: 'pr-12',
    };

    const iconSize = {
      sm: 'left-2.5 top-1/2 -translate-y-1/2',
      md: 'left-3.5 top-1/2 -translate-y-1/2',
      lg: 'left-4 top-1/2 -translate-y-1/2',
    };

    const iconSizeRight = {
      sm: 'right-2.5 top-1/2 -translate-y-1/2',
      md: 'right-3.5 top-1/2 -translate-y-1/2',
      lg: 'right-4 top-1/2 -translate-y-1/2',
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className={cn('absolute text-slate-400', iconSize[size])}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-white text-slate-900 placeholder:text-slate-400',
              'transition-all duration-150',
              // Focus: teal glow
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : success
                  ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                  : 'border-slate-200 focus:border-accent-500 focus:ring-accent-500/20',
              sizeStyles[size],
              leftIcon  && leftPad[size],
              rightIcon && rightPad[size],
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className={cn('absolute text-slate-400', iconSizeRight[size])}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
