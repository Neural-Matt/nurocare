'use client';

import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic Care',
    price: 150,
    period: 'month',
    tagline: 'Essential coverage to get started',
    popular: false,
    color: 'border-slate-200',
    badge: null,
    features: [
      'GP Consultations (6/year)',
      'Medication Cover (ZMW 500/mo)',
      'Emergency Care',
      'Basic Lab Tests',
      'Digital Policy Card',
    ],
    cta: 'Get Basic',
    ctaStyle: 'border border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100',
  },
  {
    id: 'standard',
    name: 'Standard Health',
    price: 350,
    period: 'month',
    tagline: 'Best value for families',
    popular: true,
    color: 'border-accent-500 ring-2 ring-accent-500/30',
    badge: 'Most popular',
    features: [
      'Unlimited GP Visits',
      'Specialist Referrals',
      'Hospitalization (7 days)',
      'Medication Cover (ZMW 1,500/mo)',
      'Basic Dental & Eye Tests',
      'Telemedicine Access',
    ],
    cta: 'Get Standard',
    ctaStyle: 'bg-primary-800 hover:bg-primary-700 text-white shadow-lg shadow-primary-800/30',
  },
  {
    id: 'premium',
    name: 'Premium Plus',
    price: 750,
    period: 'month',
    tagline: 'Full-spectrum family protection',
    popular: false,
    color: 'border-purple-200',
    badge: null,
    features: [
      'Unlimited Consultations',
      'Full Specialist Access',
      'Unlimited Hospitalization',
      'Maternity Cover',
      'Comprehensive Dental',
      'Mental Health Support',
      'International Emergency',
    ],
    cta: 'Get Premium',
    ctaStyle: 'border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative bg-white py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3 inline-flex items-center gap-2 bg-accent-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent-500"></span> Transparent Pricing
          </p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-primary-800 leading-tight mb-4">
            Plans for every family
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            No hidden fees. Cancel anytime. Coverage starts immediately upon purchase.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative group animate-fade-up rounded-3xl transition-all duration-300 ${
                plan.popular
                  ? 'sm:scale-105 shadow-2xl shadow-primary-800/10 bg-gradient-to-br from-primary-800 to-primary-700 text-white border border-primary-700'
                  : 'bg-white border-2 border-slate-100 hover:border-accent-200 hover:shadow-lg hover:-translate-y-1'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-accent-400 to-accent-500 text-primary-900 text-xs font-bold shadow-lg">
                    <Zap size={13} className="fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan info */}
                <div className="mb-6">
                  <h3 className={`font-display font-bold text-2xl mb-1 ${plan.popular ? 'text-white' : 'text-primary-800'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-white/70' : 'text-slate-500'}`}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1 mb-1">
                    <span className={`text-sm font-medium self-start mt-2 ${plan.popular ? 'text-white/60' : 'text-slate-500'}`}>ZMW</span>
                    <span className={`font-display font-extrabold text-5xl leading-none ${plan.popular ? 'text-white' : 'text-primary-800'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm self-end mb-1 ${plan.popular ? 'text-white/60' : 'text-slate-500'}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={`text-xs ${plan.popular ? 'text-white/50' : 'text-slate-400'}`}>
                    Billed monthly, cancel anytime
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 pb-8 border-b border-opacity-20 border-white">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        plan.popular
                          ? 'bg-accent-400/30 border border-accent-300'
                          : 'bg-accent-100 border border-accent-200'
                      }`}>
                        <Check size={10} className={`stroke-[3] ${plan.popular ? 'text-accent-300' : 'text-accent-600'}`} />
                      </div>
                      <span className={`text-sm leading-snug ${plan.popular ? 'text-white/90' : 'text-slate-600'}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/signup"
                  className={`block w-full text-center px-5 py-3.5 rounded-2xl font-display font-bold text-sm transition-all duration-200 active:scale-95 ${
                    plan.popular
                      ? 'bg-accent-500 hover:bg-accent-400 text-primary-900 shadow-lg shadow-accent-500/30'
                      : 'bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white'
                  }`}
                >
                  {plan.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm mb-3">
            14-day free trial for all new members • No credit card required
          </p>
          <p className="text-slate-400 text-xs">
            Regulated by PIA • Trusted by 2,500+ families across Africa
          </p>
        </div>
      </div>
    </section>
  );
}
