'use client';

import { Star, Quote } from 'lucide-react';
import { Text, Caption, Overline, Heading, Stagger, Reveal } from '@/components/ui';
import { MetricNumber } from '@/components/ui/MetricNumber';

const partners = ['Zambia State Insurance', 'Madison General', 'Professional Life', 'Indo Zambia Bank'];

const testimonials = [
  {
    name: 'Chanda M.',
    role: 'Teacher, Lusaka',
    text: 'My claim was approved in under 24 hours. I was shocked how easy and fast NuroCare made it.',
    rating: 5,
    avatar: 'CM',
    avatarClass: 'bg-primary-800 text-white',
    featured: true,
  },
  {
    name: 'Mwila K.',
    role: 'Mother of 3, Ndola',
    text: 'Finally, health cover that actually fits my budget. The app is incredibly easy — even my husband uses it.',
    rating: 5,
    avatar: 'MK',
    avatarClass: 'bg-accent-100 text-accent-700',
    featured: false,
  },
  {
    name: 'Brian T.',
    role: 'Freelancer, Kitwe',
    text: 'I searched for a drug online on NuroCare and found covered alternatives. That feature alone saves me monthly.',
    rating: 5,
    avatar: 'BT',
    avatarClass: 'bg-neutral-800 text-white',
    featured: false,
  },
];

const stats = [
  { value: '2,500+', unit: 'members covered' },
  { value: '98', unit: '% claims approved' },
  { value: '<24', unit: 'hr avg claim time' },
  { value: '4.9', unit: '★ app rating' },
];

export function TrustSection() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="bg-neutral-50 py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Partner wordmarks — plain, dot-separated, not boxed pills */}
        <div className="mb-20">
          <Caption uppercase className="block mb-6 text-center">Trusted partners &amp; insurers</Caption>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-3">
            {partners.map((p, i) => (
              <span key={p} className="flex items-center gap-3">
                <Text size="lg" weight="semibold" color="muted" className="whitespace-nowrap">{p}</Text>
                {i < partners.length - 1 && <span className="w-1 h-1 rounded-full bg-neutral-300" />}
              </span>
            ))}
          </div>
        </div>

        {/* Stats — large tabular numerals, asymmetric wrap, no card framing */}
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 mb-24 pb-24 border-b border-neutral-150">
          {stats.map((s) => (
            <MetricNumber key={s.unit} value={s.value} unit={s.unit} size="xl" color="primary" />
          ))}
        </div>

        {/* Testimonials — one featured quote, two smaller supporting ones */}
        <div className="mb-12">
          <Overline color="accent" className="mb-3">Member stories</Overline>
          <Heading as="h2" size="h1">Loved by our members</Heading>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          <Reveal>
            <div className="relative h-full flex flex-col">
              <Quote className="w-10 h-10 text-accent-200 mb-4" strokeWidth={1.5} />
              <Text as="p" size="xl" className="font-display leading-snug text-neutral-900 mb-6 flex-1">
                &ldquo;{featured.text}&rdquo;
              </Text>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${featured.avatarClass}`}>
                  <span className="text-sm font-bold">{featured.avatar}</span>
                </div>
                <div>
                  <Text size="sm" weight="semibold">{featured.name}</Text>
                  <Caption color="muted">{featured.role}</Caption>
                </div>
                <div className="flex gap-0.5 ml-auto">
                  {Array(featured.rating).fill(0).map((_, j) => (
                    <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Stagger className="flex flex-col gap-6">
            {rest.map((t) => (
              <Reveal key={t.name}>
                <div className="border-t border-neutral-200 pt-6">
                  <Text size="base" color="secondary" className="mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</Text>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.avatarClass}`}>
                      <span className="text-xs font-bold">{t.avatar}</span>
                    </div>
                    <div>
                      <Text size="sm" weight="semibold">{t.name}</Text>
                      <Caption color="muted">{t.role}</Caption>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
