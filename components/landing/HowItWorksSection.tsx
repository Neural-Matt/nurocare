'use client';

import { Sparkles, CreditCard, Stethoscope, HeadphonesIcon } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28 px-5 sm:px-8">
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

          {/* Step 1 */}
          <div className="group relative bg-blue-50 border border-blue-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <span className="absolute top-5 right-5 font-display font-black text-5xl text-blue-100 select-none leading-none">01</span>
            <div className="w-12 h-12 rounded-2xl bg-primary-800 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles size={22} className="text-white" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2.5">Choose a plan</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Browse our Starter, Standard, or Premium plans and pick the cover that fits your family and budget.</p>
          </div>

          {/* Step 2 */}
          <div className="group relative bg-emerald-50 border border-emerald-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <span className="absolute top-5 right-5 font-display font-black text-5xl text-emerald-100 select-none leading-none">02</span>
            <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CreditCard size={22} className="text-white" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2.5">Pay with Mobile Money</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Pay instantly via Airtel Money, MTN MoMo, or card. No hidden fees. Cancel anytime.</p>
          </div>

          {/* Step 3 */}
          <div className="group relative bg-violet-50 border border-violet-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <span className="absolute top-5 right-5 font-display font-black text-5xl text-violet-100 select-none leading-none">03</span>
            <div className="w-12 h-12 rounded-2xl bg-primary-700 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Stethoscope size={22} className="text-white" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2.5">Visit a doctor or submit a claim</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Use your digital policy card at any partner clinic, or submit a claim from your phone in minutes.</p>
          </div>

          {/* Step 4 */}
          <div className="group relative bg-orange-50 border border-orange-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
            <span className="absolute top-5 right-5 font-display font-black text-5xl text-orange-100 select-none leading-none">04</span>
            <div className="w-12 h-12 rounded-2xl bg-warning-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <HeadphonesIcon size={22} className="text-white" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2.5">Get support instantly</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Our team is available 24/7 via WhatsApp, in-app chat, or phone. We&apos;re here when you need us most.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
