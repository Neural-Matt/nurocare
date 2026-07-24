'use client';

import { Star } from 'lucide-react';
import { Card, Heading, Text, Caption, Overline, Stagger, Reveal } from '@/components/ui';

const partners = ['Zambia State Insurance', 'Madison General', 'Professional Life', 'Indo Zambia Bank'];

const testimonials = [
  {
    name: 'Chanda M.',
    role: 'Teacher, Lusaka',
    text: 'My claim was approved in under 24 hours. I was shocked how easy and fast NuroCare made it.',
    rating: 5,
    avatar: 'CM',
    avatarClass: 'bg-primary-800 text-white',
  },
  {
    name: 'Mwila K.',
    role: 'Mother of 3, Ndola',
    text: 'Finally, health cover that actually fits my budget. The app is incredibly easy — even my husband uses it.',
    rating: 5,
    avatar: 'MK',
    avatarClass: 'bg-accent-100 text-accent-700',
  },
  {
    name: 'Brian T.',
    role: 'Freelancer, Kitwe',
    text: "I searched for a drug online on NuroCare and found covered alternatives. That feature alone saves me monthly.",
    rating: 5,
    avatar: 'BT',
    avatarClass: 'bg-neutral-800 text-white',
  },
];

const stats = [
  { value: '2,500+', label: 'Members covered' },
  { value: '98%', label: 'Claims approved' },
  { value: '< 24h', label: 'Avg claim time' },
  { value: '4.9 ★', label: 'App rating' },
];

export function TrustSection() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Partner logos */}
        <div className="text-center mb-16">
          <Caption uppercase className="block mb-8">Trusted partners &amp; insurers</Caption>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {partners.map((p) => (
              <div
                key={p}
                className="px-5 py-3 bg-white border border-neutral-150 rounded-xl shadow-card"
              >
                <Text size="sm" weight="semibold" color="secondary">{p}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <Heading as="p" size="h2" color="primary">{s.value}</Heading>
              <Text size="sm" color="secondary" className="mt-1">{s.label}</Text>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-10">
          <Overline color="accent" className="mb-3">Member stories</Overline>
          <Heading as="h2" size="h1">Loved by our members</Heading>
        </div>
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Reveal key={t.name}>
              <Card variant="default" padding="lg" hover className="h-full">
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Text size="sm" color="secondary" className="mb-5">&ldquo;{t.text}&rdquo;</Text>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.avatarClass}`}>
                    <span className="text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <Text size="sm" weight="semibold">{t.name}</Text>
                    <Caption color="muted">{t.role}</Caption>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
