'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { WhatsAppButton } from '@/components/features/WhatsAppButton';
import { LogoBadge } from '@/components/ui/Logo';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

// Pages where the floating WhatsApp button collides with page content on
// mobile — it sits on top of an active form field (claims/new), a full-width
// destructive action (profile's Sign out), or the page already centers on
// its own WhatsApp CTAs (telemedicine's per-doctor "Chat on WhatsApp", and
// profile already links to telemedicine as "See a Doctor"). Support is
// still one tap away from the header/profile on every other page.
const WHATSAPP_FAB_HIDDEN_ON = ['/claims/new', '/telemedicine', '/profile'];

export function AppShell({ children, title }: AppShellProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const showWhatsAppFab = !WHATSAPP_FAB_HIDDEN_ON.includes(pathname);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <LogoBadge size="lg" className="rounded-2xl shadow-sm" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="md:pl-20 lg:pl-60">
        <Header title={title} />
        <main className="px-4 md:px-8 pt-20 md:pt-8 pb-24 md:pb-12 scroll-smooth">
          {children}
        </main>
      </div>
      {showWhatsAppFab && <WhatsAppButton />}
      <BottomNav />
    </div>
  );
}
