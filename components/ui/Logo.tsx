import { cn } from '@/lib/utils';

interface LogoMarkProps {
  className?: string;
}

/**
 * The NuroCare mark — a shield (coverage) with a heartbeat pulse (health)
 * running through it. Renders as a standalone currentColor glyph; callers
 * control size via className and color via text color / the badge wrapper.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
    >
      <path
        d="M12 2.5 L19.5 5.5 V11.5 C19.5 16.2 16.4 19.9 12 21.5 C7.6 19.9 4.5 16.2 4.5 11.5 V5.5 Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 12.5 H9.2 L10.4 9.8 L12.4 15.4 L13.7 12.5 H17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoSize = 'sm' | 'md' | 'lg';

const badgeSizes: Record<LogoSize, string> = {
  sm: 'w-7 h-7 rounded-lg p-[5px]',
  md: 'w-8 h-8 rounded-xl p-[6px]',
  lg: 'w-12 h-12 rounded-2xl p-[9px]',
};

interface LogoBadgeProps {
  size?: LogoSize;
  className?: string;
}

/** The mark on its navy rounded-square badge — the app's primary brand chip. */
export function LogoBadge({ size = 'md', className }: LogoBadgeProps) {
  return (
    <div className={cn('bg-primary-800 text-white flex items-center justify-center shrink-0', badgeSizes[size], className)}>
      <LogoMark />
    </div>
  );
}
