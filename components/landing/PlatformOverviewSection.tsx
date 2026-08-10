'use client';

import { ShieldCheck, Users, MapPin, FileText, MessageCircle, Pill } from 'lucide-react';
import { Heading, Text, Overline, Stagger, Reveal } from '@/components/ui';
import { cn } from '@/lib/utils';

const PLATFORM_FEATURES: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldCheck,
    title: 'Health Insurance',
    description: 'Digital health cover from ZMW 150/mo. Instant policy card, no paperwork.',
  },
  {
    icon: Users,
    title: 'Family Plans',
    description: 'Add your spouse and children. One plan, one bill, complete family protection.',
  },
  {
    icon: MapPin,
    title: 'Find Hospitals & Pharmacies',
    description: 'Locate covered facilities near you with real-time availability.',
  },
  {
    icon: FileText,
    title: 'Easy Claims',
    description: 'Submit a claim in 2 minutes. Track status and get paid to your mobile wallet.',
  },
  {
    icon: MessageCircle,
    title: 'Telemedicine',
    description: 'Chat with a licensed Zambian doctor on WhatsApp. Included in your plan.',
  },
  {
    icon: Pill,
    title: 'Drug Reference',
    description: "500+ medications. Check what's covered, dosage info, and alternatives.",
  },
];

export function PlatformOverviewSection() {
  return (
    <section className="bg-white py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 mb-16 lg:mb-20 items-end">
          <div className="lg:col-span-7">
            <Overline color="accent" className="mb-4">Full platform</Overline>
            <Heading as="h2" size="hero" className="text-[2.75rem] sm:text-6xl leading-[1.02]">
              Everything for your health, in one place.
            </Heading>
          </div>
          <div className="lg:col-span-5">
            <Text size="lg" color="secondary" className="lg:text-right">
              NuroCare is more than insurance — it&apos;s your complete digital health companion.
            </Text>
          </div>
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-neutral-150">
          {PLATFORM_FEATURES.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title}>
              <div
                className={cn(
                  'group relative border-r border-b border-neutral-150 p-8 lg:p-10 h-full',
                  'transition-colors duration-300 hover:bg-neutral-25'
                )}
              >
                <span className="font-display text-6xl font-bold text-neutral-100 group-hover:text-accent-100 transition-colors leading-none select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className="w-6 h-6 text-primary-800 mt-5 mb-4" strokeWidth={1.5} />
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
