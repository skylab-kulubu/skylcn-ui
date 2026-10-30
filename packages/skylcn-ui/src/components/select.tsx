'use client';

import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { popupMotionBase, useSettled } from '../lib/motion.js';
import { useSkylcn } from '../lib/provider.js';
import {
  controlFocus,
  controlHeight,
  controlOpen,
  controlPadding,
  controlPill,
  controlRadius,
  controlSurface,
  controlText,
  useControlSize,
  type ControlSize,
} from './control.js';

export type SelectOption =
  string | { value: string; label: ReactNode; disabled?: boolean; hint?: ReactNode };

const valueOf = (option: SelectOption) => (typeof option === 'string' ? option : option.value);
const labelOf = (option: SelectOption) => (typeof option === 'string' ? option : option.label);

type SelectCommonProps = {
  options: readonly SelectOption[];
  placeholder?: ReactNode;
  /**
   * `box` is a form control; `pill` the compact 26px trigger of dense rows, such as a role
   * beside a name; `inline` a text trigger inside a sentence.
   */
  variant?: 'box' | 'pill' | 'inline';
  /** The box's size: sm 32px, md 36px (the default) or lg 38px. */
  size?: ControlSize;
  /** Text colour of the chosen value, such as a status colour. */
  tone?: string;
  renderOption?: (option: SelectOption) => ReactNode;
  /**
   * A last row under the options that does something instead of choosing, such as a red
   * "İzni kaldır"; it closes the list and leaves the value as it was.
   */
  action?: { label: ReactNode; onSelect: () => void; destructive?: boolean };
  disabled?: boolean;
  name?: string;
  className?: string;
  'aria-label'?: string;
};

export type SelectProps = SelectCommonProps &
  (
    | {
        multiple?: false;
        value: string | null | undefined;
        onValueChange: (value: string) => void;
      }
    | {
        /** Several choices, ticked in the list; the trigger shows them as chips, or a count when they do not fit. */
        multiple: true;
        value: readonly string[];
        onValueChange: (value: string[]) => void;
      }
  );

// The action rides in the list as an item, so the arrow keys reach it like any option
const ACTION = '\u0000action';

const chipClass =
  'inline-flex shrink-0 items-center rounded-md border border-skylab-600/30 bg-skylab-600/20 px-1.5 py-px font-normal text-foreground';

// Its own part, so the rows' opening rise starts over each time the popup mounts
function OptionList({ children }: { children: ReactNode }) {
  const settled = useSettled();
  return (
    <SelectPrimitive.List
      data-settled={settled || undefined}
      className="scrollbar max-h-60 list-rows overflow-y-auto p-1"
    >
      {children}
    </SelectPrimitive.List>
  );
}

/** The chosen options as chips, or how many there are once the chips would not fit. */
function MultiValue({ labels, signature }: { labels: readonly ReactNode[]; signature: string }) {
  const { messages } = useSkylcn();
  const measure = useRef<HTMLSpanElement>(null);
  const [fits, setFits] = useState(true);
  const count = labels.length;

  // A hidden copy of the chips is measured, so showing the count never feeds back into the check
  useLayoutEffect(() => {
    const node = measure.current;
    if (!node) return;
    const check = () => setFits(node.scrollWidth <= node.clientWidth);
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(check);
    observer.observe(node);
    return () => observer.disconnect();
  }, [signature]);

  const chips = labels.map((label, i) => (
    <span key={i} className={chipClass}>
      {label}
    </span>
  ));
  return (
    <span className="relative flex min-w-0 flex-1 items-center">
      <span
        ref={measure}
        aria-hidden
        className="pointer-events-none invisible absolute inset-0 flex items-center gap-1 overflow-hidden"
      >
        {chips}
      </span>
      {fits ? (
        <span className="flex min-w-0 items-center gap-1 overflow-hidden">{chips}</span>
      ) : (
        <span className="truncate">{messages.selected(count)}</span>
      )}
    </span>
  );
}

