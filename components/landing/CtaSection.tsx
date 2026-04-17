'use client';

import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden bg-primary-800">
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-warning-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 mb-8 animate-float shadow-xl">
          <Shield size={26} className="text-white" />
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
          Take control of your<br className="hidden sm:block" /> health today
        </h2>

        <p className="text-white/70 text-xl leading-relaxed mb-12">
          Join thousands of Zambians who've made the smart choice. Setup takes 3 minutes.
          Your coverage starts immediately.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-accent-500 hover:bg-accent-400 text-white font-display font-extrabold text-base shadow-xl hover:shadow-accent-500/30 active:scale-95 transition-all duration-200"
          >
            Get Covered Now
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-display font-semibold text-base hover:bg-white/10 transition-all duration-200"
          >
            Compare plans
          </a>
        </div>

        <p className="text-white/50 text-sm mt-8">
          14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
