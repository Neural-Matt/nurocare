'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, ChevronRight, FileText, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { AppNotification, NotificationType } from '@/types';

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  claim_update:     { icon: FileText,    color: 'text-accent-600',   bg: 'bg-accent-50'   },
  payment_reminder: { icon: CreditCard,  color: 'text-warning-600',  bg: 'bg-warning-50'  },
  coverage_status:  { icon: ShieldCheck, color: 'text-blue-600',     bg: 'bg-blue-50'     },
  general:          { icon: Sparkles,    color: 'text-violet-600',   bg: 'bg-violet-50'   },
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
  const Icon = cfg.icon;
  const inner = (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer',
        notif.read ? 'hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70',
      )}
      onClick={() => onRead(notif.id)}
    >
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
        <Icon className={cn('w-4 h-4', cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className={cn('text-sm leading-tight truncate', notif.read ? 'font-medium text-slate-700' : 'font-semibold text-primary-800')}>
            {notif.title}
          </p>
          <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(notif.created_at)}</span>
        </div>
        <p className="text-xs text-slate-500 leading-snug line-clamp-2">{notif.message}</p>
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
        className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors relative"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
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
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                <Bell className="w-8 h-8 opacity-30" />
                <p className="text-sm font-medium">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
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
            <div className="border-t border-slate-100">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1 py-3 text-xs font-semibold text-accent-600 hover:text-accent-500 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
