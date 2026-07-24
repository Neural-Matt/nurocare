'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, isNavItemActive } from '@/lib/nav-items';
import { springs } from '@/components/ui/motion';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-neutral-150"
      aria-label="Main navigation"
    >
      <div
        className="max-w-lg mx-auto flex items-stretch px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isNavItemActive(href, pathname);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex-1 flex flex-col items-center justify-center pt-2.5 pb-3 gap-[5px]',
                'min-h-[60px] transition-colors duration-150 outline-none rounded-xl',
                'focus-visible:bg-neutral-50',
                active ? 'text-primary-800' : 'text-neutral-400 hover:text-neutral-600',
              )}
            >
              {/* Icon with sliding pill background on active */}
              <div className="relative px-4 py-1.5 rounded-full">
                {active && (
                  <motion.div
                    layoutId="bottomnav-active-pill"
                    className="absolute inset-0 rounded-full bg-primary-50"
                    transition={springs.snappy}
                  />
                )}
                <Icon
                  className="relative w-[22px] h-[22px]"
                  strokeWidth={active ? 2.5 : 1.75}
                  aria-hidden="true"
                />
              </div>

              <span className={cn(
                'text-[10.5px] leading-none tracking-wide',
                active ? 'font-semibold text-primary-800' : 'font-medium',
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
