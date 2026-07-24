'use client';

import { useState, useEffect } from 'react';
import { createClient, IS_MOCK_MODE as IS_MOCK } from '@/lib/supabase/client';
const supabase = createClient();
import { Plan } from '@/types';
import { PLANS } from '@/lib/mock-plans';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>(IS_MOCK ? PLANS : []);
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchPlans = async () => {
    if (IS_MOCK) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });
    if (!error && data) setPlans(data as Plan[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, loading, refetch: fetchPlans };
}
