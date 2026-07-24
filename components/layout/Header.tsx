'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { FamilyMemberSwitcher } from '@/components/features/FamilyMemberSwitcher';
import { NotificationBell } from '@/components/features/NotificationBell';
import { LogoMark } from '@/components/ui/Logo';

// Map routes to human-readable breadcrumb parents
const ROUTE_PARENT: Record<string, { label: string; href: string }> = {
  '/claims/new':   { label: 'Claims',  href: '/claims'  },
  '/claims':       { label: 'Home',    href: '/dashboard' },
  '/plans':        { label: 'Home',    href: '/dashboard' },
  '/drugs':        { label: 'Home',    href: '/dashboard' },
  '/profile':      { label: 'Home',    href: '/dashboard' },
  '/admin':        { label: 'Home',    href: '/dashboard' },
  '/family':       { label: 'Home',    href: '/dashboard' },
  '/payments':     { label: 'Home',    href: '/dashboard' },
  '/telemedicine': { label: 'Home',    href: '/dashboard' },
};

// Pages that show the family member switcher
const SWITCHER_PAGES = ['/dashboard', '/claims', '/plans', '/facilities'];

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { profile } = useAuth();
  const pathname = usePathname();

  // Detect if we're on a deep nested page (e.g., /claims/[id])
  const claimsDetailMatch = pathname.match(/^\/claims\/([^/]+)$/);
  const isDeepPage = !!(claimsDetailMatch && pathname !== '/claims/new');
  const showSwitcher = SWITCHER_PAGES.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const parent = ROUTE_PARENT[pathname];

  return (
    <header
      className="fixed top-0 left-0 right-0 md:left-20 lg:left-60 z-30 bg-white/90 backdrop-blur-lg border-b border-neutral-150"
    >
      <div className="px-4 md:px-8 h-16 md:h-14 flex items-center justify-between gap-3">

        {/* Left — logo, title, or back button */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isDeepPage ? (
            /* Back arrow for claims detail */
            <Link
              href="/claims"
              className="flex items-center gap-1.5 text-neutral-500 hover:text-primary-800 transition-colors -ml-1"
              aria-label="Back to Claims"
            >
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold">Claims</span>
            </Link>
          ) : title ? (
            /* Page title — used for inner pages */
            <h1 className="text-[17px] md:text-base font-semibold text-primary-800 truncate">{title}</h1>
          ) : (
            /* Wordmark — dashboard / home. Sidebar already owns branding on md+. */
            <Link href="/dashboard" className="flex items-center gap-2 group md:hidden" aria-label="NuroCare home">
              <div className={cn(
                'w-8 h-8 bg-primary-800 rounded-xl flex items-center justify-center p-[6px]',
                'group-hover:bg-primary-700 transition-colors',
              )}>
                <LogoMark className="text-white" />
              </div>
              <span className="font-display font-semibold text-primary-800 text-[17px] tracking-tight">
                NuroCare
              </span>
            </Link>
          )}
        </div>

        {/* Centre — family member switcher (context-aware pages) */}
        {showSwitcher && !isDeepPage && (
          <div className="flex justify-center">
            <FamilyMemberSwitcher />
          </div>
        )}

        {/* Right — actions */}
        <div className="flex items-center gap-1 shrink-0">
          <NotificationBell />
          <Link href="/profile" aria-label="Your profile" className="md:hidden">
            <div className={cn(
              'w-9 h-9 rounded-full bg-primary-800 flex items-center justify-center',
              'text-[11px] font-bold text-white',
              'hover:bg-primary-700 transition-colors ring-2 ring-white',
            )}>
              {profile?.full_name ? getInitials(profile.full_name) : 'NC'}
            </div>
          </Link>
        </div>
      </div>

      {/* Breadcrumb stripe for pages with a clear parent */}
      {parent && !isDeepPage && (
        <div className="px-4 md:px-8 pb-2 -mt-0.5">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Link href={parent.href} className="hover:text-accent-600 transition-colors font-medium">
              {parent.label}
            </Link>
            <span className="text-neutral-200">/</span>
            <span className="text-neutral-500 font-semibold">{title}</span>
          </div>
        </div>
      )}
    </header>
  );
}
