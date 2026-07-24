'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { NAV_ITEMS, isNavItemActive } from '@/lib/nav-items';
import { springs } from '@/components/ui/motion';
import { LogoBadge } from '@/components/ui/Logo';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-20 lg:w-60 border-r border-neutral-150 bg-white">
      {/* Wordmark */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 lg:px-6 h-16 shrink-0" aria-label="NuroCare home">
        <LogoBadge size="md" />
        <span className="hidden lg:inline font-display font-semibold text-primary-800 text-[15px] tracking-tight">
          NuroCare
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 px-3 lg:px-4 pt-4" aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isNavItemActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'text-primary-800' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-primary-50"
                  transition={springs.snappy}
                />
              )}
              <Icon className="relative w-5 h-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
              <span className="relative hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Account footer */}
      <div className="border-t border-neutral-150 p-3 lg:p-4 flex items-center gap-3">
        <Link href="/profile" className="flex items-center gap-3 min-w-0 flex-1" aria-label="Your profile">
          <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {profile?.full_name ? getInitials(profile.full_name) : 'NC'}
          </div>
          <span className="hidden lg:block text-sm font-medium text-neutral-700 truncate">
            {profile?.full_name ?? 'Your account'}
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          aria-label="Sign out"
          className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
