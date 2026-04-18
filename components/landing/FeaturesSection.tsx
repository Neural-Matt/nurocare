'use client';

import { Shield, ClipboardList, Video, Pill } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Digital Health Cover',
    description:
      'Your policy lives on your phone. Instant digital card, real-time coverage status, and zero paperwork. Just show your phone at any partner clinic.',
    badge: 'Core',
    color: 'from-primary-800 to-primary-700',
    bg: 'bg-primary-50',
    borderColor: 'border-primary-100',
    visual: (
      <div className="w-full bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-primary-200 text-xs uppercase tracking-wide">Active Policy</p>
            <p className="text-white font-display font-bold text-xl">Standard Health</p>
          </div>
          <Shield size={28} className="text-primary-300" />
        </div>
        <div className="mb-4">
          <p className="text-primary-300 text-xs mb-1">Policy Number</p>
          <p className="text-white font-mono font-bold tracking-widest">NH-2026-00042</p>
        </div>
        <div className="flex justify-between text-primary-100 text-sm">
          <span>ZMW 350 / month</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" /> Active
          </span>
        </div>
      </div>
    ),
    reverse: false,
  },
  {
    icon: ClipboardList,
    title: 'Easy Claims Tracking',
    description:
      'Submit a claim in under 2 minutes. Upload your receipt, track status in real time, and get paid into your mobile wallet — all without a single phone call.',
    badge: 'Popular',
    color: 'from-accent-500 to-accent-600',
    bg: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    visual: (
      <div className="w-full space-y-3">
        {[
          { label: 'GP Consultation', status: 'Paid', statusColor: 'bg-emerald-100 text-emerald-700', amount: 'ZMW 280', bar: 100 },
          { label: 'Medication',      status: 'Approved', statusColor: 'bg-blue-100 text-blue-700', amount: 'ZMW 450', bar: 80 },
          { label: 'Lab Tests',       status: 'Reviewing', statusColor: 'bg-amber-100 text-amber-700', amount: 'ZMW 600', bar: 50 },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-slate-800 text-sm">{c.label}</p>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${c.statusColor}`}>{c.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-3">
                <div className="h-full bg-gradient-to-r from-accent-400 to-accent-500 rounded-full" style={{ width: `${c.bar}%` }} />
              </div>
              <span className="text-slate-500 text-xs font-medium">{c.amount}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    reverse: true,
  },
  {
    icon: Video,
    title: 'Telemedicine Access',
    description:
      'See a licensed Zambian doctor via video call — from your home, your office, or anywhere. Consultations included in your plan, no extra cost.',
    badge: 'New',
    color: 'from-primary-700 to-primary-800',
    bg: 'bg-purple-50',
    borderColor: 'border-purple-100',
    visual: (
      <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-700 px-4 py-2.5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <p className="text-slate-400 text-xs">NuroCare Tele</p>
          <div className="w-16" />
        </div>
        <div className="p-5">
          <div className="bg-slate-700 rounded-xl aspect-video flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-primary-800/50" />
            <div className="relative text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold text-lg">DR</span>
              </div>
              <p className="text-white text-xs font-semibold">Dr. Mwamba</p>
              <p className="text-slate-400 text-xs">General Physician</p>
            </div>
            <div className="absolute bottom-3 right-3 bg-emerald-500 rounded-lg px-2 py-0.5">
              <p className="text-white text-xs font-bold">● LIVE</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Video consultation</p>
            <p className="text-slate-400 text-xs mt-0.5">Covered by your plan</p>
          </div>
        </div>
      </div>
    ),
    reverse: false,
  },
  {
    icon: Pill,
    title: 'Medicine & Drug Search',
    description:
      'Search our database of 500+ covered medications. Find out what\'s covered, get dosage info, and discover affordable alternatives — instantly.',
    badge: 'Smart',
    color: 'from-warning-500 to-warning-600',
    bg: 'bg-orange-50',
    borderColor: 'border-orange-100',
    visual: (
      <div className="w-full space-y-3">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-slate-400 text-sm">🔍</span>
          <span className="text-slate-400 text-sm">Search medications…</span>
        </div>
        {[
          { name: 'Amoxicillin 500mg', type: 'Antibiotic', covered: true, price: 'ZMW 45' },
          { name: 'Metformin 850mg',   type: 'Diabetes',   covered: true, price: 'ZMW 32' },
          { name: 'Atorvastatin 20mg', type: 'Cholesterol', covered: false, price: 'ZMW 120' },
        ].map((d) => (
          <div key={d.name} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 text-sm">{d.name}</p>
              <p className="text-slate-400 text-xs">{d.type}</p>
            </div>
            <div className="text-right">
              <span className={`block px-2 py-0.5 rounded-full text-xs font-bold ${d.covered ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {d.covered ? 'Covered' : 'Not covered'}
              </span>
              <span className="text-slate-500 text-xs mt-1 block">{d.price}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    reverse: true,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-slate-50 py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Everything you need</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 leading-tight">
            Built for real life
          </h2>
          <p className="text-slate-500 text-lg mt-4 max-w-xl mx-auto">
            Every feature designed to make healthcare simpler, faster, and more human.
          </p>
        </div>

        {/* Feature rows */}
        <div className="space-y-24">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`flex flex-col ${f.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}
              >
                {/* Text side */}
                <div className={`flex-1`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full ${f.bg} border ${f.borderColor} text-xs font-bold text-slate-600`}>
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mb-4">{f.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">{f.description}</p>
                </div>

                {/* Visual side */}
                <div className="flex-1 w-full max-w-md">{f.visual}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
