'use client';

import { Heart, Users, ShieldCheck } from 'lucide-react';

export function EmotionalSection() {
  return (
    <section className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden bg-slate-900">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent-500/15 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-xl mb-8 animate-float">
          <Heart size={26} className="text-white fill-white" />
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
          Peace of mind for you{' '}
          <span className="text-gradient bg-gradient-to-r from-rose-400 to-pink-400">
            and your family
          </span>
        </h2>

        <p className="text-white/60 text-xl leading-relaxed max-w-2xl mx-auto mb-14">
          When illness strikes, the last thing you should worry about is money. NuroCare gives
          every Zambian family the dignity of knowing they are protected — every single day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'Security',
              desc: 'Financial protection from unexpected medical bills.',
              color: 'from-primary-500 to-primary-700',
            },
            {
              icon: Heart,
              title: 'Care',
              desc: 'Access to quality healthcare for every family member.',
              color: 'from-rose-500 to-pink-700',
            },
            {
              icon: Users,
              title: 'Dignity',
              desc: 'Walk into any clinic with confidence — fully covered.',
              color: 'from-emerald-500 to-accent-700',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-7 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