export function Select(props: SelectProps) {
  const {
    options,
    placeholder,
    variant = 'box',
    size: sizeProp,
    tone,
    renderOption,
    action,
    disabled,
    name,
    className,
    'aria-label': ariaLabel,
  } = props;
  const { messages } = useSkylcn();
  const size = useControlSize(sizeProp);
  const [open, setOpen] = useState(false);
  // Base UI keeps the list mounted once opened, so each opening keys a fresh one for the rows' rise
  const [opening, setOpening] = useState(0);
  const inline = variant === 'inline';
  const pill = variant === 'pill';
  const chosen = props.multiple
    ? options.filter((option) => props.value.includes(valueOf(option)))
    : options.filter((option) => valueOf(option) === props.value);
  const filled = chosen.length > 0;

  const onValueChange = (next: unknown) => {
    if (props.multiple) {
      const values = (next as string[]).filter((value) => value !== ACTION);
      if ((next as string[]).includes(ACTION)) {
        action?.onSelect();
        setOpen(false);
        return;
      }
      props.onValueChange(values);
    } else if (next === ACTION) {
      action?.onSelect();
    } else if (typeof next === 'string') {
      props.onValueChange(next);
    }
  };

  return (
    <SelectPrimitive.Root
      multiple={props.multiple}
      value={(props.multiple ? [...props.value] : (props.value ?? null)) as never}
      onValueChange={onValueChange}
      open={open}
      onOpenChange={(next) => {
        if (next) setOpening((n) => n + 1);
        setOpen(next);
      }}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-size={inline || pill ? undefined : size}
        aria-label={ariaLabel}
        className={cn(
          'group/select font-medium outline-hidden disabled:cursor-not-allowed disabled:opacity-60',
          inline &&
            'inline-flex max-w-full items-center gap-0.5 rounded px-1 py-0.5 text-2xs transition-colors duration-(--motion-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring data-popup-open:bg-accent',
          pill && controlPill,
          !inline &&
            !pill && [
              controlSurface,
              controlFocus,
              controlOpen,
              controlHeight[size],
              controlText[size],
              controlRadius[size],
              controlPadding[size],
              'flex items-center justify-between gap-2 text-left',
            ],
          filled
            ? (tone ?? (inline ? 'text-foreground' : 'text-secondary-foreground'))
            : 'text-subtle-foreground',
          className,
        )}
      >
        <SelectPrimitive.Value className="flex min-w-0 flex-1 items-center truncate">
          {() =>
            !filled ? (
              (placeholder ?? messages.select)
            ) : props.multiple && !inline && !pill ? (
              <MultiValue
                labels={chosen.map(labelOf)}
                signature={chosen.map(valueOf).join('\u0000')}
              />
            ) : props.multiple ? (
              messages.selected(chosen.length)
            ) : (
              labelOf(chosen[0]!)
            )
          }
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon
          className={cn(
            'shrink-0 transition-transform duration-(--motion-duration-base) ease-enter group-data-popup-open/select:rotate-180',
            inline
              ? 'ml-0.5 text-faint-foreground'
              : pill
                ? 'opacity-70'
                : 'text-subtle-foreground',
          )}
        >
          <ChevronDown
            className={inline || pill ? 'size-2.75' : size === 'lg' ? 'size-4' : 'size-3.5'}
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          alignItemWithTrigger={false}
          sideOffset={pill ? 6 : 4}
          // A pill sits at the end of its row, so its list opens towards the row
          align={pill ? 'end' : 'start'}
          className="z-50 outline-hidden"
        >
          <SelectPrimitive.Popup
            data-slot="select-content"
            className={cn(
              'rounded-lg border border-border bg-popover shadow-overlay outline-hidden',
              popupMotionBase,
              inline || pill ? 'max-w-72 min-w-44' : 'w-(--anchor-width) min-w-40',
            )}
          >
            <OptionList key={opening}>
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
                        'group/item flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-secondary-foreground outline-hidden select-none pointer-coarse:py-2.5 pointer-coarse:text-sm',
                        'transition-colors duration-(--motion-duration-instant)',
                        'data-highlighted:bg-accent data-highlighted:text-foreground-strong',
                        'data-disabled:cursor-not-allowed data-disabled:text-faint-foreground',
                        // Several picks read from their ticks; one pick from its tinted row
                        props.multiple
                          ? 'data-selected:text-foreground'
                          : 'justify-between data-selected:bg-skylab-600/20 data-selected:text-foreground',
                      )}
                    >
                      {props.multiple ? (
                        <span
                          aria-hidden
                          className="grid size-4 shrink-0 place-items-center rounded-sm border border-border-strong text-white transition-colors duration-(--motion-duration-fast) group-data-selected/item:border-skylab-800 group-data-selected/item:bg-skylab-800"
                        >
                          <SelectPrimitive.ItemIndicator>
                            <Check className="size-3" strokeWidth={3} />
                          </SelectPrimitive.ItemIndicator>
                        </span>
                      ) : null}
                      <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
                        {renderOption ? renderOption(option) : labelOf(option)}
                      </SelectPrimitive.ItemText>
                      {props.multiple ? null : (
                        <SelectPrimitive.ItemIndicator className="shrink-0 text-skylab-600">
                          <Check className="size-3" />
                        </SelectPrimitive.ItemIndicator>
                      )}
                      {hint ? (
                        <span className="shrink-0 text-3xs text-subtle-foreground group-data-selected/item:hidden">
                          {hint}
                        </span>
                      ) : null}
                    </SelectPrimitive.Item>
                  );
                })
              )}
              {action ? (
                <>
                  <div aria-hidden className="-mx-1 my-1 h-px bg-border-subtle" />
                  <SelectPrimitive.Item
                    value={ACTION}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-medium outline-hidden select-none pointer-coarse:py-2.5 pointer-coarse:text-sm',
                      'transition-colors duration-(--motion-duration-instant)',
                      action.destructive
                        ? 'text-destructive data-highlighted:bg-destructive/10'
                        : 'text-secondary-foreground data-highlighted:bg-accent data-highlighted:text-foreground-strong',
                    )}
                  >
                    <SelectPrimitive.ItemText>{action.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                </>
              ) : null}
            </OptionList>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
