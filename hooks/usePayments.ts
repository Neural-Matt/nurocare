'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { PaymentRecord } from '@/types';
import { useAuth } from './useAuth';
import { MOCK_PAYMENTS } from '@/lib/mock-data';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

export function usePayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>(IS_MOCK ? MOCK_PAYMENTS : []);
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchPayments = useCallback(async () => {
    if (IS_MOCK || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setPayments(data as PaymentRecord[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, refetch: fetchPayments };
}
