'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-100/50 shadow-lg'
          : 'bg-gradient-to-b from-primary-800/80 to-primary-800/0 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-all ${
            scrolled
              ? 'bg-primary-800 group-hover:bg-primary-700'
              : 'bg-white/20 group-hover:bg-white/30 border border-white/30'
          }`}>
            <span className={`font-display font-bold text-xs tracking-tight ${scrolled ? 'text-white' : 'text-white'}`}>
              NC
            </span>
          </div>
          <span className={`font-display font-bold text-lg tracking-tight transition-colors ${scrolled ? 'text-primary-800' : 'text-white'}`}>
            NuroCare
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                scrolled
                  ? 'text-slate-600 hover:text-primary-700'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={`text-sm font-semibold transition-colors duration-200 ${
              scrolled
                ? 'text-slate-700 hover:text-primary-800'
                : 'text-white/90 hover:text-white'
            }`}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${
              scrolled
                ? 'bg-accent-500 hover:bg-accent-600 text-white shadow-md shadow-accent-500/20'
                : 'bg-accent-500 hover:bg-accent-400 text-white shadow-lg shadow-accent-500/40'
            }`}
          >
            Get Covered
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
            scrolled
              ? 'text-slate-700 hover:bg-slate-100'
              : 'text-white hover:bg-white/10'
          }`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-2xl px-5 py-5 flex flex-col gap-4 animate-fade-up">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-slate-700 font-medium py-2 hover:text-primary-700 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
            <Link href="/login" className="text-slate-700 font-semibold text-center py-2 hover:text-primary-700 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-primary-800 to-primary-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Get Covered →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
