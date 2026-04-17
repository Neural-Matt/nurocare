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
    <section id="pricing" className="bg-slate-50 py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Transparent pricing</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 leading-tight">
            Plans for every family
          </h2>
          <p className="text-slate-500 text-lg mt-4 max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Coverage starts the same day you pay.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl border-2 ${plan.color} p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up stagger-${i + 1}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-800 to-primary-700 text-white text-xs font-bold shadow-lg">
                    <Zap size={12} className="fill-current" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan info */}
              <div className="mb-6">
                <h3 className="font-display font-bold text-slate-900 text-xl mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="text-slate-400 text-sm font-medium self-start mt-2">ZMW</span>
                  <span className="font-display font-extrabold text-5xl text-slate-900 leading-none">{plan.price}</span>
                  <span className="text-slate-400 text-sm self-end mb-1">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-accent-100 flex items-center justify-center">
                      <Check size={10} className="text-accent-600 stroke-[3]" />
                    </div>
                    <span className="text-slate-600 text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/signup"
                className={`block w-full text-center px-5 py-3.5 rounded-2xl font-display font-bold text-sm active:scale-95 transition-all duration-200 ${plan.ctaStyle}`}
              >
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
