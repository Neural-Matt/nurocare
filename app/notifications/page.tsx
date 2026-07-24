'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconChip } from '@/components/ui/IconChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Stagger, Reveal } from '@/components/ui/motion';
import { useNotifications } from '@/hooks/useNotifications';
import { AppNotification, NotificationType } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Bell, CheckCheck, FileText, CreditCard, ShieldCheck, Sparkles,
} from 'lucide-react';

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: 'accent' | 'warning' | 'primary' | 'neutral'; label: string }> = {
  claim_update:     { icon: FileText,    color: 'accent',  label: 'Claims'   },
  payment_reminder: { icon: CreditCard,  color: 'warning', label: 'Payments' },
  coverage_status:  { icon: ShieldCheck, color: 'primary', label: 'Coverage' },
  general:          { icon: Sparkles,    color: 'neutral', label: 'General'  },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type Filter = 'all' | NotificationType;

function NotificationRow({ notif, onRead }: { notif: AppNotification; onRead: (id: string) => void }) {
  const cfg = TYPE_CONFIG[notif.type];
  const content = (
    <Card
      padding="md"
      hover
      interactive={!notif.read}
      onClick={() => !notif.read && onRead(notif.id)}
      className={cn('flex items-start gap-3.5', !notif.read && 'border-accent-200')}
    >
      <IconChip icon={<cfg.icon className="w-[18px] h-[18px]" />} color={cfg.color} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm leading-snug', notif.read ? 'font-medium text-neutral-700' : 'font-semibold text-primary-800')}>
            {notif.title}
          </p>
          {!notif.read && <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0 mt-1.5" />}
        </div>
        <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">{notif.message}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-neutral-400">{timeAgo(notif.created_at)}</span>
          <span className="text-neutral-200">·</span>
          <span className="text-xs text-neutral-400">{cfg.label}</span>
        </div>
      </div>
    </Card>
  );

  return notif.action_href ? <Link href={notif.action_href}>{content}</Link> : content;
}

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'claim_update', label: 'Claims' },
    { value: 'payment_reminder', label: 'Payments' },
    { value: 'coverage_status', label: 'Coverage' },
    { value: 'general', label: 'General' },
  ];

  return (
    <AppShell title="Notifications">
      <div className="max-w-lg md:max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'You\'re all caught up'}
          </p>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-colors duration-150',
                filter === value
                  ? 'bg-primary-800 text-white border-primary-800'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You don't have any notifications in this category yet." />
        ) : (
          <Stagger className="space-y-3">
            {filtered.map((n) => (
              <Reveal key={n.id}>
                <NotificationRow notif={n} onRead={markAsRead} />
              </Reveal>
            ))}
          </Stagger>
        )}
      </div>
    </AppShell>
  );
}
