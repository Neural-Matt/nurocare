'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { springs } from './motion';

interface TabItem {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  /** Unique per instance when multiple Tabs render on the same page, so the shared-layout pill doesn't jump between them. */
  layoutId?: string;
  className?: string;
}

/** Pill-style tab switcher with a shared-layout sliding active indicator — the same pattern already used in Sidebar/BottomNav. */
export function Tabs({ items, value, onChange, layoutId = 'tabs-active-pill', className }: TabsProps) {
  return (
    <div className={cn('inline-flex items-center gap-1 p-1 rounded-xl bg-neutral-100 overflow-x-auto scrollbar-none', className)} role="tablist">
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={cn(
              'relative flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
              active ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 bg-white rounded-lg shadow-card"
                transition={springs.page}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {item.icon}
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
