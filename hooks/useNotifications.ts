'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppNotification } from '@/types';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    if (IS_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      setNotifications([...MOCK_NOTIFICATIONS]);
    } else {
      // Supabase query would go here
      setNotifications([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (!IS_MOCK) {
      // await supabase.from('notifications').update({ read: true }).eq('id', id)
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!IS_MOCK) {
      // await supabase.from('notifications').update({ read: true }).eq('user_id', userId)
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead, refetch: fetch };
}
