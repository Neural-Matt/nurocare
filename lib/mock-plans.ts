import { Plan } from '@/types';

/**
 * Seed plans data — also insert these into Supabase "plans" table.
 */
export const PLANS: Plan[] = [
  {
    id: 'plan-basic',
    name: 'Basic Care',
    price: 150,
    description: 'Essential coverage for individuals needing primary healthcare access.',
    features: [
      'GP Consultations (6/year)',
      'Medication Cover (ZMW 500/month)',
      'Emergency Care',
      'Basic Lab Tests',
    ],
    coverage_details: [
      { category: 'Outpatient', limit: 'ZMW 6,000/year', description: 'GP visits and consultations' },
      { category: 'Medication', limit: 'ZMW 500/month', description: 'Prescribed medications' },
      { category: 'Emergency', limit: 'ZMW 10,000/incident', description: 'Emergency room visits' },
      { category: 'Lab Tests', limit: 'ZMW 2,000/year', description: 'Basic blood and urine tests' },
    ],
    is_active: true,
    color: 'from-primary-800 to-primary-700',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plan-standard',
    name: 'Standard Health',
    price: 350,
    description: 'Comprehensive cover for families with outpatient and inpatient benefits.',
    features: [
      'Unlimited GP Visits',
      'Specialist Referrals',
      'Hospitalization (up to 7 days)',
      'Medication Cover (ZMW 1,500/month)',
      'Dental Basic',
      'Eye Tests',
    ],
    coverage_details: [
      { category: 'Outpatient', limit: 'Unlimited', description: 'All GP and specialist visits' },
      { category: 'Inpatient', limit: 'ZMW 50,000/year', description: 'Hospital stays up to 7 days' },
      { category: 'Medication', limit: 'ZMW 1,500/month', description: 'All prescribed medications' },
      { category: 'Dental', limit: 'ZMW 3,000/year', description: 'Basic dental procedures' },
      { category: 'Vision', limit: 'ZMW 1,500/year', description: 'Eye tests and basic frames' },
    ],
    is_active: true,
    color: 'from-accent-500 to-accent-700',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plan-premium',
    name: 'Premium Plus',
    price: 750,
    description: 'Full-spectrum healthcare coverage for individuals and families.',
    features: [
      'Unlimited Consultations',
      'Full Specialist Access',
      'Hospitalization (unlimited days)',
      'Maternity Cover',
      'Comprehensive Dental',
      'Full Vision Cover',
      'Mental Health Support',
      'International Emergency',
    ],
    coverage_details: [
      { category: 'Outpatient', limit: 'Unlimited', description: 'All medical consultations' },
      { category: 'Inpatient', limit: 'ZMW 200,000/year', description: 'Unlimited hospital stays' },
      { category: 'Maternity', limit: 'ZMW 20,000', description: 'Prenatal, delivery and postnatal' },
      { category: 'Dental', limit: 'ZMW 8,000/year', description: 'Full dental coverage' },
      { category: 'Mental Health', limit: 'ZMW 5,000/year', description: '10 sessions/year' },
      { category: 'International', limit: 'USD 10,000', description: 'Emergency cover abroad' },
    ],
    is_active: true,
    color: 'from-warning-500 to-warning-600',
    created_at: new Date().toISOString(),
  },
];
