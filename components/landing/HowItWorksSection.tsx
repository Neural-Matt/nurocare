'use client';

import { Sparkles, CreditCard, Stethoscope, HeadphonesIcon } from 'lucide-react';
import { Heading, Text, Overline, Stagger, Reveal } from '@/components/ui';

const STEPS: {
  number: string;
  icon: typeof Sparkles;
  title: string;
  description: string;
}[] = [
  {
    number: '01',
    icon: Sparkles,
    title: 'Choose a plan',
    description: 'Browse our Starter, Standard, or Premium plans and pick the cover that fits your family and budget.',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Pay with Mobile Money',
    description: 'Pay instantly via Airtel Money, MTN MoMo, or card. No hidden fees. Cancel anytime.',
  },
  {
    number: '03',
    icon: Stethoscope,
    title: 'Visit a doctor or submit a claim',
    description: 'Use your digital policy card at any partner clinic, or submit a claim from your phone in minutes.',
  },
  {
    number: '04',
    icon: HeadphonesIcon,
    title: 'Get support instantly',
    description: "Our team is available 24/7 via WhatsApp, in-app chat, or phone. We're here when you need us most.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <Overline color="accent" className="mb-3">Simple process</Overline>
          <Heading as="h2" size="hero" className="text-[2.75rem] sm:text-6xl leading-[1.02] mb-4">
            Cover in four easy steps.
          </Heading>
          <Text size="lg" color="secondary">
            Getting insured has never been simpler. No paperwork, no queues, no stress.
          </Text>
        </div>

        {/* Connected process flow — one continuous line through all four steps,
            deliberately not a grid of boxed cards. */}
        <Stagger className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-neutral-150" />
          {STEPS.map(({ number, icon: Icon, title, description }) => (
            <Reveal key={number}>
              <div className="relative">
                <div className="flex items-center gap-4 lg:block mb-4 lg:mb-6">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-primary-800 text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                    {number}
                  </div>
                  <Icon className="w-5 h-5 text-accent-500 lg:mt-4 shrink-0" strokeWidth={1.75} />
                </div>
                <Heading as="h3" size="h4" className="mb-2">{title}</Heading>
                <Text size="sm" color="secondary" leading="relaxed">{description}</Text>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
