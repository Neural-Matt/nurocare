'use client';

import { Star } from 'lucide-react';

const partners = ['Zambia State Insurance', 'Madison General', 'Professional Life', 'Indo Zambia Bank'];

const testimonials = [
  {
    name: 'Chanda M.',
    role: 'Teacher, Lusaka',
    text: 'My claim was approved in under 24 hours. I was shocked how easy and fast NuroCare made it.',
    rating: 5,
    avatar: 'CM',
    color: 'from-primary-800 to-primary-700',
  },
  {
    name: 'Mwila K.',
    role: 'Mother of 3, Ndola',
    text: 'Finally, health cover that actually fits my budget. The app is incredibly easy — even my husband uses it.',
    rating: 5,
    avatar: 'MK',
    color: 'from-accent-500 to-accent-600',
  },
  {
    name: 'Brian T.',
    role: 'Freelancer, Kitwe',
    text: "I searched for a drug online on NuroCare and found covered alternatives. That feature alone saves me monthly.",
    rating: 5,
    avatar: 'BT',
    color: 'from-warning-500 to-warning-600',
  },
];

export function TrustSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Partner logos */}
        <div className="text-center mb-16">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">
            Trusted partners &amp; insurers
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {partners.map((p) => (
              <div
                key={p}
                className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20">
          {[
            { value: '2,500+', label: 'Members covered' },
            { value: '98%',    label: 'Claims approved' },
            { value: '< 24h',  label: 'Avg claim time' },
            { value: '4.9 ★',  label: 'App rating' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <p className="font-display font-extrabold text-3xl text-primary-800">{s.value}</p>
              <p className="text-slate-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900">
            Loved by our members
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-up stagger-${i + 1}`}
            >
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
