'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MetricNumber } from '@/components/ui/MetricNumber';
import { RevealOnScroll, ParallaxLayer } from '@/components/ui/motion';
import { NetworkMotif } from '@/components/ui/NetworkMotif';

const STATS = [
  { value: '2,500+', unit: 'members' },
  { value: '98', unit: '% approved' },
  { value: '<2', unit: 'min to claim' },
];

const RECENT_ACTIVITY = [
  { label: 'GP Consultation', amount: 'ZMW 280', status: 'Paid' },
  { label: 'Medication', amount: 'ZMW 150', status: 'Approved' },
];

// Inline feTurbulence grain — a flat, tactile texture over the gradient so
// the hero reads as a designed surface rather than a solid CSS fill.
const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function HeroSection() {
  return (
    <section className="relative bg-primary-900 overflow-hidden">
      {/* Layered backdrop: radial glow + grain + network motif, not a flat fill */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(1100px 620px at 78% -8%, rgba(20,184,166,0.20), transparent 60%), radial-gradient(900px 500px at -10% 100%, rgba(10,37,64,0.9), transparent 55%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN_URI}")` }}
      />
      <div className="absolute top-0 right-0 w-[720px] h-[640px] pointer-events-none opacity-40 -mr-20 -mt-16">
        <NetworkMotif tone="teal" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-36 sm:pt-44 pb-20 lg:pb-28">
        {/* ── Kicker ── */}
        <RevealOnScroll>
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-8 bg-accent-400/60" />
            <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-accent-400/90">
              Digital health infrastructure — Zambia
            </span>
          </div>
        </RevealOnScroll>

        {/* ── Oversized asymmetric headline ── */}
        <RevealOnScroll delay={0.05}>
          <h1 className="font-display leading-[0.94] tracking-[-0.035em] text-white mb-12 max-w-4xl">
            <span className="block font-medium text-[3.1rem] sm:text-7xl lg:text-[6.5rem]">
              Healthcare
            </span>
            <span className="block font-medium text-[3.1rem] sm:text-7xl lg:text-[6.5rem]">
              you can{' '}
              <span className="font-serif italic font-normal text-accent-400">rely</span> on.
            </span>
          </h1>
        </RevealOnScroll>

        {/* ── Copy + CTAs (left) / layered card stack (right, overlapping) ── */}
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-16 items-end">
          <div className="lg:col-span-6 xl:col-span-5">
            <RevealOnScroll delay={0.1}>
              <p className="text-white/55 text-lg sm:text-xl leading-relaxed max-w-md mb-9">
                The digital infrastructure connecting your family to cover,
                care, and claims — in one app, with nothing lost in the
                paperwork.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Link href="/signup">
                  <Button variant="teal" size="lg" trailingIcon={<ArrowRight size={17} />}>
                    Get Covered Today
                  </Button>
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center h-[52px] text-white/80 hover:text-white text-sm font-semibold border-b border-white/25 hover:border-white transition-colors"
                >
                  View Plans
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/45">
                {['Regulated by PIA', 'No paperwork', 'Cancel anytime'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-accent-400/80 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* ── Layered policy-card stack — pulled up to overlap the headline's baseline ── */}
          <div className="lg:col-span-6 xl:col-span-7 lg:-mt-16">
            <RevealOnScroll delay={0.18} className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <ParallaxLayer offset={14}>
                <div className="relative">
                  {/* Back card — claim activity, rotated + offset for depth */}
                  <div className="absolute -right-4 -top-5 w-[88%] rotate-[4deg] rounded-3xl bg-white/[0.04] border border-white/10 p-5 backdrop-blur-sm">
                    <p className="text-white/30 text-[11px] uppercase tracking-wider mb-3">Recent Activity</p>
                    <div className="space-y-2">
                      {RECENT_ACTIVITY.map((c) => (
                        <div key={c.label} className="flex items-center justify-between">
                          <p className="text-white/70 text-sm">{c.label}</p>
                          <span className="text-accent-300/80 text-xs font-semibold">{c.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Front card — active policy */}
                  <div className="relative rotate-[-2deg] rounded-3xl bg-white/[0.07] border border-white/10 p-6 shadow-elevated backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-white/40 text-[11px] uppercase tracking-wider mb-1">Active Policy</p>
                        <p className="text-white font-display font-semibold text-xl">Standard Health</p>
                      </div>
                      <span className="flex items-center gap-1.5 bg-accent-500/15 text-accent-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-accent-400/20 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div className="bg-white/[0.06] rounded-xl p-3.5">
                        <p className="text-white/40 text-[11px] mb-1">Policy No.</p>
                        <p className="text-white text-sm font-mono font-medium">NC-2026-042</p>
                      </div>
                      <div className="bg-white/[0.06] rounded-xl p-3.5">
                        <p className="text-white/40 text-[11px] mb-1">Premium</p>
                        <p className="text-accent-300 text-sm font-semibold">ZMW 350/mo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ParallaxLayer>
            </RevealOnScroll>
          </div>
        </div>

        {/* ── Stat strip — large tabular numerals, minimal framing ── */}
        <RevealOnScroll delay={0.24}>
          <div className="mt-28 lg:mt-20 flex flex-wrap gap-x-14 gap-y-6">
            {STATS.map(({ value, unit }) => (
              <MetricNumber key={unit} value={value} unit={unit} size="lg" color="inverse" />
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
