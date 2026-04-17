'use client';

import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle2, Smartphone, FileText, MapPin, MessageCircle } from 'lucide-react';

const STATS = [
  { value: '2,500+', label: 'Active Members' },
  { value: 'ZMW 150', label: 'Plans from' },
  { value: '< 2 min', label: 'To submit a claim' },
  { value: '4', label: 'Insurance partners' },
];

const FEATURE_PILLS = [
  { icon: Shield,         label: 'Health Cover'       },
  { icon: MessageCircle,  label: 'Telemedicine'       },
  { icon: MapPin,         label: 'Find Facilities'    },
  { icon: FileText,       label: 'Easy Claims'        },
  { icon: Smartphone,     label: '100% Digital'       },
];

export function HeroSection() {
  return (
    <section className="relative bg-primary-800 overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Glow accents — contained, won't bleed */}
      <div className="absolute top-0 right-0 w-[560px] h-[560px] rounded-full bg-accent-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[480px] h-[480px] rounded-full bg-primary-600/20 blur-[100px] pointer-events-none" />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-20 lg:pb-28">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* ── Left: Copy ── */}
          <div className="flex-1 text-center lg:text-left">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/75 text-xs font-semibold tracking-wide mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
              Digital health cover · Now in Zambia
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-[2.75rem] sm:text-6xl lg:text-[4.25rem] text-white leading-[1.05] tracking-tight mb-6">
              Healthcare you can{' '}
              <br className="hidden sm:block" />
              <span className="text-accent-400">rely on.</span>
            </h1>

            {/* Subheading */}
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
              Affordable, digital health cover for every Zambian family. One app.
              Instant cover. Total peace of mind.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-10">
              <Link
                href="/signup"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-400 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-accent-500/25 transition-all duration-150"
              >
                Get Covered Today
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 bg-white/6 hover:bg-white/12 text-white font-semibold text-base transition-all duration-150"
              >
                View Plans
              </a>
            </div>

            {/* Trust checkmarks */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-sm text-white/55">
              {[
                'Regulated by PIA',
                'No paperwork',
                'Cancel anytime',
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent-400 shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: App preview ── */}
          <div className="flex-shrink-0 w-full max-w-[340px] lg:max-w-[380px] mx-auto">
            {/* Phone frame */}
            <div className="relative bg-slate-900 rounded-[2.4rem] p-[10px] shadow-2xl shadow-black/40 border border-white/8 ring-1 ring-white/5">
              {/* Screen */}
              <div className="rounded-[1.9rem] overflow-hidden bg-slate-50">
                {/* Status bar */}
                <div className="bg-primary-900 px-5 py-2.5 flex items-center justify-between">
                  <span className="text-white/50 text-[10px] font-medium">9:41</span>
                  <div className="w-16 h-4 bg-primary-900 rounded-full flex items-center justify-center">
                    <div className="w-10 h-2 rounded-full bg-black/60" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-1.5 rounded-sm bg-white/40" />
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                  </div>
                </div>

                {/* App content */}
                <div className="px-3.5 py-3 space-y-3 bg-slate-50">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">Good morning,</p>
                      <p className="text-sm font-bold text-primary-800">Chanda 👋</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-primary-800 flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">CM</span>
                    </div>
                  </div>

                  {/* Policy card */}
                  <div className="relative overflow-hidden rounded-2xl bg-primary-800 p-3.5 text-white">
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-accent-500/20 blur-xl" />
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white/40 text-[9px] uppercase tracking-wider">Active Policy</p>
                        <p className="text-sm font-bold">Standard Health</p>
                      </div>
                      <span className="flex items-center gap-1 bg-accent-500/20 text-accent-300 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-accent-400/25">
                        <span className="w-1 h-1 rounded-full bg-accent-400 animate-pulse" />
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/10 rounded-lg p-2">
                        <p className="text-white/40 text-[8px] mb-0.5">Policy No.</p>
                        <p className="text-white text-[9px] font-mono font-semibold">NH-2026-042</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <p className="text-white/40 text-[8px] mb-0.5">Premium</p>
                        <p className="text-accent-300 text-[10px] font-bold">ZMW 350/mo</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Find Care',  bg: 'bg-warning-100',  dot: 'bg-warning-500' },
                      { label: 'Claim',      bg: 'bg-accent-100',   dot: 'bg-accent-500'  },
                      { label: 'Doctor',     bg: 'bg-blue-100',     dot: 'bg-blue-500'    },
                      { label: 'Drugs',      bg: 'bg-violet-100',   dot: 'bg-violet-500'  },
                    ].map((a) => (
                      <div key={a.label} className={`${a.bg} rounded-xl p-2 flex flex-col items-center gap-1`}>
                        <div className={`w-4 h-4 rounded-full ${a.dot}`} />
                        <span className="text-slate-700 text-[8px] font-semibold leading-tight text-center">{a.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recent claim */}
                  <div className="bg-white rounded-xl p-2.5 shadow-sm border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Recent Activity</p>
                    {[
                      { label: 'GP Consultation', amount: 'ZMW 280', status: 'Paid',     statusColor: 'bg-emerald-100 text-emerald-700' },
                      { label: 'Medication',       amount: 'ZMW 150', status: 'Approved', statusColor: 'bg-blue-100 text-blue-700'     },
                    ].map((c) => (
                      <div key={c.label} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-700">{c.label}</p>
                          <p className="text-[9px] text-slate-400">{c.amount}</p>
                        </div>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${c.statusColor}`}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x sm:divide-white/10">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center sm:px-8">
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-0.5">{value}</p>
              <p className="text-white/45 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hard bottom edge — no fade bleed */}
      <div className="h-1 bg-gradient-to-r from-primary-700 via-accent-500 to-primary-700" />
    </section>
  );
}
