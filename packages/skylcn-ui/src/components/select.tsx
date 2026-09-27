'use client';

import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { popupMotionFast } from '../lib/motion.js';
import { useSkylcn } from '../lib/provider.js';

export type SelectOption =
  string | { value: string; label: ReactNode; disabled?: boolean; hint?: ReactNode };

const valueOf = (option: SelectOption) => (typeof option === 'string' ? option : option.value);
const labelOf = (option: SelectOption) => (typeof option === 'string' ? option : option.label);

export type SelectProps = {
  value: string | null | undefined;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: ReactNode;
  /** `box` is a form control; `inline` is a compact text trigger inside a sentence or a row. */
  variant?: 'box' | 'inline';
  size?: 'sm' | 'md';
  /** Text colour of the chosen value, such as a status colour. */
  tone?: string;
  renderOption?: (option: SelectOption) => ReactNode;
  disabled?: boolean;
  name?: string;
  className?: string;
  'aria-label'?: string;
};

export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  variant = 'box',
  size = 'md',
  tone,
  renderOption,
  disabled,
  name,
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  const { messages } = useSkylcn();
  const selected = options.find((option) => valueOf(option) === value);
  const inline = variant === 'inline';

  return (
    <SelectPrimitive.Root
      value={value ?? null}
      onValueChange={(next) => {
        if (typeof next === 'string') onValueChange(next);
      }}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        aria-label={ariaLabel}
        className={cn(
          'group/select font-medium outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
          'transition-[color,background-color,border-color] duration-(--motion-duration-fast) ease-enter',
          inline
            ? 'inline-flex max-w-full items-center gap-0.5 rounded px-1 py-0.5 text-2xs hover:bg-accent data-popup-open:bg-accent'
            : [
                'flex w-full items-center justify-between border border-input bg-input-background hover:border-border-strong',
                'data-popup-open:border-skylab-400/50 data-popup-open:ring-1 data-popup-open:ring-skylab-400/20',
                size === 'sm'
                  ? 'rounded-md px-2 py-1.5 text-2xs pointer-coarse:min-h-9 pointer-coarse:text-xs'
                  : 'rounded-lg px-3 py-2.5 text-xs pointer-coarse:min-h-11 pointer-coarse:text-sm',
              ],
          selected
            ? (tone ?? (inline ? 'text-foreground' : 'text-secondary-foreground'))
            : 'text-subtle-foreground',
          className,
        )}
      >
        <SelectPrimitive.Value className="truncate">
          {() => (selected ? labelOf(selected) : (placeholder ?? messages.select))}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon
          className={cn(
            'shrink-0 transition-transform duration-(--motion-duration-base) ease-enter group-data-popup-open/select:rotate-180',
            inline ? 'ml-0.5 text-faint-foreground' : 'ml-2 text-subtle-foreground',
          )}
        >
          <ChevronDown className={inline ? 'size-2.5' : size === 'sm' ? 'size-3' : 'size-3.5'} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          alignItemWithTrigger={false}
          sideOffset={4}
          align="start"
          className="z-50 outline-hidden"
        >
          <SelectPrimitive.Popup
            data-slot="select-content"
            className={cn(
              'rounded-lg border border-border bg-popover shadow-overlay outline-hidden',
              popupMotionFast,
              inline ? 'max-w-72 min-w-44' : 'w-(--anchor-width) min-w-40',
            )}
          >
            <SelectPrimitive.List className="scrollbar max-h-60 overflow-y-auto p-1">
              {options.length === 0 ? (
                <div className="px-2 py-3 text-center text-xs text-subtle-foreground">
                  {messages.noOptions}
                </div>
              ) : (
                options.map((option) => {
                  const optionValue = valueOf(option);
                  const hint = typeof option === 'string' ? null : option.hint;
                  return (
                    <SelectPrimitive.Item
                      key={optionValue}
                      value={optionValue}
                      disabled={typeof option !== 'string' && option.disabled}
                      className={cn(
                        'group/item flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-xs text-secondary-foreground outline-hidden select-none pointer-coarse:py-2.5 pointer-coarse:text-sm',
                        'transition-colors duration-(--motion-duration-instant)',
                        'data-highlighted:bg-accent data-highlighted:text-foreground-strong',
                        'data-selected:bg-skylab-500/20 data-selected:text-skylab-300',
                        'data-disabled:cursor-not-allowed data-disabled:text-faint-foreground',
                      )}
                    >
                      <SelectPrimitive.ItemText className="truncate">
                        {renderOption ? renderOption(option) : labelOf(option)}
                      </SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="shrink-0 text-skylab-400">
                        <Check className="size-3" />
                      </SelectPrimitive.ItemIndicator>
                      {hint ? (
                        <span className="shrink-0 text-3xs text-subtle-foreground group-data-selected/item:hidden">
                          {hint}
                        </span>
                      ) : null}
                    </SelectPrimitive.Item>
                  );
                })
              )}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
