'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import { OTPField as OTPPrimitive } from '@base-ui/react/otp-field';
import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { Check, ChevronsUpDown, Minus, Plus, X } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { popupMotionFast } from '../lib/motion.js';
import { useSkylcn } from '../lib/provider.js';

export type ComboboxItem = { value: string; label: string; hint?: ReactNode };

const groupClass = cn(
  'flex min-h-9 w-full items-center gap-1 rounded-md border border-input bg-input-background px-2 text-xs text-foreground',
  'transition-[border-color] duration-(--motion-duration-fast) focus-within:border-skylab-400/50 focus-within:ring-2 focus-within:ring-skylab-400/20',
  'pointer-coarse:min-h-11 pointer-coarse:text-base',
);
const inputClass =
  'h-7 min-w-16 flex-1 bg-transparent outline-hidden placeholder:text-subtle-foreground pointer-coarse:h-9';

function Options({ empty }: { empty: ReactNode }) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner sideOffset={4} className="z-50 outline-hidden">
        <ComboboxPrimitive.Popup
          className={cn(
            'scrollbar max-h-[min(20rem,var(--available-height))] w-(--anchor-width) min-w-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-foreground shadow-overlay outline-hidden',
            popupMotionFast,
          )}
        >
          <ComboboxPrimitive.Empty className="px-2 py-3 text-center text-xs text-muted-foreground empty:hidden">
            {empty}
          </ComboboxPrimitive.Empty>
          <ComboboxPrimitive.List>
            {(item: ComboboxItem) => (
              <ComboboxPrimitive.Item
                key={item.value}
                value={item}
                className="group flex cursor-default items-center gap-2 rounded-md px-2 py-2 text-xs text-secondary-foreground outline-hidden select-none pointer-coarse:py-2.5 pointer-coarse:text-sm data-highlighted:bg-accent data-highlighted:text-foreground-strong"
              >
                <span className="flex size-3.5 shrink-0 items-center justify-center">
                  <ComboboxPrimitive.ItemIndicator>
                    <Check className="size-3.5 text-skylab-400" />
                  </ComboboxPrimitive.ItemIndicator>
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.hint ? (
                  <span className="shrink-0 text-3xs text-subtle-foreground">{item.hint}</span>
                ) : null}
              </ComboboxPrimitive.Item>
            )}
          </ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

