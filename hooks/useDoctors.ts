'use client';

import { useState, useEffect } from 'react';
import { createClient, IS_MOCK_MODE as IS_MOCK } from '@/lib/supabase/client';
const supabase = createClient();
import { Doctor } from '@/types';
import { MOCK_DOCTORS } from '@/lib/mock-data';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(IS_MOCK ? MOCK_DOCTORS : []);
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchDoctors = async () => {
    if (IS_MOCK) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name', { ascending: true });
    if (!error && data) setDoctors(data as Doctor[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return { doctors, loading, refetch: fetchDoctors };
}
