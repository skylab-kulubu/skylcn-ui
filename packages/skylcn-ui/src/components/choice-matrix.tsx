'use client';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { X } from 'lucide-react';
import { useId, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { IconButton } from './button.js';
import { Checkbox } from './checkbox.js';
import { radioClass, radioDotClass } from './radio-group.js';

export type MatrixRow = { value: string; label: ReactNode; description?: ReactNode };
export type MatrixColumn = { value: string; label: ReactNode };

type MatrixBase = {
  rows: readonly MatrixRow[];
  columns: readonly MatrixColumn[];
  /** Every row must be answered; said to screen readers on each row. */
  required?: boolean;
  /** Tints the rows still unanswered in the error colour, such as after a failed submit. */
  invalid?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
};

type SingleMatrix = MatrixBase & {
  /** One column per row, as radios; a chosen row can be cleared again. */
  multiple?: false;
  /** The chosen column of each row, by row value; a row without one is unanswered. */
  value: Readonly<Partial<Record<string, string>>>;
  onValueChange: (value: Record<string, string>) => void;
};

type MultipleMatrix = MatrixBase & {
  /** Any number of columns per row, as checkboxes. */
  multiple: true;
  value: Readonly<Partial<Record<string, readonly string[]>>>;
  onValueChange: (value: Record<string, string[]>) => void;
};

export type ChoiceMatrixProps = SingleMatrix | MultipleMatrix;

// Rows share the header's tracks through subgrid, so every control sits under its column
const GRID_SINGLE =
  'sm:grid-cols-[minmax(9rem,1.5fr)_repeat(var(--matrix-columns),minmax(3.5rem,1fr))_2.25rem]';
const GRID_MULTIPLE =
  'sm:grid-cols-[minmax(9rem,1.5fr)_repeat(var(--matrix-columns),minmax(3.5rem,1fr))]';

const rowClass = (missing: boolean) =>
  cn(
    'flex flex-col gap-2.5 border-b border-border-subtle px-1 py-3 last:border-b-0',
    'sm:col-span-full sm:grid sm:grid-cols-subgrid sm:items-center sm:gap-0 sm:px-0 sm:py-1',
    'transition-colors duration-(--motion-duration-fast) sm:hover:bg-accent/40',
    missing && 'bg-destructive/5 sm:hover:bg-destructive/10',
  );

// On phones a cell is its control and column name in a wrapping list; from sm the name is read, not shown
const cellClass =
  'flex cursor-pointer items-center gap-2 text-sm text-secondary-foreground has-data-disabled:cursor-not-allowed sm:justify-center sm:py-1.5';

function answeredSingles(value: SingleMatrix['value']) {
  const next: Record<string, string> = {};
  for (const [row, column] of Object.entries(value)) if (column !== undefined) next[row] = column;
  return next;
}

function answeredMultiples(value: MultipleMatrix['value']) {
  const next: Record<string, string[]> = {};
  for (const [row, columns] of Object.entries(value)) if (columns?.length) next[row] = [...columns];
  return next;
}

/**
 * A question asked of several rows with the same answers, such as rating each part of
 * an event: one column per row as radios, or any number with `multiple`. A table on wide
 * screens; on phones each row lists its answers under its name.
 */
export function ChoiceMatrix(props: ChoiceMatrixProps) {
  const { rows, columns, required = false, invalid = false, disabled = false, className } = props;
  const { messages } = useSkylcn();
  const id = useId();

  return (
    <div
      data-slot="choice-matrix"
      role="group"
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
      style={{ '--matrix-columns': columns.length } as CSSProperties}
      className={cn(
        'flex flex-col border-y border-border-subtle sm:grid sm:overflow-x-auto',
        props.multiple ? GRID_MULTIPLE : GRID_SINGLE,
        className,
      )}
    >
      {/* Every control is named by its column, so the header is for the eye only */}
      <div
        aria-hidden
        className="hidden border-b border-border-subtle py-2 text-xs text-muted-foreground sm:col-span-full sm:grid sm:grid-cols-subgrid sm:items-end"
      >
        <span />
        {columns.map((column) => (
          <span key={column.value} className="px-1 text-center leading-snug">
            {column.label}
          </span>
        ))}
        {props.multiple ? null : <span />}
      </div>

      {rows.map((row, index) => {
        const labelId = `${id}-row-${index}`;
        const descriptionId = row.description ? `${id}-description-${index}` : undefined;
        const label = (
          <span className="min-w-0">
            <span id={labelId} className="text-sm text-foreground">
              {row.label}
            </span>
            {row.description ? (
              <span id={descriptionId} className="mt-0.5 block text-xs text-muted-foreground">
                {row.description}
              </span>
            ) : null}
          </span>
        );

        if (props.multiple) {
          const { value, onValueChange } = props;
          const chosen = value[row.value] ?? [];
          const missing = invalid && chosen.length === 0;
          return (
            <div
              key={row.value}
              role="group"
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              className={rowClass(missing)}
            >
              <div className="min-w-0 sm:pr-3 sm:pl-2">{label}</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 sm:contents">
                {columns.map((column) => (
                  <label key={column.value} className={cellClass}>
                    <Checkbox
                      checked={chosen.includes(column.value)}
                      disabled={disabled}
                      aria-required={required || undefined}
                      onCheckedChange={(checked) => {
                        const next = answeredMultiples(value);
                        // Kept in column order, whatever order they were ticked in
                        const picked = columns
                          .map((item) => item.value)
                          .filter((item) =>
                            item === column.value ? checked : chosen.includes(item),
                          );
                        if (picked.length) next[row.value] = picked;
                        else delete next[row.value];
                        onValueChange(next);
                      }}
                      className={cn(missing && 'border-destructive/50')}
                    />
                    <span className="sm:sr-only">{column.label}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        const { value, onValueChange } = props;
        const chosen = value[row.value];
        const missing = invalid && chosen === undefined;
        const clearButton = (place: string) => (
          <IconButton
            icon={X}
            label={messages.clearSelection}
            aria-describedby={labelId}
            variant="ghost"
            size="icon-sm"
            disabled={disabled || chosen === undefined}
            onClick={() => {
              const next = answeredSingles(value);
              delete next[row.value];
              onValueChange(next);
            }}
            className={cn(chosen === undefined && 'invisible', place)}
          />
        );
        return (
          <RadioGroupPrimitive
            key={row.value}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            aria-required={required || undefined}
            aria-invalid={missing || undefined}
            // null, not undefined: an unanswered row stays controlled
            value={chosen ?? null}
            onValueChange={(column) =>
              onValueChange({ ...answeredSingles(value), [row.value]: column as string })
            }
            disabled={disabled}
            className={rowClass(missing)}
          >
            <div className="flex min-w-0 items-start justify-between gap-2 sm:pr-3 sm:pl-2">
              {label}
              {clearButton('-my-1 sm:hidden')}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2.5 sm:contents">
              {columns.map((column) => (
                <label key={column.value} className={cellClass}>
                  <RadioPrimitive.Root
                    value={column.value}
                    className={cn(radioClass, 'mt-0', missing && 'border-destructive/50')}
                  >
                    <RadioPrimitive.Indicator className={radioDotClass} />
                  </RadioPrimitive.Root>
                  <span className="sm:sr-only">{column.label}</span>
                </label>
              ))}
            </div>
            <div className="hidden sm:flex sm:justify-center">{clearButton('')}</div>
          </RadioGroupPrimitive>
        );
      })}
    </div>
  );
}
