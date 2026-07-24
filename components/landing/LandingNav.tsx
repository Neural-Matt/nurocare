'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/ui/Logo';

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features',     href: '#features' },
  { label: 'Plans',        href: '#pricing' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-colors duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-neutral-150' : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center p-[6px] transition-colors',
            scrolled ? 'bg-primary-800' : 'bg-white/15 border border-white/25'
          )}>
            <LogoMark className="text-white" />
          </div>
          <span className={cn(
            'font-display font-semibold text-lg tracking-tight transition-colors',
            scrolled ? 'text-primary-800' : 'text-white'
          )}>
            NuroCare
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium transition-colors duration-200',
                scrolled ? 'text-neutral-600 hover:text-primary-700' : 'text-white/85 hover:text-white'
              )}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={cn(
              'text-sm font-semibold transition-colors duration-200',
              scrolled ? 'text-neutral-700 hover:text-primary-800' : 'text-white/85 hover:text-white'
            )}
          >
            Sign in
          </Link>
          <Link href="/signup">
            <Button variant="teal" size="sm">Get Covered</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={cn(
            'md:hidden p-2 rounded-lg transition-colors duration-200',
            scrolled ? 'text-neutral-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
          )}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute inset-x-0 top-16 bg-white/95 backdrop-blur-xl border-b border-neutral-150 overflow-hidden"
          >
            <div className="px-5 py-5 flex flex-col gap-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-neutral-700 font-medium py-2 hover:text-primary-700 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-3 border-t border-neutral-150 flex flex-col gap-3">
                <Link href="/login" className="text-neutral-700 font-semibold text-center py-2 hover:text-primary-700 transition-colors">
                  Sign in
                </Link>
                <Link href="/signup">
                  <Button variant="primary" fullWidth>Get Covered</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
