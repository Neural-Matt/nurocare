'use client';

import Link from 'next/link';

const links = {
  Company: ['About', 'Careers', 'Blog', 'Press'],
  Product:  ['Features', 'Pricing', 'Security', 'Roadmap'],
  Support:  ['Help Center', 'Contact', 'Status', 'Privacy'],
};

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-white px-5 sm:px-8 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-800 flex items-center justify-center shadow-md">
                <span className="text-white font-display font-bold text-xs">NH</span>
              </div>
              <span className="font-display font-bold text-lg text-white">NuroCare</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[220px]">
              Affordable, digital-first health insurance for every Zambian family.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {['X', 'FB', 'IG', 'LI'].map((s) => (
                <button
                  key={s}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest mb-4">{section}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © 2026 NuroCare. Regulated by the Pensions and Insurance Authority of Zambia.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <Link key={l} href="#" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
