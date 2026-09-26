'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn.js';

export type SegmentedOption = { value: string; label: string; icon?: LucideIcon };

export type SegmentedControlProps = {
  options: readonly SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  'aria-label'?: string;
  className?: string;
};

/** A row of mutually exclusive choices with a sliding highlight; icons render icon-only with the label as tooltip. */
export function SegmentedControl({
  options,
  value,
  onValueChange,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps) {
  const count = Math.max(options.length, 1);
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <ToggleGroup
      data-slot="segmented-control"
      value={[value]}
      onValueChange={(next) => {
        if (next[0]) onValueChange(next[0]);
      }}
      aria-label={ariaLabel}
      className={cn(
        'border-border bg-input-background text-2xs relative grid w-full rounded-lg border p-1',
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="border-skylab-400/40 bg-skylab-500/15 ease-enter absolute inset-y-1 left-1 rounded-md border shadow-sm transition-transform duration-(--motion-duration-base)"
        style={{
          width: `calc((100% - 0.5rem) / ${count})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <Toggle
            key={option.value}
            value={option.value}
            aria-label={option.label}
            title={option.label}
            className={cn(
              'text-secondary-foreground relative z-10 flex h-7 w-full items-center justify-center rounded-md px-2 font-medium outline-none',
              'hover:text-skylab-300 focus-visible:ring-ring transition-colors duration-(--motion-duration-fast) focus-visible:ring-2',
              'data-pressed:text-skylab-300',
            )}
          >
            {Icon ? (
              <Icon className="size-4" aria-hidden />
            ) : (
              <span className="truncate">{option.label}</span>
            )}
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
}
