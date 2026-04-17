'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldCheck, FileText, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Five core destinations
const NAV_ITEMS = [
  { label: 'Home',       href: '/dashboard',  icon: Home        },
  { label: 'Plans',      href: '/plans',      icon: ShieldCheck },
  { label: 'Claims',     href: '/claims',     icon: FileText    },
  { label: 'Find Care',  href: '/facilities', icon: MapPin      },
  { label: 'Profile',    href: '/profile',    icon: User        },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-100"
      style={{ boxShadow: '0 -1px 0 0 rgb(241 245 249), 0 -8px 24px -4px rgb(0 0 0 / 0.06)' }}
      aria-label="Main navigation"
    >
      <div
        className="max-w-lg mx-auto flex items-stretch px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex-1 flex flex-col items-center justify-center pt-2.5 pb-3 gap-[5px]',
                'min-h-[60px] transition-colors duration-150 outline-none rounded-xl',
                'focus-visible:bg-slate-50',
                active ? 'text-primary-800' : 'text-slate-400 hover:text-slate-600',
              )}
            >
              {/* Icon with pill background on active */}
              <div className={cn(
                'relative px-4 py-1.5 rounded-full transition-all duration-200',
                active ? 'bg-primary-50' : 'bg-transparent',
              )}>
                <Icon
                  className={cn('w-[22px] h-[22px] transition-transform duration-200', active && 'scale-[1.08]')}
                  strokeWidth={active ? 2.5 : 1.75}
                  aria-hidden="true"
                />
              </div>

              <span className={cn(
                'text-[10.5px] leading-none tracking-wide transition-all duration-150',
                active ? 'font-bold text-primary-800' : 'font-medium',
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
