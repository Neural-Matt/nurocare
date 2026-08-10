'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, ChevronRight, FileText, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { AppNotification, NotificationType } from '@/types';
import { IconChip } from '@/components/ui/IconChip';
import { springs } from '@/components/ui/motion';

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: 'accent' | 'warning' | 'primary' | 'neutral' }> = {
  claim_update:     { icon: FileText,    color: 'accent'  },
  payment_reminder: { icon: CreditCard,  color: 'warning' },
  coverage_status:  { icon: ShieldCheck, color: 'primary' },
  general:          { icon: Sparkles,    color: 'neutral' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function NotifRow({ notif, onRead }: { notif: AppNotification; onRead: (id: string) => void }) {
  const cfg = TYPE_CONFIG[notif.type];
  const inner = (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer',
        notif.read ? 'hover:bg-neutral-50' : 'bg-accent-50/40 hover:bg-accent-50/70',
      )}
      onClick={() => onRead(notif.id)}
    >
      <IconChip icon={<cfg.icon className="w-4 h-4" />} color={cfg.color} size="sm" className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className={cn('text-sm leading-tight truncate', notif.read ? 'font-medium text-neutral-700' : 'font-semibold text-primary-800')}>
            {notif.title}
          </p>
          <span className="text-[10px] text-neutral-400 shrink-0">{timeAgo(notif.created_at)}</span>
        </div>
        <p className="text-xs text-neutral-500 leading-snug line-clamp-2">{notif.message}</p>
      </div>
      {!notif.read && (
        <div className="w-2 h-2 rounded-full bg-accent-500 shrink-0 mt-1.5" />
      )}
    </div>
  );

  if (notif.action_href) {
    return <Link href={notif.action_href}>{inner}</Link>;
  }
  return inner;
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors relative"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-danger-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={springs.snappy}
            className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-elevated border border-neutral-150 z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-150">
              <h3 className="text-sm font-bold text-primary-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] text-accent-600 font-semibold hover:text-accent-500 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="divide-y divide-neutral-150 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-neutral-400">
                  <Bell className="w-8 h-8 opacity-30" />
                  <p className="text-sm font-medium">No notifications</p>
                </div>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <NotifRow
                    key={n.id}
                    notif={n}
                    onRead={(id) => { markAsRead(id); setOpen(false); }}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-neutral-150">
                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1 py-3 text-xs font-semibold text-accent-600 hover:text-accent-500 transition-colors"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
