'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient, IS_MOCK_MODE as IS_MOCK } from '@/lib/supabase/client';
const supabase = createClient();
import { AppNotification } from '@/types';
import { useAuth } from './useAuth';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>(IS_MOCK ? MOCK_NOTIFICATIONS : []);
  const [loading, setLoading] = useState(!IS_MOCK);

  const fetchNotifications = useCallback(async () => {
    if (IS_MOCK || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setNotifications(data as AppNotification[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (IS_MOCK) return;
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (IS_MOCK || !user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead, refetch: fetchNotifications };
}
