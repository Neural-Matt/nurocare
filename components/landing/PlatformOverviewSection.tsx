'use client';

import { ShieldCheck, Users, MapPin, FileText, MessageCircle, Pill } from 'lucide-react';

const PLATFORM_FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Health Insurance',
    description: 'Digital health cover from ZMW 150/mo. Instant policy card, no paperwork.',
    gradient: 'from-primary-700 to-primary-900',
  },
  {
    icon: Users,
    title: 'Family Plans',
    description: 'Add your spouse and children. One plan, one bill, complete family protection.',
    gradient: 'from-rose-500 to-rose-700',
  },
  {
    icon: MapPin,
    title: 'Find Hospitals & Pharmacies',
    description: 'Locate covered facilities near you with real-time availability.',
    gradient: 'from-warning-400 to-warning-600',
  },
  {
    icon: FileText,
    title: 'Easy Claims',
    description: 'Submit a claim in 2 minutes. Track status and get paid to your mobile wallet.',
    gradient: 'from-accent-500 to-accent-700',
  },
  {
    icon: MessageCircle,
    title: 'Telemedicine',
    description: 'Chat with a licensed Zambian doctor on WhatsApp. Included in your plan.',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    icon: Pill,
    title: 'Drug Reference',
    description: '500+ medications. Check what\'s covered, dosage info, and alternatives.',
    gradient: 'from-violet-500 to-violet-700',
  },
];

export function PlatformOverviewSection() {
  return (
    <section className="bg-white py-20 sm:py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-widest mb-3">Full platform</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 leading-tight">
            Everything for your health
          </h2>
          <p className="text-slate-500 text-lg mt-4 max-w-xl mx-auto">
            NuroCare is more than insurance — it&apos;s your complete digital health companion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORM_FEATURES.map(({ icon: Icon, title, description, gradient }) => (
            <div
              key={title}
              className="group relative bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                <Icon className="w-[22px] h-[22px] text-white" strokeWidth={1.75} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mb-1.5">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
