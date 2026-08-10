import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Heading, Text, Overline } from './Typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

/** Consistent large page-title block used at the top of app pages, below the global Header. */
export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <Overline color="accent" className="mb-1.5">
            {eyebrow}
          </Overline>
        )}
        <Heading as="h1" size="h1">
          {title}
        </Heading>
        {description && (
          <Text color="secondary" className="mt-1.5 max-w-xl">
            {description}
          </Text>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
