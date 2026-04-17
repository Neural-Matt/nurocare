'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Subscription, Plan } from '@/types';
import { useAuth } from './useAuth';
import { MOCK_SUBSCRIPTION } from '@/lib/mock-data';
import { generatePolicyNumber } from '@/lib/utils';
import { addYears } from 'date-fns';
import toast from 'react-hot-toast';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

export function useSubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    IS_MOCK ? [MOCK_SUBSCRIPTION] : []
  );
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(
    IS_MOCK ? MOCK_SUBSCRIPTION : null
  );
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchSubscriptions = async () => {
    if (IS_MOCK || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, plan:plans(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const subs = data as Subscription[];
      setSubscriptions(subs);
      setActiveSubscription(subs.find((s) => s.status === 'active') ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const subscribeToPlan = async (plan: Plan) => {
    if (IS_MOCK) {
      // Update local state only
      const newSub: Subscription = {
        id: `sub-mock-${Date.now()}`,
        user_id: 'mock-user-001',
        plan_id: plan.id,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: addYears(new Date(), 1).toISOString(),
        policy_number: generatePolicyNumber(),
        created_at: new Date().toISOString(),
        plan,
      };
      setSubscriptions([newSub]);
      setActiveSubscription(newSub);
      toast.success(`Subscribed to ${plan.name}! (mock mode)`);
      return { error: null };
    }

    if (!user) return { error: new Error('Not authenticated') };

    if (activeSubscription) {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', activeSubscription.id);
    }

    const startDate = new Date();
    const endDate = addYears(startDate, 1);

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        policy_number: generatePolicyNumber(),
      })
      .select('*, plan:plans(*)')
      .single();

    if (!error && data) {
      const newSub = data as Subscription;
      setSubscriptions((prev) => [newSub, ...prev]);
      setActiveSubscription(newSub);
      toast.success(`Successfully subscribed to ${plan.name}!`);
    } else {
      toast.error('Subscription failed. Please try again.');
    }

    return { error };
  };

  return { subscriptions, activeSubscription, loading, subscribeToPlan, refetch: fetchSubscriptions };
}
