import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" aria-hidden="true" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="text-neutral-500 hover:text-neutral-900 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'text-neutral-900 font-medium' : 'text-neutral-500'}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
