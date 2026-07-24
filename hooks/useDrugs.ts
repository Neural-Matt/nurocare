'use client';

import { useState, useEffect } from 'react';
import { createClient, IS_MOCK_MODE as IS_MOCK } from '@/lib/supabase/client';
const supabase = createClient();
import { Drug } from '@/types';
import { MOCK_DRUGS } from '@/lib/mock-drugs';

export function useDrugs() {
  const [drugs, setDrugs] = useState<Drug[]>(IS_MOCK ? MOCK_DRUGS : []);
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchDrugs = async () => {
    if (IS_MOCK) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('drugs')
      .select('id, name, generic_name, usage:usage_description, dosage, side_effects, category, prescription_required')
      .order('name', { ascending: true });
    if (!error && data) setDrugs(data as Drug[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  return { drugs, loading, refetch: fetchDrugs };
}
