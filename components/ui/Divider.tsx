import { cn } from '@/lib/utils';

interface DividerProps {
  /** Orientation of the divider line */
  orientation?: 'horizontal' | 'vertical';
  /** Optional label centered on the divider */
  label?: string;
  className?: string;
}

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div className={cn('w-px self-stretch bg-neutral-200', className)} aria-hidden="true" />
    );
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)} role="separator">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs font-medium text-neutral-400 select-none">{label}</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>
    );
  }

  return (
    <hr
      className={cn('border-0 border-t border-neutral-200', className)}
      aria-hidden="true"
    />
  );
}
