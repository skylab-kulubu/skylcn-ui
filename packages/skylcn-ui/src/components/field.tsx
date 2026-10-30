'use client';

import { Field as FieldPrimitive } from '@base-ui/react/field';
import { Input as InputPrimitive } from '@base-ui/react/input';
import type { LucideIcon } from 'lucide-react';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import {
  controlFocus,
  controlHeight,
  controlIcon,
  controlIconLeft,
  controlIconRoom,
  controlInvalid,
  controlPadding,
  controlRadius,
  controlSurface,
  controlText,
  useControlSize,
  type ControlSize,
} from './control.js';
import { Collapse } from './motion.js';

const controlClass = cn(controlSurface, controlFocus, controlInvalid);
// Read-only reads as filled in, like a locked Combobox, not as a box waiting for input
const readOnlyClass = 'border-border bg-muted text-secondary-foreground hover:border-border';

export type InputProps = InputPrimitive.Props & {
  /** A leading icon inside the box, such as a search glass. */
  icon?: LucideIcon;
  /**
   * sm 32px, md 36px (the default) or lg 38px. Named apart from `size`, a native input
   * attribute; a ControlSizeProvider above sets it for a whole form.
   */
  inputSize?: ControlSize;
};

export function Input({ className, icon: Icon, inputSize, ...props }: InputProps) {
  const size = useControlSize(inputSize);
  const input = (
    <InputPrimitive
      data-slot="input"
      data-size={size}
      className={cn(
        controlClass,
        controlHeight[size],
        controlText[size],
        controlRadius[size],
        controlPadding[size],
        Icon && controlIconRoom[size],
        props.readOnly && readOnlyClass,
        !Icon && className,
      )}
      {...props}
    />
  );
  if (!Icon) return input;
  return (
    <div className={cn('relative', className)}>
      <Icon
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-subtle-foreground',
          controlIcon[size],
          controlIconLeft[size],
        )}
      />
      {input}
    </div>
  );
}

const textareaSize = {
  sm: 'min-h-16 px-2.5 py-1.5',
  md: 'min-h-18 px-2.5 py-2',
  lg: 'min-h-20 px-3 py-2.5',
} as const;

export type TextareaProps = ComponentProps<'textarea'> & {
  /** Counts the characters under the box, against `maxLength` when it has one. */
  showCount?: boolean;
  /** sm, md (the default) or lg, the text and padding of the other boxes at that size. */
  size?: ControlSize;
};

/** A multi-line box; inside a Field it takes the field's label, hint and error like Input. */
export function Textarea({
  className,
  showCount = false,
  onChange,
  size: sizeProp,
  ...props
}: TextareaProps) {
  const size = useControlSize(sizeProp);
  const [typed, setTyped] = useState(() => String(props.defaultValue ?? '').length);
  const control = (
    <FieldPrimitive.Control
      render={
        <textarea
          data-slot="textarea"
          data-size={size}
          className={cn(
            controlClass,
            controlText[size],
            controlRadius[size],
            textareaSize[size],
            'field-sizing-content resize-y leading-relaxed',
            props.readOnly && readOnlyClass,
            className,
          )}
          onChange={(event) => {
            setTyped(event.target.value.length);
            onChange?.(event);
          }}
          {...props}
        />
      }
    />
  );
  if (!showCount) return control;
  const count = props.value === undefined ? typed : String(props.value).length;
  const max = props.maxLength;
  return (
    <div data-slot="textarea-count" className="flex flex-col gap-1">
      {control}
      {/* maxLength already stops the typing; the count is for sighted readers */}
      <span
        aria-hidden
        className={cn(
          'self-end text-3xs tabular-nums transition-colors duration-(--motion-duration-fast)',
          max && count >= max
            ? 'text-destructive'
            : max && count >= max * 0.9
              ? 'text-warning'
              : 'text-subtle-foreground',
        )}
      >
        {max ? `${count}/${max}` : count}
      </span>
    </div>
  );
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn('text-2xs font-medium text-muted-foreground select-none', className)}
      {...props}
    />
  );
}

export type FieldProps = FieldPrimitive.Root.Props & {
  label?: ReactNode;
  /** Under the control; with `variant="question"`, under the question instead. */
  description?: ReactNode;
  /** Shown under the control and marks it invalid. */
  error?: ReactNode;
  /**
   * `question` sets the label as a question in a form someone fills in: larger, with its
   * description under it and an optional number before it.
   */
  variant?: 'default' | 'question';
  /** The question's number, in a badge before a `question` label; red while invalid. */
  number?: ReactNode;
  /** Marks the label with an asterisk; set `required` on the control as well. */
  required?: boolean;
  /** A quiet line under the control, such as "Zorunlu alan"; an error takes its place. */
  hint?: ReactNode;
};

/** A label, a control, a hint and an error, wired together for assistive tech. */
export function Field({
  label,
  description,
  error,
  variant = 'default',
  number,
  required = false,
  hint,
  className,
  children,
  ...props
}: FieldProps) {
  // Keeps the last message while it closes, so it does not empty out on the way
  const [shownError, setShownError] = useState(error);
  if (error && error !== shownError) setShownError(error);
  const question = variant === 'question';
  const invalid = Boolean(error) || Boolean(props.invalid);
  const title = label ? (
    <FieldPrimitive.Label
      className={
        question
          ? 'text-sm font-medium text-foreground'
          : 'text-2xs font-medium text-muted-foreground'
      }
    >
      {label}
      {required ? (
        <span aria-hidden className="ml-0.5 text-destructive-foreground/70">
          *
        </span>
      ) : null}
    </FieldPrimitive.Label>
  ) : null;
  const about = description ? (
    <FieldPrimitive.Description
      className={cn(
        'leading-relaxed',
        question ? 'text-xs text-muted-foreground' : 'text-2xs text-subtle-foreground',
      )}
    >
      {description}
    </FieldPrimitive.Description>
  ) : null;
  return (
    <FieldPrimitive.Root
      data-slot="field"
      invalid={Boolean(error) || undefined}
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      {question ? (
        <div className="mb-1.5 flex gap-3">
          {number != null ? (
            <span
              data-slot="field-number"
              aria-hidden
              className={cn(
                'grid size-6 shrink-0 place-items-center rounded-md border text-xs font-semibold tabular-nums',
                'transition-colors duration-(--motion-duration-fast)',
                invalid
                  ? 'border-destructive/40 bg-destructive/15 text-destructive-foreground'
                  : 'border-border bg-muted text-secondary-foreground',
              )}
            >
              {number}
            </span>
          ) : null}
          <div className="flex min-w-0 flex-col gap-1 pt-0.5">
            {title}
            {about}
          </div>
        </div>
      ) : (
        title
      )}
      {children}
      {question ? null : about}
      {hint && !error ? (
        <FieldPrimitive.Description className="text-2xs leading-relaxed text-subtle-foreground">
          {hint}
        </FieldPrimitive.Description>
      ) : null}
      {/* The gap is cancelled outside and restored inside, so it closes along with the message */}
      <Collapse open={Boolean(error)} className="-mt-1.5">
        <FieldPrimitive.Error match className="pt-1.5 text-2xs text-destructive-foreground">
          {shownError}
        </FieldPrimitive.Error>
      </Collapse>
    </FieldPrimitive.Root>
  );
}
