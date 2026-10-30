'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { Collapse } from './motion.js';

export type SwitchProps = SwitchPrimitive.Root.Props;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border border-border bg-muted px-0.5 outline-hidden after:absolute after:-inset-2',
        'transition-[background-color,border-color] duration-(--motion-duration-base) ease-enter',
        'focus-visible:ring-2 focus-visible:ring-ring',
        'data-checked:border-skylab-400/50 data-checked:bg-skylab-400/20',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'size-4.5 rounded-full bg-white shadow-sm shadow-black/30',
          'transition-transform duration-(--motion-duration-base) ease-enter data-checked:translate-x-4',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export type ToggleRowProps = Omit<SwitchProps, 'children'> & {
  title: ReactNode;
  description?: ReactNode;
  /** Fades the row to show it has no effect right now. */
  dimmed?: boolean;
  /** Content between the text and the switch, such as a badge. */
  adornment?: ReactNode;
  /** The title while the switch is on, for a row that says its state, such as consent. */
  checkedTitle?: ReactNode;
  /** Shown under the row while it is on, such as the settings the switch unlocks. */
  children?: ReactNode;
};

/** A bordered row with a title, a hint and a switch; the settings panels' toggle. */
export function ToggleRow({
  title,
  checkedTitle,
  description,
  dimmed = false,
  adornment,
  className,
  children,
  ...props
}: ToggleRowProps) {
  const [innerChecked, setInnerChecked] = useState(Boolean(props.defaultChecked));
  const checked = props.checked ?? innerChecked;
  const grouped = children !== undefined && children !== null;
  const row = (
    <label
      data-slot="toggle-row"
      className={cn(
        'flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5',
        !grouped && [
          'rounded-lg border border-border transition-opacity duration-(--motion-duration-slow)',
          dimmed && 'opacity-40',
          className,
        ],
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">
          {checked && checkedTitle ? checkedTitle : title}
        </span>
        {description ? (
          <span className="block text-2xs text-subtle-foreground">{description}</span>
        ) : null}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        {adornment}
        <Switch
          {...props}
          onCheckedChange={(next, details) => {
            setInnerChecked(next);
            props.onCheckedChange?.(next, details);
          }}
        />
      </span>
    </label>
  );
  if (!grouped) return row;
  // The nested content sits outside the label, so pressing inside it never flips the switch
  return (
    <div
      data-slot="toggle-row-group"
      className={cn(
        'rounded-lg border border-border transition-opacity duration-(--motion-duration-slow)',
        dimmed && 'opacity-40',
        className,
      )}
    >
      {row}
      <Collapse open={checked}>
        <div className="border-t border-border-subtle px-3 py-3">{children}</div>
      </Collapse>
    </div>
  );
}
