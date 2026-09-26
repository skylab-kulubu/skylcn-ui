'use client';

import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
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
          'group/select focus-visible:ring-ring font-medium outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
          'ease-enter transition-[color,background-color,border-color,box-shadow] duration-(--motion-duration-fast)',
          inline
            ? 'text-2xs hover:bg-accent data-popup-open:bg-accent inline-flex max-w-full items-center gap-0.5 rounded px-1 py-0.5'
            : [
                'border-input bg-input-background hover:border-border-strong flex w-full items-center justify-between border',
                'data-popup-open:border-skylab-400/50 data-popup-open:ring-skylab-400/20 data-popup-open:ring-1',
                size === 'sm'
                  ? 'text-2xs rounded-md px-2 py-1.5'
                  : 'rounded-lg px-3 py-2.5 text-xs',
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
            'ease-enter shrink-0 transition-transform duration-(--motion-duration-base) group-data-popup-open/select:rotate-180',
            inline ? 'text-faint-foreground ml-0.5' : 'text-subtle-foreground ml-2',
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
          className="z-50 outline-none"
        >
          <SelectPrimitive.Popup
            data-slot="select-content"
            className={cn(
              'border-border bg-popover shadow-overlay origin-(--transform-origin) rounded-lg border outline-none',
              'ease-enter transition-[opacity,transform] duration-(--motion-duration-fast)',
              'data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:scale-98 data-starting-style:opacity-0',
              inline ? 'max-w-72 min-w-44' : 'w-(--anchor-width) min-w-40',
            )}
          >
            <SelectPrimitive.List className="scrollbar max-h-60 overflow-y-auto p-1">
              {options.length === 0 ? (
                <div className="text-subtle-foreground px-2 py-3 text-center text-xs">
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
                        'group/item text-secondary-foreground flex w-full cursor-default items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-xs outline-none select-none',
                        'transition-colors duration-(--motion-duration-instant)',
                        'data-highlighted:bg-accent data-highlighted:text-foreground-strong',
                        'data-selected:bg-skylab-500/20 data-selected:text-skylab-300',
                        'data-disabled:text-faint-foreground data-disabled:cursor-not-allowed',
                      )}
                    >
                      <SelectPrimitive.ItemText className="truncate">
                        {renderOption ? renderOption(option) : labelOf(option)}
                      </SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="text-skylab-400 shrink-0">
                        <Check className="size-3" />
                      </SelectPrimitive.ItemIndicator>
                      {hint ? (
                        <span className="text-3xs text-faint-foreground shrink-0 group-data-selected/item:hidden">
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
