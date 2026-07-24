'use client';

import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';
import { Button, Heading, RevealOnScroll } from '@/components/ui';

export function CtaSection() {
  return (
    <section className="bg-primary-800 py-24 sm:py-32 px-5 sm:px-8">
      <RevealOnScroll className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/15 mb-8">
          <Shield size={26} className="text-white" />
        </div>

        <Heading as="h2" size="hero" color="inverse" className="mb-6">
          Take control of your
          <br className="hidden sm:block" /> health today
        </Heading>

        <p className="text-white/70 text-xl leading-relaxed mb-12">
          Join thousands of Zambians who've made the smart choice. Setup takes 3 minutes.
          Your coverage starts immediately.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button variant="teal" size="lg" fullWidth trailingIcon={<ArrowRight size={18} />}>
              Get Covered Now
            </Button>
          </Link>
          <a href="#pricing" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              className="border-white/25 text-white hover:bg-white/10"
            >
              Compare plans
            </Button>
          </a>
        </div>

        <p className="text-white/50 text-sm mt-8">
          14-day free trial · No credit card required · Cancel anytime
        </p>
      </RevealOnScroll>
    </section>
  );
}
