'use client';

import { Sparkles, CreditCard, Stethoscope, HeadphonesIcon } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Sparkles,
    title: 'Choose a plan',
    description: 'Browse our Starter, Standard, or Premium plans and pick the cover that fits your family and budget.',
    iconClass: 'bg-gradient-to-br from-primary-800 to-primary-700',
    cardClass: 'bg-blue-50 border-blue-100',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Pay with Mobile Money',
    description: 'Pay instantly via Airtel Money, MTN MoMo, or card. No hidden fees. Cancel anytime.',
    iconClass: 'bg-gradient-to-br from-accent-500 to-accent-600',
    cardClass: 'bg-emerald-50 border-emerald-100',
  },
  {
    number: '03',
    icon: Stethoscope,
    title: 'Visit a doctor or submit a claim',
    description: 'Use your digital policy card at any partner clinic, or submit a claim from your phone in minutes.',
    iconClass: 'bg-gradient-to-br from-primary-700 to-primary-800',
    cardClass: 'bg-blue-50 border-blue-100',
  },
  {
    number: '04',
    icon: HeadphonesIcon,
    title: 'Get support instantly',
    description: "Our team is available 24/7 via WhatsApp, in-app chat, or phone. We're here when you need us most.",
    iconClass: 'bg-gradient-to-br from-warning-500 to-warning-600',
    cardClass: 'bg-orange-50 border-orange-100',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple process</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 leading-tight">
            Cover in{' '}
            <span className="text-gradient bg-gradient-to-r from-primary-600 to-accent-500">4 easy steps</span>
          </h2>
          <p className="text-slate-500 text-lg mt-4 max-w-xl mx-auto">
            Getting insured has never been simpler. No paperwork, no queues, no stress.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`group relative ${step.cardClass} border rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}
              >
                {/* Step number */}
                <span className="absolute top-5 right-5 font-display font-black text-5xl text-slate-200 select-none leading-none">
                  {step.number}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl ${step.iconClass} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>

                <h3 className="font-display font-bold text-slate-900 text-lg mb-2.5">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Connector line (desktop) */}
        <div className="hidden lg:block relative -mt-[calc(50%-1.5rem)] pointer-events-none" aria-hidden>
          {/* purely decorative — steps are visually connected by their row alignment */}
        </div>
      </div>
    </section>
  );
}
