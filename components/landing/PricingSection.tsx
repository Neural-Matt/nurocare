'use client';

import { useRouter } from 'next/navigation';
import { PlanCard } from '@/components/features/PlanCard';
import { Overline, Heading, Text, Caption, Stagger, Reveal } from '@/components/ui';
import { Plan } from '@/types';

// Static marketing-page tier data, shaped to the same `Plan` type the
// authenticated /plans page uses — lets us reuse PlanCard directly instead
// of maintaining a second hand-built pricing card. `coverage_details`,
// `color` and `created_at` aren't rendered by PlanCard itself (only passed
// through), so they're left empty rather than inventing content.
const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Care',
    price: 150,
    description: 'Essential coverage to get started',
    coverage_details: [],
    features: [
      'GP Consultations (6/year)',
      'Medication Cover (ZMW 500/mo)',
      'Emergency Care',
      'Basic Lab Tests',
      'Digital Policy Card',
    ],
    is_active: true,
    color: '',
    created_at: '',
  },
  {
    id: 'standard',
    name: 'Standard Health',
    price: 350,
    description: 'Best value for families',
    coverage_details: [],
    features: [
      'Unlimited GP Visits',
      'Specialist Referrals',
      'Hospitalization (7 days)',
      'Medication Cover (ZMW 1,500/mo)',
      'Basic Dental & Eye Tests',
      'Telemedicine Access',
    ],
    is_active: true,
    color: '',
    created_at: '',
  },
  {
    id: 'premium',
    name: 'Premium Plus',
    price: 750,
    description: 'Full-spectrum family protection',
    coverage_details: [],
    features: [
      'Unlimited Consultations',
      'Full Specialist Access',
      'Unlimited Hospitalization',
      'Maternity Cover',
      'Comprehensive Dental',
      'Mental Health Support',
      'International Emergency',
    ],
    is_active: true,
    color: '',
    created_at: '',
  },
];

export function PricingSection() {
  const router = useRouter();

  // Pre-signup, there's no subscription to confirm and no coverage-detail
  // page to deep-link to — both PlanCard affordances route into signup,
  // carrying the chosen plan along for later use.
  const goToSignup = (plan: Plan) => {
    router.push(`/signup?plan=${plan.id}`);
  };

  return (
    <section id="pricing" className="bg-white py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Overline color="accent" className="mb-3">
            Transparent Pricing
          </Overline>
          <Heading as="h2" size="h2" color="primary" className="mb-4">
            Plans for every family
          </Heading>
          <Text color="secondary" size="lg" className="max-w-2xl mx-auto">
            No hidden fees. Cancel anytime. Coverage starts immediately upon purchase.
          </Text>
        </div>

        {/* Plans grid — same PlanCard used on the authenticated /plans page */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <Reveal key={plan.id}>
              <PlanCard plan={plan} onSelect={goToSignup} onViewDetails={goToSignup} />
            </Reveal>
          ))}
        </Stagger>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Text color="secondary" size="sm" className="mb-3">
            14-day free trial for all new members • No credit card required
          </Text>
          <Caption color="muted">
            Regulated by PIA • Trusted by 2,500+ families across Zambia
          </Caption>
        </div>
      </div>
    </section>
  );
}
