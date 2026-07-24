'use client';

import { Sparkles, CreditCard, Stethoscope, HeadphonesIcon } from 'lucide-react';
import { Card, IconChip, Heading, Text, Overline, Stagger, Reveal } from '@/components/ui';

type IconChipColor = 'primary' | 'accent' | 'warning' | 'success' | 'error' | 'neutral';

const STEPS: {
  number: string;
  icon: typeof Sparkles;
  color: IconChipColor;
  title: string;
  description: string;
}[] = [
  {
    number: '01',
    icon: Sparkles,
    color: 'primary',
    title: 'Choose a plan',
    description: 'Browse our Starter, Standard, or Premium plans and pick the cover that fits your family and budget.',
  },
  {
    number: '02',
    icon: CreditCard,
    color: 'accent',
    title: 'Pay with Mobile Money',
    description: 'Pay instantly via Airtel Money, MTN MoMo, or card. No hidden fees. Cancel anytime.',
  },
  {
    number: '03',
    icon: Stethoscope,
    color: 'primary',
    title: 'Visit a doctor or submit a claim',
    description: 'Use your digital policy card at any partner clinic, or submit a claim from your phone in minutes.',
  },
  {
    number: '04',
    icon: HeadphonesIcon,
    color: 'neutral',
    title: 'Get support instantly',
    description: "Our team is available 24/7 via WhatsApp, in-app chat, or phone. We're here when you need us most.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Overline color="accent" className="mb-3">Simple process</Overline>
          <Heading as="h2" size="h1">Cover in 4 easy steps</Heading>
          <Text size="lg" color="secondary" className="mt-4 max-w-xl mx-auto">
            Getting insured has never been simpler. No paperwork, no queues, no stress.
          </Text>
        </div>

        {/* Steps grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ number, icon: Icon, color, title, description }) => (
            <Reveal key={number}>
              <Card variant="default" padding="lg" hover className="h-full relative">
                <span className="absolute top-5 right-6 font-display font-bold text-2xl text-neutral-200 select-none leading-none">
                  {number}
                </span>
                <IconChip icon={<Icon className="w-[18px] h-[18px]" />} color={color} size="md" className="mb-5" />
                <Heading as="h3" size="h4" className="mb-2.5">{title}</Heading>
                <Text size="sm" color="secondary">{description}</Text>
              </Card>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
