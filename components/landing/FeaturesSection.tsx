'use client';

import { Shield, ClipboardList, Video, Pill, Search, CheckCircle2 } from 'lucide-react';
import {
  Card,
  IconChip,
  Badge,
  claimStatusBadge,
  Heading,
  Text,
  Caption,
  Overline,
  RevealOnScroll,
} from '@/components/ui';
import type { ClaimStatus } from '@/types';

const claimRows: { label: string; status: ClaimStatus; amount: string; bar: number }[] = [
  { label: 'GP Consultation', status: 'paid', amount: 'ZMW 280', bar: 100 },
  { label: 'Medication', status: 'approved', amount: 'ZMW 450', bar: 80 },
  { label: 'Lab Tests', status: 'reviewing', amount: 'ZMW 600', bar: 50 },
];

const drugRows = [
  { name: 'Amoxicillin 500mg', type: 'Antibiotic', covered: true, price: 'ZMW 45' },
  { name: 'Metformin 850mg', type: 'Diabetes', covered: true, price: 'ZMW 32' },
  { name: 'Atorvastatin 20mg', type: 'Cholesterol', covered: false, price: 'ZMW 120' },
];

const telemedicinePoints = [
  'Licensed Zambian doctors, on video or audio',
  'Included in your plan — no extra cost',
  'From home, the office, or anywhere',
];

const features = [
  {
    icon: Shield,
    title: 'Digital Health Cover',
    description:
      'Your policy lives on your phone. Instant digital card, real-time coverage status, and zero paperwork. Just show your phone at any partner clinic.',
    badge: 'Core',
    badgeVariant: 'info' as const,
    chipColor: 'primary' as const,
    reverse: false,
    visual: (
      <Card variant="navy" padding="lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <Caption color="inverse" uppercase className="block mb-1">
              Active Policy
            </Caption>
            <Text color="inverse" weight="semibold" className="font-display text-lg">
              Standard Health
            </Text>
          </div>
          <IconChip icon={<Shield className="w-[18px] h-[18px]" />} color="accent" size="md" />
        </div>
        <div className="mb-5">
          <Caption color="inverse" uppercase className="block mb-1">
            Policy Number
          </Caption>
          <Text color="inverse" weight="semibold" className="font-mono tracking-wide">
            NC-2026-00042
          </Text>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Text color="inverse" size="sm">
            ZMW 350 / month
          </Text>
          <span className="flex items-center gap-1.5 bg-accent-500/15 text-accent-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-accent-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
            Active
          </span>
        </div>
      </Card>
    ),
  },
  {
    icon: ClipboardList,
    title: 'Easy Claims Tracking',
    description:
      'Submit a claim in under 2 minutes. Upload your receipt, track status in real time, and get paid into your mobile wallet — all without a single phone call.',
    badge: 'Popular',
    badgeVariant: 'success' as const,
    chipColor: 'accent' as const,
    reverse: true,
    visual: (
      <div className="space-y-3">
        {claimRows.map((c) => {
          const { variant, label } = claimStatusBadge(c.status);
          return (
            <Card key={c.label} padding="md">
              <div className="flex justify-between items-center mb-2.5">
                <Text weight="semibold" size="sm">
                  {c.label}
                </Text>
                <Badge variant={variant}>{label}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-500 rounded-full" style={{ width: `${c.bar}%` }} />
                </div>
                <Caption className="shrink-0">{c.amount}</Caption>
              </div>
            </Card>
          );
        })}
      </div>
    ),
  },
  {
    icon: Video,
    title: 'Telemedicine Access',
    description:
      'See a licensed Zambian doctor via video call — from your home, your office, or anywhere. Consultations included in your plan, no extra cost.',
    badge: 'New',
    badgeVariant: 'info' as const,
    chipColor: 'primary' as const,
    reverse: false,
    visual: (
      <Card padding="xl">
        <IconChip icon={<Video className="w-6 h-6" />} color="primary" size="lg" className="mb-6" />
        <Heading as="h4" size="h4" className="mb-4">
          On-demand video consultations
        </Heading>
        <div className="space-y-3">
          {telemedicinePoints.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-[18px] h-[18px] text-accent-500 shrink-0 mt-0.5" />
              <Text size="sm" color="secondary">
                {item}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    ),
  },
  {
    icon: Pill,
    title: 'Medicine & Drug Search',
    description:
      "Search our database of 500+ covered medications. Find out what's covered, get dosage info, and discover affordable alternatives — instantly.",
    badge: 'Smart',
    badgeVariant: 'neutral' as const,
    chipColor: 'neutral' as const,
    reverse: true,
    visual: (
      <Card padding="lg">
        <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-150 rounded-xl px-4 py-3 mb-4">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <Text size="sm" color="muted">
            Search medications…
          </Text>
        </div>
        <div>
          {drugRows.map((d) => (
            <div
              key={d.name}
              className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0 last:pb-0"
            >
              <div>
                <Text weight="semibold" size="sm">
                  {d.name}
                </Text>
                <Caption>{d.type}</Caption>
              </div>
              <div className="text-right">
                <Badge variant={d.covered ? 'success' : 'neutral'}>
                  {d.covered ? 'Covered' : 'Not covered'}
                </Badge>
                <Caption className="block mt-1">{d.price}</Caption>
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-20">
          <Overline color="accent" className="mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Core Features
          </Overline>
          <Heading as="h2" size="h2" color="primary" className="mb-4">
            Everything you need for smarter healthcare
          </Heading>
          <Text size="lg" color="secondary" className="max-w-2xl mx-auto">
            Every feature designed with one goal: make healthcare simple, accessible, and human.
          </Text>
        </RevealOnScroll>

        {/* Feature rows */}
        <div className="space-y-28">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <RevealOnScroll key={f.title}>
                <div
                  className={`flex flex-col ${f.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}
                >
                  {/* Text side */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <IconChip icon={<Icon className="w-[18px] h-[18px]" />} color={f.chipColor} size="md" />
                      <Badge variant={f.badgeVariant}>{f.badge}</Badge>
                    </div>
                    <Heading as="h3" size="h3" color="primary" className="mb-4">
                      {f.title}
                    </Heading>
                    <Text size="lg" color="secondary" leading="relaxed">
                      {f.description}
                    </Text>
                  </div>

                  {/* Visual side */}
                  <div className="flex-1 w-full max-w-md">{f.visual}</div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
