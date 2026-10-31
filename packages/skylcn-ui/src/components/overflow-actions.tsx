'use client';

import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { Button, IconButton, type ButtonProps } from './button.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, MenuItem } from './menu.js';

export type OverflowAction = {
  key: string;
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  /** The button's look while it fits; the menu row ignores it. */
  variant?: ButtonProps['variant'];
  /** Colours the menu row for actions that remove something. */
  destructive?: boolean;
  disabled?: boolean;
};

export type OverflowActionsProps = {
  /** In order of importance: the first ones stay buttons longest. */
  actions: readonly OverflowAction[];
  size?: 'sm' | 'md' | 'lg';
  /** Names the toolbar for screen readers. */
  'aria-label'?: string;
  className?: string;
};

/**
 * A row of actions that keeps as many buttons as fit and moves the rest into a
 * "⋯" menu at its end, so a page header or bulk bar never wraps or spills on a narrow screen.
 */
export function OverflowActions({
  actions,
  size = 'md',
  'aria-label': ariaLabel,
  className,
}: OverflowActionsProps) {
  const { messages } = useSkylcn();
  const row = useRef<HTMLDivElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(actions.length);

  // Every button is drawn once out of sight, so their widths are known before any is hidden
  useLayoutEffect(() => {
    const box = row.current;
    const measures = ruler.current;
    if (!box || !measures) return;
    const measure = () => {
      const widths = Array.from(measures.children, (child) => (child as HTMLElement).offsetWidth);
      const more = widths.pop() ?? 0;
      const gap = parseFloat(getComputedStyle(measures).columnGap) || 0;
      const room = box.clientWidth;
      const all = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
      if (all <= room) return setFit(widths.length);
      let used = more;
      let count = 0;
      for (const width of widths) {
        if (used + gap + width > room) break;
        used += gap + width;
        count += 1;
      }
      setFit(count);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(measures);
    return () => observer.disconnect();
  }, [actions]);

  const shown = actions.slice(0, fit);
  const folded = actions.slice(fit);
  const button = (action: OverflowAction, hidden = false) => (
    <Button
      key={action.key}
      size={size}
      variant={action.variant ?? (action.destructive ? 'destructive' : 'outline')}
      disabled={action.disabled}
      tabIndex={hidden ? -1 : undefined}
      onClick={hidden ? undefined : action.onSelect}
    >
      {action.icon ? <action.icon /> : null}
      {action.label}
    </Button>
  );
  const iconSize = size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon';

  return (
    <div
      ref={row}
      data-slot="overflow-actions"
      role="toolbar"
      aria-label={ariaLabel}
      className={cn('relative flex min-w-0 flex-1 items-center justify-end gap-2', className)}
    >
      {shown.map((action) => button(action))}
      {folded.length ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <IconButton
                icon={MoreHorizontal}
                label={messages.moreActions}
                variant="outline"
                size={iconSize}
              />
            }
          />
          <DropdownMenuContent align="end">
            {folded.map((action) => (
              <MenuItem
                key={action.key}
                icon={action.icon}
                destructive={action.destructive}
                disabled={action.disabled}
                onClick={action.onSelect}
              >
                {action.label}
              </MenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      <div
        ref={ruler}
        aria-hidden
        inert
        className="pointer-events-none invisible absolute top-0 right-0 flex h-0 w-max gap-2 overflow-hidden"
      >
        {actions.map((action) => button(action, true))}
        <IconButton icon={MoreHorizontal} label="" tooltip={false} size={iconSize} tabIndex={-1} />
      </div>
    </div>
  );
}
