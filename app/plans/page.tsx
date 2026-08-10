'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { PlanCard } from '@/components/features/PlanCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Stagger, Reveal, springs } from '@/components/ui';
import { usePlans } from '@/hooks/usePlans';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Plan } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Check,
  AlertCircle,
  ShieldCheck,
  Clock,
  Headphones,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TRUST_PILLS = [
  { icon: ShieldCheck, label: 'Instant activation' },
  { icon: Clock,       label: 'Cancel anytime'     },
  { icon: Headphones,  label: '24/7 support'        },
];

export default function PlansPage() {
  const { plans, loading: plansLoading } = usePlans();
  const { activeSubscription, subscribeToPlan, loading: subscriptionsLoading } = useSubscriptions();
  const loading = plansLoading || subscriptionsLoading;
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [detailPlan, setDetailPlan]     = useState<Plan | null>(null);
  const [subscribing, setSubscribing]   = useState(false);
  const [subscribed, setSubscribed]     = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    setSubscribing(true);
    await subscribeToPlan(selectedPlan);
    setSubscribing(false);
    setSubscribed(true);
    // Auto-close after short delay
    setTimeout(() => {
      setSelectedPlan(null);
      setSubscribed(false);
    }, 1800);
  };

  return (
    <AppShell title="Health Plans">
      <div className="max-w-lg md:max-w-6xl mx-auto">
      {/* ── Intro ── */}
      <div className="mb-6">
        <h1 className="font-display font-medium text-4xl text-neutral-900 tracking-[-0.02em] mb-2">
          Find your perfect plan
        </h1>
        <p className="text-neutral-500 text-base leading-relaxed">
          Simple, affordable cover — pick what fits your life and budget.
        </p>
      </div>

      {/* ── Trust signals ── */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {TRUST_PILLS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 bg-white border border-neutral-100 shadow-card rounded-full px-3 py-1.5 shrink-0"
          >
            <Icon className="w-3.5 h-3.5 text-accent-500" />
            <span className="text-xs font-semibold text-neutral-600 whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Active plan banner ── */}
      {activeSubscription?.plan && (
        <div className="mb-5 bg-accent-50 border border-accent-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-accent-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-accent-800">
              You&apos;re on {activeSubscription.plan.name}
            </p>
            <p className="text-xs text-accent-600">You can switch or upgrade below — changes take effect immediately.</p>
          </div>
        </div>
      )}

      {/* ── Plan cards ── */}
      {loading ? (
        <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl overflow-hidden border border-neutral-100 animate-pulse">
              <div className="h-36 bg-neutral-200" />
              <div className="bg-white p-5 space-y-3">
                <div className="h-3 bg-neutral-100 rounded w-1/3" />
                <div className="h-3 bg-neutral-100 rounded w-full" />
                <div className="h-3 bg-neutral-100 rounded w-4/5" />
                <div className="h-3 bg-neutral-100 rounded w-3/5" />
                <div className="h-11 bg-neutral-100 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Stagger className="space-y-6 md:space-y-0 pt-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:items-start">
          {plans.map((plan) => (
            <Reveal key={plan.id}>
              <PlanCard
                plan={plan}
                isActive={activeSubscription?.plan_id === plan.id}
                onSelect={setSelectedPlan}
                onViewDetails={setDetailPlan}
              />
            </Reveal>
          ))}
        </Stagger>
      )}
      </div>

      {/* ── Confirm subscribe modal ── */}
      <Modal
        open={!!selectedPlan}
        onClose={() => { if (!subscribing) setSelectedPlan(null); }}
        title="Confirm your plan"
      >
        {selectedPlan && (
          <div className="space-y-4">
            {subscribed ? (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springs.gentle}
                className="flex flex-col items-center py-6 gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent-50 border-4 border-accent-200 flex items-center justify-center">
                  <Check className="w-8 h-8 text-accent-500" />
                </div>
                <div>
                  <p className="font-display font-bold text-xl text-neutral-900 mb-1">You&apos;re covered!</p>
                  <p className="text-neutral-500 text-sm">
                    {selectedPlan.name} is now active. Your coverage starts immediately.
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                {activeSubscription && (
                  <div className="flex items-start gap-2.5 bg-warning-50 border border-warning-100 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-warning-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-warning-700 leading-snug">
                      Your current plan will be cancelled when you switch. Your new cover starts today.
                    </p>
                  </div>
                )}

                {/* Plan summary */}
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mb-2">You&apos;re getting</p>
                  <p className="font-display font-bold text-xl text-neutral-900">{selectedPlan.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display font-bold text-2xl text-primary-800">
                      {formatCurrency(selectedPlan.price)}
                    </span>
                    <span className="text-neutral-400 text-sm">/month</span>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {selectedPlan.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-neutral-600">
                        <Check className="w-3.5 h-3.5 text-accent-500 shrink-0 stroke-[2.5]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[11px] text-neutral-400 text-center leading-snug">
                  This is a simulated subscription — no real payment is taken.
                  In production, Mobile Money (MTN/Airtel) will be triggered.
                </p>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => setSelectedPlan(null)}
                    className="border border-neutral-200"
                  >
                    Not now
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    loading={subscribing}
                    onClick={handleSubscribe}
                  >
                    Confirm & Start
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* ── Plan detail modal ── */}
      <Modal
        open={!!detailPlan}
        onClose={() => setDetailPlan(null)}
        title={detailPlan?.name ?? 'Plan Details'}
      >
        {detailPlan && (
          <div className="space-y-4">
            <p className="text-neutral-600 text-sm leading-relaxed">{detailPlan.description}</p>

            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Coverage breakdown</p>
              <div className="space-y-0 rounded-2xl border border-neutral-100 overflow-hidden">
                {detailPlan.coverage_details.map((detail, idx) => (
                  <div
                    key={detail.category}
                    className={cn(
                      'flex items-start justify-between gap-4 px-4 py-3',
                      idx < detailPlan.coverage_details.length - 1 && 'border-b border-neutral-50',
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{detail.category}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{detail.description}</p>
                    </div>
                    <p className="text-sm font-bold text-primary-800 shrink-0">{detail.limit}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => {
                setDetailPlan(null);
                setSelectedPlan(detailPlan);
              }}
            >
              Get {detailPlan.name}
            </Button>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
