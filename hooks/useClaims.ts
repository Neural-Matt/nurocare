'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Claim } from '@/types';
import { useAuth } from './useAuth';
import { MOCK_CLAIMS } from '@/lib/mock-data';
import toast from 'react-hot-toast';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

export function useClaims() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>(IS_MOCK ? MOCK_CLAIMS : []);
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchClaims = async () => {
    if (IS_MOCK || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setClaims(data as Claim[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchClaims();
  }, [user]);

  const submitClaim = async (
    payload: Pick<Claim, 'type' | 'amount' | 'notes'> & { receiptFile?: File; member_id?: string | null }
  ) => {
    if (IS_MOCK) {
      // Add claim to local state without hitting Supabase
      const newClaim: Claim = {
        id: `claim-mock-${Date.now()}`,
        user_id: 'mock-user-001',
        subscription_id: 'sub-mock-001',
        member_id: payload.member_id ?? null,
        type: payload.type,
        amount: payload.amount,
        status: 'submitted',
        notes: payload.notes ?? null,
        receipt_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setClaims((prev) => [newClaim, ...prev]);
      toast.success('Claim submitted! (mock mode)');
      return { error: null };
    }

    if (!user) return { error: new Error('Not authenticated') };

    let receiptUrl: string | null = null;

    if (payload.receiptFile) {
      const fileExt = payload.receiptFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, payload.receiptFile);

      if (uploadError) {
        toast.error('Failed to upload receipt');
        return { error: uploadError };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(uploadData.path);
      receiptUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from('claims')
      .insert({
        user_id: user.id,
        type: payload.type,
        amount: payload.amount,
        notes: payload.notes ?? null,
        receipt_url: receiptUrl,
        status: 'submitted',
        member_id: payload.member_id ?? null,
      })
      .select()
      .single();

    if (!error && data) {
      setClaims((prev) => [data as Claim, ...prev]);
      toast.success('Claim submitted successfully!');
    } else {
      toast.error('Failed to submit claim');
    }

    return { error };
  };

  const resubmitClaim = async (claimId: string) => {
    if (IS_MOCK) {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? { ...c, status: 'submitted', updated_at: new Date().toISOString() }
            : c,
        ),
      );
      toast.success('Claim resubmitted! (mock mode)');
      return { error: null };
    }

    const { data, error } = await supabase
      .from('claims')
      .update({ status: 'submitted', updated_at: new Date().toISOString() })
      .eq('id', claimId)
      .select()
      .single();

    if (!error && data) {
      setClaims((prev) => prev.map((c) => (c.id === claimId ? (data as Claim) : c)));
      toast.success('Claim resubmitted!');
    } else {
      toast.error('Failed to resubmit claim');
    }
    return { error };
  };

  return { claims, loading, submitClaim, resubmitClaim, refetch: fetchClaims };
}
