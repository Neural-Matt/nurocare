'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RevealOnScroll, ParallaxLayer } from '@/components/ui/motion';
import { NetworkMotif } from '@/components/ui/NetworkMotif';

const STATS = [
  { value: '2,500+', label: 'Active Members' },
  { value: 'ZMW 150', label: 'Plans from' },
  { value: '< 2 min', label: 'To submit a claim' },
  { value: '4', label: 'Insurance partners' },
];

const RECENT_ACTIVITY = [
  { label: 'GP Consultation', amount: 'ZMW 280', status: 'Paid' },
  { label: 'Medication', amount: 'ZMW 150', status: 'Approved' },
];

export function HeroSection() {
  return (
    <section className="relative bg-primary-800 overflow-hidden">
      {/* Spatial backdrop — abstract infrastructure network standing in for a literal 3D scene */}
      <div className="absolute -top-10 right-0 w-[560px] h-[480px] pointer-events-none opacity-60">
        <NetworkMotif tone="teal" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/40 via-transparent to-primary-800 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-20 lg:pb-28">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* ── Left: Copy ── */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5 text-white/75 text-xs font-semibold tracking-wide mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
              Digital health cover · Now in Zambia
            </div>

            <h1 className="font-display font-bold text-[2.75rem] sm:text-6xl lg:text-[4.25rem] text-white leading-[1.05] tracking-[-0.02em] mb-6">
              Healthcare you can{' '}
              <br className="hidden sm:block" />
              <span className="text-accent-400">rely on.</span>
            </h1>

            <p className="text-white/60 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
              The digital infrastructure connecting your family to cover, care,
              and claims — in one app, with nothing lost in the paperwork.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-10">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="teal" size="lg" fullWidth trailingIcon={<ArrowRight size={17} />}>
                  Get Covered Today
                </Button>
              </Link>
              <a href="#pricing" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="border-white/25 text-white hover:bg-white/10"
                >
                  View Plans
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-sm text-white/55">
              {['Regulated by PIA', 'No paperwork', 'Cancel anytime'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent-400 shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Policy preview, built from real primitives — not a fake device mockup ── */}
          <RevealOnScroll className="flex-shrink-0 w-full max-w-sm mx-auto" delay={0.1}>
          <ParallaxLayer offset={16}>
            <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-5 shadow-elevated backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1">Active Policy</p>
                  <p className="text-white font-display font-semibold text-lg">Standard Health</p>
                </div>
                <span className="flex items-center gap-1.5 bg-accent-500/15 text-accent-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-accent-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <p className="text-white/40 text-[11px] mb-1">Policy No.</p>
                  <p className="text-white text-sm font-mono font-medium">NC-2026-042</p>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <p className="text-white/40 text-[11px] mb-1">Premium</p>
                  <p className="text-accent-300 text-sm font-semibold">ZMW 350/mo</p>
                </div>
              </div>

              <p className="text-white/40 text-[11px] uppercase tracking-wider mb-2.5">Recent Activity</p>
              <div className="space-y-2">
                {RECENT_ACTIVITY.map((c) => (
                  <div key={c.label} className="flex items-center justify-between bg-white/[0.04] rounded-xl px-3 py-2.5">
                    <div>
                      <p className="text-white text-sm font-medium">{c.label}</p>
                      <p className="text-white/40 text-xs">{c.amount}</p>
                    </div>
                    <span className="text-accent-300 text-xs font-semibold">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </ParallaxLayer>
          </RevealOnScroll>
        </div>

        {/* ── Stats bar ── */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x sm:divide-white/10">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center sm:px-8">
              <p className="font-display font-semibold text-2xl sm:text-3xl text-white mb-0.5">{value}</p>
              <p className="text-white/45 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
