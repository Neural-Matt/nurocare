'use client';

import Link from 'next/link';
import { LogoBadge } from '@/components/ui/Logo';

const links = {
  Company: ['About', 'Careers', 'Blog', 'Press'],
  Product:  ['Features', 'Pricing', 'Security', 'Roadmap'],
  Support:  ['Help Center', 'Contact', 'Status', 'Privacy'],
};

const SOCIAL_LINKS = [
  { abbr: 'X',  label: 'X (Twitter)' },
  { abbr: 'FB', label: 'Facebook' },
  { abbr: 'IG', label: 'Instagram' },
  { abbr: 'LI', label: 'LinkedIn' },
];

export function LandingFooter() {
  return (
    <footer className="bg-neutral-950 text-white px-5 sm:px-8 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <LogoBadge size="md" className="shadow-card" />
              <span className="font-display font-bold text-lg text-white">NuroCare</span>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-[220px]">
              Affordable, digital-first health insurance for every Zambian family.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map(({ abbr, label }) => (
                <button
                  key={abbr}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  {abbr}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-neutral-400 font-semibold text-xs uppercase tracking-widest mb-4">{section}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-sm">
            © 2026 NuroCare. Regulated by the Pensions and Insurance Authority of Zambia.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <Link key={l} href="#" className="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
