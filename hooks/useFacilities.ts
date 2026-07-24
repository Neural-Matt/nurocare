'use client';

import { useState, useEffect } from 'react';
import { createClient, IS_MOCK_MODE as IS_MOCK } from '@/lib/supabase/client';
const supabase = createClient();
import { Facility } from '@/types';
import { MOCK_FACILITIES } from '@/lib/mock-facilities';

export function useFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>(IS_MOCK ? MOCK_FACILITIES : []);
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchFacilities = async () => {
    if (IS_MOCK) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name', { ascending: true });
    if (!error && data) setFacilities(data as Facility[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  return { facilities, loading, refetch: fetchFacilities };
}
