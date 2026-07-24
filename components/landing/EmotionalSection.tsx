'use client';

import { Heart, Users, ShieldCheck } from 'lucide-react';
import { Heading, Text, Stagger, Reveal } from '@/components/ui';

const values = [
  {
    icon: ShieldCheck,
    title: 'Security',
    desc: 'Financial protection from unexpected medical bills.',
  },
  {
    icon: Heart,
    title: 'Care',
    desc: 'Access to quality healthcare for every family member.',
  },
  {
    icon: Users,
    title: 'Dignity',
    desc: 'Walk into any clinic with confidence — fully covered.',
  },
];

export function EmotionalSection() {
  return (
    <section className="bg-primary-900 py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 mb-8">
          <Heart size={26} className="text-accent-400 fill-accent-400" />
        </div>

        <Heading as="h2" size="hero" color="inverse" className="mb-6">
          Peace of mind for you and your family
        </Heading>

        <Text size="xl" color="inverse" className="opacity-60 max-w-2xl mx-auto mb-14">
          When illness strikes, the last thing you should worry about is money. NuroCare gives
          every Zambian family the dignity of knowing they are protected — every single day.
        </Text>

        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <Reveal key={title}>
              <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-7 h-full">
                <div className="w-11 h-11 rounded-xl bg-white/[0.08] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-accent-400" />
                </div>
                <Heading as="h3" size="h4" color="inverse" className="mb-2">
                  {title}
                </Heading>
                <Text size="sm" color="inverse" className="opacity-50">
                  {desc}
                </Text>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
