'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Overline, Heading, Text } from '@/components/ui';
import { RevealOnScroll, springs } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: 'How quickly does my cover start?',
    a: 'Coverage activates immediately after your first payment clears — no waiting periods, no paperwork to mail in. You can submit a claim the same day you sign up.',
  },
  {
    q: 'Can I add my family to my plan?',
    a: 'Yes. Every plan supports adding a spouse, children, or dependents as family members. Each covered member gets their own digital policy card and can be managed from the Family tab.',
  },
  {
    q: 'What happens if I need to cancel?',
    a: 'Cancel anytime from your profile — there are no lock-in contracts or cancellation fees. Your cover stays active until the end of the period you’ve already paid for.',
  },
  {
    q: 'How do I submit a claim?',
    a: 'Open the Claims tab, choose the claim type, attach a photo of your receipt, and submit — most claims take under 2 minutes to file and are reviewed within 2–3 business days.',
  },
  {
    q: 'Are pre-existing conditions covered?',
    a: 'Most chronic and pre-existing conditions are covered under Standard Health and Premium Plus after a short qualifying period. Our team can confirm specifics for your situation before you subscribe.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'MTN Mobile Money, Airtel Money, bank transfer, and major debit/credit cards. Payments are processed securely and receipts are stored in your account automatically.',
  },
];

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-150 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-neutral-900 text-[15px] sm:text-base">{q}</span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={springs.snappy}
            className="flex"
          >
            <Plus className="w-4 h-4 text-neutral-500" />
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.gentle}
            className="overflow-hidden"
          >
            <p className="text-neutral-600 text-sm leading-relaxed pb-5 pr-10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <RevealOnScroll className="text-center mb-12">
          <Overline color="accent" className="mb-3">Questions</Overline>
          <Heading as="h2" size="h2" color="primary" className="mb-4">
            Frequently asked questions
          </Heading>
          <Text color="secondary" size="lg">
            Can&apos;t find what you&apos;re looking for? Message us on WhatsApp and we&apos;ll help right away.
          </Text>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className={cn('bg-white rounded-3xl border border-neutral-150 shadow-card px-6 sm:px-8')}>
          {FAQS.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
