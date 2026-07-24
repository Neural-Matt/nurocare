'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { LogoBadge } from '@/components/ui/Logo';

interface AdminShellProps {
  children: React.ReactNode;
}

/**
 * Desktop-first shell for the internal admin tool. Unlike AppShell, there's
 * no BottomNav on mobile — admin usage is expected to be desktop/staff-only,
 * so mobile just gets the same sidebar-less chrome at a narrower width.
 */
export function AdminShell({ children }: AdminShellProps) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && profile && profile.role !== 'admin') router.replace('/dashboard');
  }, [user, profile, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  if (loading || !user || profile?.role !== 'admin') {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-60 border-r border-neutral-150 bg-white">
        <div className="flex items-center gap-2.5 px-6 h-16 shrink-0">
          <LogoBadge size="md" />
          <div>
            <p className="font-display font-semibold text-primary-800 text-sm leading-tight">NuroCare</p>
            <p className="text-[11px] text-neutral-400 leading-tight">Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-4 pt-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit to app
          </Link>
        </nav>

        <div className="border-t border-neutral-150 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {profile?.full_name ? getInitials(profile.full_name) : 'NC'}
          </div>
          <span className="text-sm font-medium text-neutral-700 truncate flex-1">
            {profile?.full_name ?? 'Admin'}
          </span>
          <button
            onClick={handleSignOut}
            aria-label="Sign out"
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-8 h-14 bg-white/90 backdrop-blur-lg border-b border-neutral-150">
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-semibold text-primary-800">Admin</span>
          </Link>
          <div className="hidden md:block text-sm font-semibold text-neutral-900">Admin Dashboard</div>
          <button
            onClick={handleSignOut}
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:bg-neutral-100"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <main className="px-4 md:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
