'use client';

import { ChevronRight } from 'lucide-react';
import { useId, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { Collapse } from './motion.js';

export type SectionProps = Omit<ComponentProps<'section'>, 'title'> & {
  /** The section's name at the start of its header; any node, such as a title with a badge. */
  title: ReactNode;
  /** A line under the header. */
  description?: ReactNode;
  /** Buttons or a link at the end of the header, after the rule. */
  action?: ReactNode;
  /** The heading level; 2 under a page title, 3 inside a section that has its own. */
  level?: 2 | 3 | 4;
  /** Lets the reader fold the content away by its title, such as a settings group. */
  collapsible?: boolean;
  /** Whether a collapsible section starts open; it does by default. */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * A region of a page without a frame: its title, a hairline running to the end of the
 * header and an optional action, then the content. Size it like any box; given a
 * height, the content takes what the header leaves.
 */
export function Section({
  title,
  description,
  action,
  level = 2,
  collapsible = false,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
  children,
  ...props
}: SectionProps) {
  const Heading = `h${level}` as const;
  const contentId = useId();
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isOpen = !collapsible || (open ?? innerOpen);
  const toggle = () => {
    if (open === undefined) setInnerOpen(!isOpen);
    onOpenChange?.(!isOpen);
  };
  const content = children ? (
    <div id={contentId} data-slot="section-content" className="mt-3 min-h-0 min-w-0 flex-1">
      {children}
    </div>
  ) : null;
  return (
    <section data-slot="section" className={cn('flex min-w-0 flex-col', className)} {...props}>
      <div data-slot="section-header" className="flex min-h-6 min-w-0 items-center gap-3">
        <Heading className="truncate text-xs font-medium text-muted-foreground">
          {collapsible ? (
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={toggle}
              className="-mx-1 inline-flex max-w-full items-center gap-1 rounded-sm px-1 outline-hidden transition-colors duration-(--motion-duration-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight
                aria-hidden
                className={cn(
                  'size-3 shrink-0 transition-transform duration-(--motion-duration-base) ease-enter',
                  isOpen && 'rotate-90',
                )}
              />
              <span className="truncate">{title}</span>
            </button>
          ) : (
            title
          )}
        </Heading>
        <span
          aria-hidden
          data-slot="section-rule"
          className="h-px min-w-4 flex-1 bg-border-subtle"
        />
        {action ? (
          <div data-slot="section-action" className="flex shrink-0 items-center gap-1">
            {action}
          </div>
        ) : null}
      </div>
      {description ? (
        <p data-slot="section-description" className="text-2xs text-subtle-foreground">
          {description}
        </p>
      ) : null}
      {collapsible ? <Collapse open={isOpen}>{content}</Collapse> : content}
    </section>
  );
}