type CommonProps = {
  items: readonly ComboboxItem[];
  placeholder?: string;
  /** Shown when typing matches nothing. */
  emptyText?: ReactNode;
  'aria-label'?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

export type ComboboxProps = CommonProps & {
  value: string | null;
  onValueChange: (value: string | null) => void;
};

/** A choice from a long list, narrowed by typing: a member, a team, a city. */
export function Combobox({
  items,
  value,
  onValueChange,
  placeholder,
  emptyText,
  className,
  ...props
}: ComboboxProps) {
  const { messages } = useSkylcn();
  const selected = items.find((item) => item.value === value) ?? null;
  return (
    <ComboboxPrimitive.Root
      items={items as ComboboxItem[]}
      value={selected}
      onValueChange={(item: ComboboxItem | null) => onValueChange(item?.value ?? null)}
      itemToStringLabel={(item: ComboboxItem) => item.label}
      isItemEqualToValue={(a: ComboboxItem, b: ComboboxItem) => a.value === b.value}
      disabled={props.disabled}
    >
      <ComboboxPrimitive.InputGroup className={cn(groupClass, className)}>
        <ComboboxPrimitive.Input
          id={props.id}
          aria-label={props['aria-label']}
          placeholder={placeholder}
          className={inputClass}
        />
        <ComboboxPrimitive.Clear
          aria-label={messages.clearSearch}
          className="grid size-6 place-items-center rounded text-subtle-foreground outline-hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" />
        </ComboboxPrimitive.Clear>
        <ComboboxPrimitive.Trigger
          aria-label={messages.openList}
          className="grid size-6 place-items-center rounded text-subtle-foreground outline-hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronsUpDown className="size-3.5" />
        </ComboboxPrimitive.Trigger>
      </ComboboxPrimitive.InputGroup>
      <Options empty={emptyText ?? messages.noResults} />
    </ComboboxPrimitive.Root>
  );
}

export type MultiSelectProps = CommonProps & {
  value: readonly string[];
  onValueChange: (value: string[]) => void;
};

/** Several choices from a list, kept as removable chips: teams, tags, recipients. */
export function MultiSelect({
  items,
  value,
  onValueChange,
  placeholder,
  emptyText,
  className,
  ...props
}: MultiSelectProps) {
  const { messages } = useSkylcn();
  const selected = items.filter((item) => value.includes(item.value));
  return (
    <ComboboxPrimitive.Root
      multiple
      items={items as ComboboxItem[]}
      value={selected}
      onValueChange={(next: ComboboxItem[]) => onValueChange(next.map((item) => item.value))}
      itemToStringLabel={(item: ComboboxItem) => item.label}
      isItemEqualToValue={(a: ComboboxItem, b: ComboboxItem) => a.value === b.value}
      disabled={props.disabled}
    >
      <ComboboxPrimitive.InputGroup className={cn(groupClass, 'flex-wrap py-1', className)}>
        <ComboboxPrimitive.Chips className="contents">
          {selected.map((item) => (
            <ComboboxPrimitive.Chip
              key={item.value}
              aria-label={item.label}
              className="flex enter-fade items-center gap-1 rounded-md border border-skylab-400/30 bg-skylab-500/10 py-0.5 pr-0.5 pl-2 text-2xs text-skylab-300 outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
              <ComboboxPrimitive.ChipRemove
                aria-label={messages.removeItem(item.label)}
                className="grid size-4 place-items-center rounded hover:bg-skylab-500/20"
              >
                <X className="size-3" />
              </ComboboxPrimitive.ChipRemove>
            </ComboboxPrimitive.Chip>
          ))}
          <ComboboxPrimitive.Input
            id={props.id}
            aria-label={props['aria-label']}
            placeholder={selected.length ? undefined : placeholder}
            className={inputClass}
          />
        </ComboboxPrimitive.Chips>
      </ComboboxPrimitive.InputGroup>
      <Options empty={emptyText ?? messages.noResults} />
    </ComboboxPrimitive.Root>
  );
}

export type NumberFieldProps = NumberFieldPrimitive.Root.Props & {
  'aria-label'?: string;
};

/** A number with − and + steps, arrow keys and Shift for larger steps; typed values are held within min and max. */
export function NumberField({ className, 'aria-label': ariaLabel, ...props }: NumberFieldProps) {
  const { messages, locale } = useSkylcn();
  const step =
    'grid h-full w-8 place-items-center text-subtle-foreground outline-hidden transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 pointer-coarse:w-10';
  return (
    <NumberFieldPrimitive.Root
      locale={locale === 'tr' ? 'tr-TR' : 'en-US'}
      className={className}
      {...props}
    >
      <NumberFieldPrimitive.Group className="flex h-9 w-36 overflow-hidden rounded-md border border-input bg-input-background focus-within:border-skylab-400/50 focus-within:ring-2 focus-within:ring-skylab-400/20 pointer-coarse:h-11">
        <NumberFieldPrimitive.Decrement
          aria-label={messages.decrease}
          className={cn(step, 'border-r border-input')}
        >
          <Minus className="size-3.5" />
        </NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input
          aria-label={ariaLabel}
          className="min-w-0 flex-1 bg-transparent text-center text-xs text-foreground tabular-nums outline-hidden pointer-coarse:text-base"
        />
        <NumberFieldPrimitive.Increment
          aria-label={messages.increase}
          className={cn(step, 'border-l border-input')}
        >
          <Plus className="size-3.5" />
        </NumberFieldPrimitive.Increment>
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  );
}

export type SliderProps = SliderPrimitive.Root.Props & {
  label?: ReactNode;
  /** Writes the value, or both ends of a range, beside the label. */
  showValue?: boolean;
  /** Names each thumb when there is no visible label, one per thumb. */
  thumbLabels?: readonly string[];
};

/** A value, or a range with two thumbs, picked along a track: a budget, a team size. */
export function Slider({ label, showValue = true, thumbLabels, className, ...props }: SliderProps) {
  const values = props.value ?? props.defaultValue;
  const count = Array.isArray(values) ? values.length : 1;
  return (
    <SliderPrimitive.Root className={cn('flex w-full flex-col gap-2', className)} {...props}>
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-3 text-xs">
          {label ? (
            <SliderPrimitive.Label className="text-secondary-foreground">
              {label}
            </SliderPrimitive.Label>
          ) : (
            <span />
          )}
          {showValue ? (
            <SliderPrimitive.Value className="text-subtle-foreground tabular-nums" />
          ) : null}
        </div>
      ) : null}
      <SliderPrimitive.Control className="flex h-5 w-full touch-none items-center pointer-coarse:h-8">
        <SliderPrimitive.Track className="relative h-1.5 w-full rounded-full bg-muted">
          <SliderPrimitive.Indicator className="rounded-full bg-skylab-500" />
          {Array.from({ length: count }, (_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              index={i}
              aria-label={thumbLabels?.[i]}
              className="size-4 rounded-full border-2 border-skylab-400 bg-background shadow-sm outline-hidden transition-[scale] duration-(--motion-duration-fast) focus-visible:ring-4 focus-visible:ring-ring active:scale-110 data-dragging:scale-110 pointer-coarse:size-6"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export type OTPFieldProps = Omit<OTPPrimitive.Root.Props, 'length'> & {
  /** How many characters the code has; six by default. */
  length?: number;
  /** Names the field for assistive tech when no label points at it. */
  'aria-label'?: string;
};

/**
 * A one-time code, one box per character. Pasting the whole code fills every
 * box and password managers can fill it too; nothing blocks pasting.
 */
export function OTPField({
  length = 6,
  className,
  id,
  'aria-label': ariaLabel,
  ...props
}: OTPFieldProps) {
  const { messages } = useSkylcn();
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <>
      {/* The first box takes its name from a label pointing at the field's id */}
      {ariaLabel ? (
        <label htmlFor={fieldId} className="sr-only">
          {ariaLabel}
        </label>
      ) : null}
      <OTPPrimitive.Root
        id={fieldId}
        length={length}
        className={cn('flex items-center gap-1.5', className)}
        {...props}
      >
        {Array.from({ length }, (_, i) => (
          <OTPPrimitive.Input
            key={i}
            aria-label={i === 0 ? undefined : messages.codeCharacter(i + 1, length)}
            className="size-10 rounded-md border border-input bg-input-background text-center font-mono text-base text-foreground outline-hidden transition-[border-color] duration-(--motion-duration-fast) selection:bg-skylab-400/30 focus:border-skylab-400/60 focus:ring-2 focus:ring-skylab-400/20 pointer-coarse:size-12"
          />
        ))}
      </OTPPrimitive.Root>
    </>
  );
}
