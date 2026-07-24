'use client';

import { ShieldCheck, Users, MapPin, FileText, MessageCircle, Pill } from 'lucide-react';
import { Card, IconChip, Heading, Text, Overline, Stagger, Reveal } from '@/components/ui';

type IconChipColor = 'primary' | 'accent' | 'warning' | 'success' | 'error' | 'neutral';

const PLATFORM_FEATURES: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  color: IconChipColor;
}[] = [
  {
    icon: ShieldCheck,
    title: 'Health Insurance',
    description: 'Digital health cover from ZMW 150/mo. Instant policy card, no paperwork.',
    color: 'primary',
  },
  {
    icon: Users,
    title: 'Family Plans',
    description: 'Add your spouse and children. One plan, one bill, complete family protection.',
    color: 'neutral',
  },
  {
    icon: MapPin,
    title: 'Find Hospitals & Pharmacies',
    description: 'Locate covered facilities near you with real-time availability.',
    color: 'warning',
  },
  {
    icon: FileText,
    title: 'Easy Claims',
    description: 'Submit a claim in 2 minutes. Track status and get paid to your mobile wallet.',
    color: 'accent',
  },
  {
    icon: MessageCircle,
    title: 'Telemedicine',
    description: 'Chat with a licensed Zambian doctor on WhatsApp. Included in your plan.',
    color: 'primary',
  },
  {
    icon: Pill,
    title: 'Drug Reference',
    description: '500+ medications. Check what\'s covered, dosage info, and alternatives.',
    color: 'accent',
  },
];

export function PlatformOverviewSection() {
  return (
    <section className="bg-white py-20 sm:py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Overline color="accent" className="mb-3">Full platform</Overline>
          <Heading as="h2" size="h1">Everything for your health</Heading>
          <Text size="lg" color="secondary" className="mt-4 max-w-xl mx-auto">
            NuroCare is more than insurance — it&apos;s your complete digital health companion.
          </Text>
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORM_FEATURES.map(({ icon: Icon, title, description, color }) => (
            <Reveal key={title}>
              <Card variant="default" padding="lg" hover className="h-full">
                <IconChip icon={<Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />} color={color} size="md" className="mb-4" />
                <Heading as="h3" size="h4" className="mb-1.5">{title}</Heading>
                <Text size="sm" color="secondary">{description}</Text>
              </Card>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
