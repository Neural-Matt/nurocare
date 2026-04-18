'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { FamilyMember } from '@/types';
import { useAuth } from './useAuth';
import { MOCK_FAMILY_MEMBERS } from '@/lib/mock-data';
import toast from 'react-hot-toast';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

export function useFamilyMembers() {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>(IS_MOCK ? MOCK_FAMILY_MEMBERS : []);
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchMembers = useCallback(async () => {
    if (IS_MOCK || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (!error && data) setMembers(data as FamilyMember[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const addMember = async (payload: Omit<FamilyMember, 'id' | 'user_id' | 'created_at'>) => {
    if (IS_MOCK) {
      const newMember: FamilyMember = {
        id: `fam-mock-${Date.now()}`,
        user_id: 'mock-user-001',
        ...payload,
        created_at: new Date().toISOString(),
      };
      setMembers((prev) => [...prev, newMember]);
      toast.success(`${payload.name} added to your family`);
      return { error: null };
    }

    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('family_members')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setMembers((prev) => [...prev, data as FamilyMember]);
      toast.success(`${payload.name} added to your family`);
    } else {
      toast.error('Failed to add member');
    }
    return { error };
  };

  const updateMember = async (id: string, payload: Partial<Omit<FamilyMember, 'id' | 'user_id' | 'created_at'>>) => {
    if (IS_MOCK) {
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, ...payload } : m));
      toast.success('Member updated');
      return { error: null };
    }

    const { data, error } = await supabase
      .from('family_members')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setMembers((prev) => prev.map((m) => m.id === id ? data as FamilyMember : m));
      toast.success('Member updated');
    } else {
      toast.error('Failed to update member');
    }
    return { error };
  };

  const removeMember = async (id: string) => {
    if (IS_MOCK) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success('Member removed');
      return { error: null };
    }

    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id);

    if (!error) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success('Member removed');
    } else {
      toast.error('Failed to remove member');
    }
    return { error };
  };

  return { members, loading, addMember, updateMember, removeMember, refetch: fetchMembers };
}
