'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import { OTPField as OTPPrimitive } from '@base-ui/react/otp-field';
import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { Check, ChevronsUpDown, Lock, Minus, Plus, X } from 'lucide-react';
import { useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { popupMotionBase, useFitHeight, useSettled } from '../lib/motion.js';
import { useSkylcn } from '../lib/provider.js';
import {
  controlFocusWithin,
  controlHeight,
  controlIcon,
  controlMinHeight,
  controlRadius,
  controlSurface,
  controlText,
  useControlSize,
  type ControlSize,
} from './control.js';
import { SkylabLoader } from './skylab-loader.js';

export type ComboboxItem = { value: string; label: string; hint?: ReactNode };

// The row that offers what was typed as a new choice rides in the list as an item
type Choice = ComboboxItem & { create?: boolean };
const CREATE = '\u0000create';

// The typed line inside the field, a step shorter than the field so it sits within its border
const inputHeight = {
  sm: 'h-6 pointer-coarse:h-8',
  md: 'h-7 pointer-coarse:h-9',
  lg: 'h-7.5 pointer-coarse:h-9.5',
} as const;
// With chips the field pads 2px, so the typing line is the box's height less border and padding
const chipsInputHeight = {
  sm: 'h-6.5 pointer-coarse:h-8.5',
  md: 'h-7.5 pointer-coarse:h-9.5',
  lg: 'h-8 pointer-coarse:h-10',
} as const;
const inputClass =
  'min-w-16 flex-1 bg-transparent outline-hidden placeholder:text-subtle-foreground';
const fieldButton =
  'grid shrink-0 place-items-center rounded text-subtle-foreground outline-hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring';

type OptionsProps = {
  empty: ReactNode;
  loading?: boolean;
  multiple?: boolean;
};

function Options(props: OptionsProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner sideOffset={4} className="z-50 outline-hidden">
        <OptionsPopup {...props} />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

// Its own part, so the popup's motion starts over each time it mounts on opening
function OptionsPopup({ empty, loading = false, multiple = false }: OptionsProps) {
  const { messages } = useSkylcn();
  const popup = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const settled = useSettled();
  useFitHeight(popup, content);
  return (
    <ComboboxPrimitive.Popup
      ref={popup}
      aria-busy={loading || undefined}
      className={cn(
        'scrollbar max-h-[min(20rem,var(--available-height))] w-(--anchor-width) min-w-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-foreground shadow-overlay outline-hidden',
        popupMotionBase,
        // The height eases as a search narrows or widens the list; reduced motion lets it jump
        'transition-[opacity,scale,translate,height] motion-reduce:transition-[opacity]',
      )}
    >
      <div ref={content}>
        {loading ? (
          <p
            role="status"
            className="flex enter-fade items-center gap-2 px-2 py-2 text-xs text-muted-foreground"
          >
            <SkylabLoader size={14} className="text-subtle-foreground" />
            {messages.searching}
          </p>
        ) : null}
        <ComboboxPrimitive.Empty className="px-2 py-3 text-center text-xs text-muted-foreground empty:hidden">
          {loading ? null : <span className="block enter-fade">{empty}</span>}
        </ComboboxPrimitive.Empty>
        {/* While a search is out the last results stay, dimmed, instead of emptying */}
        <ComboboxPrimitive.List
          data-settled={settled || undefined}
          className={cn(
            'list-rows transition-opacity duration-(--motion-duration-fast)',
            loading && 'opacity-50',
          )}
        >
          {(item: Choice) => (
            <ComboboxPrimitive.Item
              key={item.value}
              value={item}
              className="group flex cursor-default items-center gap-2 rounded-md px-2 py-2 text-xs text-secondary-foreground outline-hidden select-none pointer-coarse:py-2.5 pointer-coarse:text-sm data-highlighted:bg-accent data-highlighted:text-foreground-strong"
            >
              {item.create ? (
                <>
                  <Plus className="size-3.5 shrink-0 text-skylab-600" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{messages.create(item.label)}</span>
                </>
              ) : (
                <>
                  {multiple ? (
                    // The checkbox of a list that keeps several picks, drawn like Checkbox
                    <span
                      aria-hidden
                      className="grid size-4 shrink-0 place-items-center rounded-sm border border-border-strong text-white transition-colors duration-(--motion-duration-fast) group-data-selected:border-skylab-800 group-data-selected:bg-skylab-800"
                    >
                      <ComboboxPrimitive.ItemIndicator>
                        <Check className="size-3" strokeWidth={3} />
                      </ComboboxPrimitive.ItemIndicator>
                    </span>
                  ) : (
                    <span className="flex size-3.5 shrink-0 items-center justify-center">
                      <ComboboxPrimitive.ItemIndicator>
                        <Check className="size-3.5 text-skylab-600" />
                      </ComboboxPrimitive.ItemIndicator>
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.hint ? (
                    <span className="shrink-0 text-3xs text-subtle-foreground">{item.hint}</span>
                  ) : null}
                </>
              )}
            </ComboboxPrimitive.Item>
          )}
        </ComboboxPrimitive.List>
      </div>
    </ComboboxPrimitive.Popup>
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
  /** sm 32px, md 36px (the default) or lg 38px. */
  size?: ControlSize;
  className?: string;
};

export type ComboboxProps = CommonProps & {
  /** Offers what was typed as a new choice whenever no item is called exactly that. */
  onCreate?: (label: string) => void;
  /**
   * Called as the reader types, to search on the server and pass the answer back as
   * `items`; the list then shows `items` as given instead of filtering them itself.
   */
  onSearch?: (query: string) => void;
  /** While a search is out: the list says so and keeps the last results. */
  loading?: boolean;
  /** Shows the value without letting it change, such as one filled in from the profile. */
  readOnly?: boolean;
} & (
    | {
        multiple?: false;
        value: string | null;
        onValueChange: (value: string | null) => void;
      }
    | {
        /** Several choices, kept in the field as removable chips and ticked in the list. */
        multiple: true;
        value: readonly string[];
        onValueChange: (value: string[]) => void;
      }
  );

/** A choice from a long list, narrowed by typing: a member, a team, a city; or several of them. */
export function Combobox(props: ComboboxProps) {
  const {
    items,
    onCreate,
    onSearch,
    loading = false,
    readOnly = false,
    placeholder,
    emptyText,
    size: sizeProp,
    className,
  } = props;
  const { messages, locale } = useSkylcn();
  const size = useControlSize(sizeProp);
  const [query, setQuery] = useState('');
  const picked = props.multiple
    ? items.filter((item) => props.value.includes(item.value))
    : (items.find((item) => item.value === props.value) ?? null);
  const typed = query.trim();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const taken = items.some(
    (item) => item.label.toLocaleLowerCase(tag) === typed.toLocaleLowerCase(tag),
  );
  const list: Choice[] =
    onCreate && typed && !taken
      ? [...items, { value: CREATE, label: typed, create: true }]
      : (items as Choice[]);
  const chips = Array.isArray(picked) ? picked : [];
  const button = cn(fieldButton, size === 'lg' ? 'size-7' : 'size-6');
  const buttonIcon = size === 'lg' ? 'size-4' : 'size-3.5';

  return (
    <ComboboxPrimitive.Root
      multiple={props.multiple}
      items={list}
      value={picked as never}
      onValueChange={(next: unknown) => {
        if (props.multiple) {
          const chosen = next as Choice[];
          const created = chosen.find((item) => item.create);
          if (created) onCreate?.(created.label);
          else props.onValueChange(chosen.map((item) => item.value));
          return;
        }
        const item = next as Choice | null;
        if (item?.create) onCreate?.(item.label);
        else props.onValueChange(item?.value ?? null);
      }}
      onInputValueChange={(next) => {
        setQuery(next);
        onSearch?.(next);
      }}
      filter={onSearch ? null : undefined}
      itemToStringLabel={(item: ComboboxItem) => item.label}
      isItemEqualToValue={(a: ComboboxItem, b: ComboboxItem) => a.value === b.value}
      disabled={props.disabled}
      readOnly={readOnly}
    >
      <ComboboxPrimitive.InputGroup
        data-size={size}
        className={cn(
          controlSurface,
          controlFocusWithin,
          controlMinHeight[size],
          controlText[size],
          controlRadius[size],
          'flex items-center gap-1 pr-1',
          size === 'lg' ? 'pl-3' : 'pl-2.5',
          props.multiple && 'py-0.5',
          // gap-2 lines the text up with an Input's after its icon; the focus ring stays for keyboard readers
          readOnly && 'gap-2 border-border bg-muted hover:border-border',
          className,
        )}
      >
        {readOnly ? (
          <Lock className={cn('shrink-0 text-subtle-foreground', controlIcon[size])} aria-hidden />
        ) : null}
        {props.multiple ? (
          // The chips wrap in their own box, so the open button keeps its place at the end
          <ComboboxPrimitive.Chips className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            {chips.map((item) => (
              <ComboboxPrimitive.Chip
                key={item.value}
                aria-label={item.label}
                className={cn(
                  'flex enter-fade items-center gap-1 rounded-md border border-skylab-600/30 bg-skylab-600/20 py-0.5 pr-0.5 pl-2 text-foreground outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                  size === 'lg' ? 'text-xs' : 'text-2xs',
                )}
              >
                {item.label}
                <ComboboxPrimitive.ChipRemove
                  aria-label={messages.removeItem(item.label)}
                  className="grid size-4 place-items-center rounded hover:bg-skylab-600/30"
                >
                  <X className="size-3" />
                </ComboboxPrimitive.ChipRemove>
              </ComboboxPrimitive.Chip>
            ))}
            <ComboboxPrimitive.Input
              id={props.id}
              aria-label={props['aria-label']}
              placeholder={chips.length ? undefined : placeholder}
              // A narrower floor lets the typing line stay beside the last chip before it wraps
              className={cn(inputClass, 'min-w-12', chipsInputHeight[size])}
            />
          </ComboboxPrimitive.Chips>
        ) : (
          <ComboboxPrimitive.Input
            id={props.id}
            aria-label={props['aria-label']}
            placeholder={placeholder}
            className={cn(inputClass, inputHeight[size], readOnly && 'text-secondary-foreground')}
          />
        )}
        {readOnly ? null : (
          <>
            {props.multiple ? null : (
              <ComboboxPrimitive.Clear aria-label={messages.clearSearch} className={button}>
                <X className={buttonIcon} />
              </ComboboxPrimitive.Clear>
            )}
            <ComboboxPrimitive.Trigger aria-label={messages.openList} className={button}>
              <ChevronsUpDown className={buttonIcon} />
            </ComboboxPrimitive.Trigger>
          </>
        )}
      </ComboboxPrimitive.InputGroup>
      <Options
        empty={emptyText ?? messages.noResults}
        loading={loading}
        multiple={props.multiple}
      />
    </ComboboxPrimitive.Root>
  );
}

export type MultiSelectProps = CommonProps & {
  value: readonly string[];
  onValueChange: (value: string[]) => void;
  onCreate?: (label: string) => void;
};

/** Several choices from a list, kept as removable chips: teams, tags, recipients. `<Combobox multiple>` under another name. */
export function MultiSelect(props: MultiSelectProps) {
  return <Combobox multiple {...props} />;
}

// Each step's − and + buttons stay square with the field
const stepWidth = {
  sm: 'w-8 pointer-coarse:w-10',
  md: 'w-9 pointer-coarse:w-11',
  lg: 'w-9.5 pointer-coarse:w-11.5',
} as const;

export type NumberFieldProps = NumberFieldPrimitive.Root.Props & {
  'aria-label'?: string;
  /** sm 32px, md 36px (the default) or lg 38px. */
  size?: ControlSize;
};

/** A number with − and + steps, arrow keys and Shift for larger steps; typed values are held within min and max. */
export function NumberField({
  className,
  'aria-label': ariaLabel,
  size: sizeProp,
  ...props
}: NumberFieldProps) {
  const { messages, locale } = useSkylcn();
  const size = useControlSize(sizeProp);
  const step = cn(
    'grid h-full shrink-0 place-items-center text-subtle-foreground outline-hidden transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40',
    stepWidth[size],
  );
  const icon = controlIcon[size];
  return (
    <NumberFieldPrimitive.Root
      locale={locale === 'tr' ? 'tr-TR' : 'en-US'}
      className={className}
      {...props}
    >
      <NumberFieldPrimitive.Group
        data-size={size}
        className={cn(
          controlSurface,
          controlFocusWithin,
          controlHeight[size],
          controlRadius[size],
          'flex w-36 overflow-hidden',
        )}
      >
        <NumberFieldPrimitive.Decrement
          aria-label={messages.decrease}
          className={cn(step, 'border-r border-input')}
        >
          <Minus className={icon} />
        </NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input
          aria-label={ariaLabel}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-center text-foreground tabular-nums outline-hidden',
            controlText[size],
          )}
        />
        <NumberFieldPrimitive.Increment
          aria-label={messages.increase}
          className={cn(step, 'border-l border-input')}
        >
          <Plus className={icon} />
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
  /** Words under the two ends of the track, such as a scale's lowest and highest answer. */
  ends?: readonly [ReactNode, ReactNode];
};

/** A value, or a range with two thumbs, picked along a track: a budget, a team size. */
export function Slider({
  label,
  showValue = true,
  thumbLabels,
  ends,
  className,
  ...props
}: SliderProps) {
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
      {ends ? (
        <div className="-mt-1 flex justify-between gap-3 text-2xs text-subtle-foreground">
          <span>{ends[0]}</span>
          <span className="text-right">{ends[1]}</span>
        </div>
      ) : null}
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
