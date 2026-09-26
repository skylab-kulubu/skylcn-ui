'use client';

import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export type BreadcrumbItem = { href: string; label: string };

export type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
};

/**
 * The trail above a page. On small screens it keeps only the way back and the
 * current page; links render through the provider's link component.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { messages, Link } = useSkylcn();
  if (items.length === 0) return null;
  const current = items[items.length - 1]!;
  const previous = items.length > 1 ? items[items.length - 2]! : null;

  return (
    <nav
      data-slot="breadcrumbs"
      aria-label={messages.breadcrumb}
      className={cn('min-w-0 text-sm text-subtle-foreground', className)}
    >
      <div className="flex min-w-0 items-center gap-1.5 md:hidden">
        {previous ? (
          <>
            <Link
              href={previous.href}
              className="inline-flex min-w-0 items-center gap-1 rounded-md py-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronRight className="size-3.5 shrink-0 rotate-180" />
              <span className="max-w-30 truncate text-xs">{previous.label}</span>
            </Link>
            <ChevronRight className="size-3.5 shrink-0 text-faint-foreground" />
          </>
        ) : null}
        <span
          aria-current="page"
          title={current.label}
          className="max-w-40 truncate text-xs font-medium text-secondary-foreground"
        >
          {current.label}
        </span>
      </div>
      <ol className="hidden min-w-0 items-center md:flex">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li
              key={item.href}
              className={cn(
                'inline-flex items-center gap-1.5',
                last ? 'shrink-0' : 'min-w-0',
                index === items.length - 2 && 'shrink-6',
              )}
            >
              {index > 0 ? (
                <ChevronRight className="mt-0.5 size-4 shrink-0 text-faint-foreground" />
              ) : null}
              {last ? (
                <span
                  aria-current="page"
                  title={item.label}
                  className="max-w-45 truncate font-medium text-secondary-foreground"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  title={item.label}
                  className="min-w-0 truncate rounded-md px-1.5 py-1 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
