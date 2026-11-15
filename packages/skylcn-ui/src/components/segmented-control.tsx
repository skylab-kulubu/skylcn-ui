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
  /**
   * md is a 36px row for toolbars and settings; sm is 24px for a switch inside a row of
   * text, such as a chart's range beside its title.
   */
  size?: 'sm' | 'md';
  'aria-label'?: string;
  className?: string;
};

const SIZES = {
  sm: {
    group: 'rounded-md p-0.5 text-3xs',
    option: 'h-4.5 rounded-sm px-2 pointer-coarse:h-8',
    icon: 'size-3',
    // The highlight is inset by the group's padding on both sides
    inset: 'inset-y-0.5 left-0.5 rounded-sm',
    pad: '0.25rem',
  },
  md: {
    group: 'rounded-lg p-1 text-2xs',
    option: 'h-7 rounded-md px-2 pointer-coarse:h-9',
    icon: 'size-4',
    inset: 'inset-y-1 left-1 rounded-md',
    pad: '0.5rem',
  },
} as const;

/** A row of mutually exclusive choices with a sliding highlight, as wide as its longest choice times the count (pass w-full to stretch); icons render icon-only with the label as tooltip. */
export function SegmentedControl({
  options,
  value,
  onValueChange,
  size = 'md',
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps) {
  const count = Math.max(options.length, 1);
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const s = SIZES[size];

  return (
    <ToggleGroup
      data-slot="segmented-control"
      data-size={size}
      value={[value]}
      onValueChange={(next) => {
        if (next[0]) onValueChange(next[0]);
      }}
      aria-label={ariaLabel}
      className={cn(
        'relative inline-grid w-fit max-w-full border border-border bg-muted',
        s.group,
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className={cn(
          'absolute border border-border bg-accent-strong transition-transform duration-(--motion-duration-base) ease-enter',
          s.inset,
        )}
        style={{
          width: `calc((100% - ${s.pad}) / ${count})`,
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
              'relative z-10 flex w-full items-center justify-center text-muted-foreground outline-hidden',
              'transition-colors duration-(--motion-duration-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
              'data-pressed:text-foreground',
              s.option,
            )}
          >
            {Icon ? (
              <Icon className={s.icon} aria-hidden />
            ) : (
              <span className="truncate">{option.label}</span>
            )}
          </Toggle>
        );
      })}
    </ToggleGroup>
  );
}
