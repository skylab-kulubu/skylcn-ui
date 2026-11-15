'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { X } from 'lucide-react';
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { IconButton } from './button.js';
import { Checkbox, CheckboxCard } from './checkbox.js';
import { useControlSize, type ControlSize } from './control.js';
import { RadioCard, radioClass, radioDotClass, repressClears } from './radio-group.js';

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
  /**
   * Height of the cards a narrow matrix stacks a row's answers into, as the box controls':
   * 32, 36 or 38px. Defaults to the ControlSizeProvider's, then md.
   */
  size?: ControlSize;
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

export type MatrixLayout =
  { mode: 'table' } | { mode: 'inline' } | { mode: 'grid'; perRow: number } | { mode: 'list' };

const TABLE: MatrixLayout = { mode: 'table' };
const INLINE: MatrixLayout = { mode: 'inline' };
const LIST: MatrixLayout = { mode: 'list' };

// 28rem: the width the container query picks the table at before anything is measured
const TABLE_REM = 28;
const CHIP_GAP = 4;
// The narrowest a chip may get and still be easy to tap
const CHIP_MIN = 40;

/**
 * Where the table does not fit, how a row's answers sit under its name: on one line when
 * their chips fit, else in equal cells of at most two lines (all in one line of cells, or
 * half per line from six answers), else stacked as cards. `fitsCells` says whether every
 * label fits a cell of the given width.
 */
export function rowLayout(
  widths: readonly number[],
  room: number,
  fitsCells: (cell: number) => boolean,
): MatrixLayout {
  if (widths.length === 0 || room <= 0) return LIST;
  const inline = widths.reduce((sum, width) => sum + width, 0) + CHIP_GAP * (widths.length - 1);
  if (inline <= room) return INLINE;
  const fits = (perRow: number) => {
    const cell = (room - CHIP_GAP * (perRow - 1)) / perRow;
    return cell >= CHIP_MIN && fitsCells(cell);
  };
  if (fits(widths.length)) return { mode: 'grid', perRow: widths.length };
  const half = Math.ceil(widths.length / 2);
  if (widths.length >= 6 && fits(half)) return { mode: 'grid', perRow: half };
  return LIST;
}

// The ruler holds one chip per column, out of sight, in the chips' own type
function measureRows(ruler: HTMLElement, room: number) {
  const chips = Array.from(ruler.children) as HTMLElement[];
  for (const chip of chips) {
    chip.style.width = '';
    chip.style.whiteSpace = 'nowrap';
  }
  const widths = chips.map((chip) => chip.getBoundingClientRect().width);
  return rowLayout(widths, room, (cell) =>
    chips.every((chip) => {
      chip.style.whiteSpace = '';
      chip.style.width = `${cell}px`;
      const text = chip.firstElementChild as HTMLElement;
      const line = parseFloat(getComputedStyle(text).lineHeight);
      // A word wider than the cell spills out of it instead of wrapping
      return text.scrollWidth <= text.clientWidth + 1 && text.offsetHeight <= line * 2 + 1;
    }),
  );
}

function sameLayout(current: MatrixLayout | null, next: MatrixLayout) {
  if (!current || current.mode !== next.mode) return false;
  return current.mode !== 'grid' || (next.mode === 'grid' && current.perRow === next.perRow);
}

/**
 * The matrix's own width picks its layout, not the screen's, so a matrix in a narrow column
 * of a wide page still turns into rows. Until it is measured (on the server), a container
 * query draws the table or stacked cards.
 */
function useMatrixLayout(signature: string) {
  const root = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLDivElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const needed = useRef({ signature, width: 0 });
  const [layout, setLayout] = useState<MatrixLayout | null>(null);
  const mode = layout?.mode;

  useLayoutEffect(() => {
    const box = root.current;
    if (!box) return;
    const measure = () => {
      const room = box.clientWidth;
      const grid = table.current;
      // A table wider than its room turns into rows and stays so until that much room is there
      if (grid && grid.scrollWidth > grid.clientWidth + 1) {
        needed.current = { signature, width: room + grid.scrollWidth - grid.clientWidth };
      }
      const need = needed.current.signature === signature ? needed.current.width : 0;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const next =
        room >= TABLE_REM * rem && room >= need
          ? TABLE
          : ruler.current
            ? measureRows(ruler.current, room)
            : LIST;
      setLayout((current) => (sameLayout(current, next) ? current : next));
    };
    measure();
    let live = true;
    const remeasure = () => {
      if (live) measure();
    };
    // Chip widths change once a web font arrives
    const fonts = document.fonts as FontFaceSet | undefined;
    fonts?.ready.then(remeasure).catch(() => undefined);
    fonts?.addEventListener('loadingdone', remeasure);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(remeasure);
    observer?.observe(box);
    return () => {
      live = false;
      fonts?.removeEventListener('loadingdone', remeasure);
      observer?.disconnect();
    };
  }, [signature, mode]);

  return { root, table, ruler, layout };
}

// Rows share the header's tracks through subgrid, so every control sits under its column.
// A column is never narrower than its longest word, so a table that cannot fit overflows
// and turns into rows instead of breaking words.
const GRID_SINGLE =
  'grid-cols-[minmax(9rem,1.5fr)_repeat(var(--matrix-columns),minmax(min-content,1fr))_2.25rem]';
const GRID_MULTIPLE =
  'grid-cols-[minmax(9rem,1.5fr)_repeat(var(--matrix-columns),minmax(min-content,1fr))]';

const tableClass = 'grid overflow-x-auto border-y border-border-subtle';
const headerClass =
  'col-span-full grid grid-cols-subgrid items-end border-b border-border-subtle py-2 text-xs text-muted-foreground';
const headCellClass = 'min-w-14 px-1 text-center leading-snug';
const tableRowClass = (missing: boolean) =>
  cn(
    'col-span-full grid grid-cols-subgrid items-center border-b border-border-subtle py-1 last:border-b-0',
    'transition-colors duration-(--motion-duration-fast) hover:bg-accent/40',
    missing && 'bg-destructive/5 hover:bg-destructive/10',
  );
const tableCellClass =
  'flex cursor-pointer items-center justify-center py-1.5 has-data-disabled:cursor-not-allowed';

const chipFace = 'rounded-md border px-2 text-xs font-medium';
// A chip has no mark, so its fill shows the choice; the text stays foreground to read on the
// half fill in both themes
const chipClass = (layout: MatrixLayout, missing: boolean) =>
  cn(
    chipFace,
    'flex cursor-pointer items-center justify-center bg-input-background text-secondary-foreground select-none',
    'transition-colors duration-(--motion-duration-fast) hover:bg-accent',
    'has-data-checked:border-skylab-600/50 has-data-checked:bg-skylab-800/50 has-data-checked:text-foreground',
    'has-focus-visible:ring-2 has-focus-visible:ring-ring',
    'has-data-disabled:cursor-not-allowed has-data-disabled:opacity-60',
    missing ? 'border-destructive/50' : 'border-border',
    layout.mode === 'inline'
      ? 'h-10 min-w-8 flex-auto whitespace-nowrap'
      : 'min-h-10 py-1.5 text-center leading-tight text-balance',
  );

function optionsProps(layout: MatrixLayout): { className: string; style?: CSSProperties } {
  if (layout.mode === 'inline') return { className: 'flex gap-1' };
  if (layout.mode === 'grid') {
    return {
      className: 'grid gap-1',
      style: { gridTemplateColumns: `repeat(${layout.perRow}, minmax(0, 1fr))` },
    };
  }
  return { className: 'flex flex-col gap-1.5' };
}

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
 * an event: one column per row as radios, or any number with `multiple`. A table where it
 * fits; where it does not, each row lists its answers under its name, on one line, in
 * equal cells or as cards, whichever fits.
 */
export function ChoiceMatrix(props: ChoiceMatrixProps) {
  const { columns, className } = props;
  const signature = columns
    .map((column) => `${column.value}:${typeof column.label === 'string' ? column.label : ''}`)
    .join('|');
  const { root, table, ruler, layout } = useMatrixLayout(signature);
  const id = useId();

  const draw = (shape: MatrixLayout, key: string) => {
    return shape.mode === 'table' ? (
      <QuestionTable {...props} id={`${id}-${key}`} tableRef={table} />
    ) : (
      <QuestionRows {...props} id={`${id}-${key}`} layout={shape} />
    );
  };

  return (
    <div
      ref={root}
      data-slot="choice-matrix"
      data-layout={layout?.mode}
      role="group"
      aria-label={props['aria-label']}
      aria-labelledby={props['aria-labelledby']}
      style={{ '--matrix-columns': columns.length } as CSSProperties}
      className={cn('@container relative', className)}
    >
      {layout ? (
        draw(layout, 'm')
      ) : (
        <>
          <div className="hidden @md:block">{draw(TABLE, 't')}</div>
          <div className="@md:hidden">{draw(LIST, 'r')}</div>
        </>
      )}
      <div
        ref={ruler}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 flex h-0 gap-1 overflow-hidden"
      >
        {columns.map((column) => (
          <span key={column.value} className={cn(chipFace, 'min-w-8 shrink-0 border-transparent')}>
            <span className="block leading-tight text-balance">{column.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function RowName({
  row,
  labelId,
  descriptionId,
  missing,
  className,
}: {
  row: MatrixRow;
  labelId: string;
  descriptionId?: string;
  missing?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('min-w-0', className)}>
      <span
        id={labelId}
        className={cn('text-sm', missing ? 'text-destructive-foreground' : 'text-foreground')}
      >
        {row.label}
      </span>
      {row.description ? (
        <span id={descriptionId} className="mt-0.5 block text-xs font-normal text-muted-foreground">
          {row.description}
        </span>
      ) : null}
    </span>
  );
}

type QuestionProps = (SingleMatrix | MultipleMatrix) & { id: string };

function ClearRow({
  labelId,
  chosen,
  disabled,
  onClear,
  className,
}: {
  labelId: string;
  chosen: boolean;
  disabled: boolean;
  onClear: () => void;
  className?: string;
}) {
  const { messages } = useSkylcn();
  return (
    <IconButton
      icon={X}
      label={messages.clearSelection}
      aria-describedby={labelId}
      variant="ghost"
      size="icon-sm"
      disabled={disabled || !chosen}
      onClick={onClear}
      className={cn(!chosen && 'invisible', className)}
    />
  );
}

function QuestionTable(props: QuestionProps & { tableRef: Ref<HTMLDivElement> }) {
  const { rows, columns, required = false, invalid = false, disabled = false, id } = props;
  return (
    <div
      ref={props.tableRef}
      className={cn(tableClass, props.multiple ? GRID_MULTIPLE : GRID_SINGLE)}
    >
      {/* Every control is named by its column, so the header is for the eye only */}
      <div aria-hidden className={headerClass}>
        <span />
        {columns.map((column) => (
          <span key={column.value} className={headCellClass}>
            {column.label}
          </span>
        ))}
        {props.multiple ? null : <span />}
      </div>

      {rows.map((row, index) => {
        const labelId = `${id}-row-${index}`;
        const descriptionId = row.description ? `${id}-description-${index}` : undefined;

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
              className={tableRowClass(missing)}
            >
              <RowName
                row={row}
                labelId={labelId}
                descriptionId={descriptionId}
                className="pr-3 pl-2"
              />
              {columns.map((column) => (
                <label key={column.value} className={tableCellClass}>
                  <Checkbox
                    checked={chosen.includes(column.value)}
                    disabled={disabled}
                    aria-required={required || undefined}
                    onCheckedChange={(checked) =>
                      onValueChange(
                        toggled(value, row.value, chosen, column.value, checked, columns),
                      )
                    }
                    className={cn(missing && 'border-destructive/50')}
                  />
                  <span className="sr-only">{column.label}</span>
                </label>
              ))}
            </div>
          );
        }

        const { value, onValueChange } = props;
        const chosen = value[row.value];
        const missing = invalid && chosen === undefined;
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
            className={tableRowClass(missing)}
          >
            <RowName
              row={row}
              labelId={labelId}
              descriptionId={descriptionId}
              className="pr-3 pl-2"
            />
            {columns.map((column) => (
              <label key={column.value} className={tableCellClass}>
                <RadioPrimitive.Root
                  value={column.value}
                  className={cn(radioClass, 'mt-0', missing && 'border-destructive/50')}
                >
                  <RadioPrimitive.Indicator className={radioDotClass} />
                </RadioPrimitive.Root>
                <span className="sr-only">{column.label}</span>
              </label>
            ))}
            <div className="flex justify-center">
              <ClearRow
                labelId={labelId}
                chosen={chosen !== undefined}
                disabled={disabled}
                onClear={() => onValueChange(without(value, row.value))}
              />
            </div>
          </RadioGroupPrimitive>
        );
      })}
    </div>
  );
}

function QuestionRows(props: QuestionProps & { layout: MatrixLayout }) {
  const { rows, columns, required = false, invalid = false, disabled = false, id, layout } = props;
  const size = useControlSize(props.size);
  const options = optionsProps(layout);

  return (
    <div className="flex flex-col gap-5">
      {rows.map((row, index) => {
        const labelId = `${id}-row-${index}`;
        const descriptionId = row.description ? `${id}-description-${index}` : undefined;

        if (props.multiple) {
          const { value, onValueChange } = props;
          const chosen = value[row.value] ?? [];
          const missing = invalid && chosen.length === 0;
          const onPick = (column: string, checked: boolean) =>
            onValueChange(toggled(value, row.value, chosen, column, checked, columns));
          return (
            <div
              key={row.value}
              role="group"
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
            >
              <RowName
                row={row}
                labelId={labelId}
                descriptionId={descriptionId}
                missing={missing}
                className="mb-2 block font-medium"
              />
              <div className={options.className} style={options.style}>
                {columns.map((column) =>
                  layout.mode === 'list' ? (
                    <CheckboxCard
                      key={column.value}
                      label={column.label}
                      size={size}
                      invalid={missing}
                      checked={chosen.includes(column.value)}
                      disabled={disabled}
                      aria-required={required || undefined}
                      onCheckedChange={(checked) => onPick(column.value, checked)}
                    />
                  ) : (
                    <label key={column.value} className={chipClass(layout, missing)}>
                      <CheckboxPrimitive.Root
                        checked={chosen.includes(column.value)}
                        disabled={disabled}
                        aria-required={required || undefined}
                        onCheckedChange={(checked) => onPick(column.value, checked)}
                        className="sr-only"
                      />
                      <span>{column.label}</span>
                    </label>
                  ),
                )}
              </div>
            </div>
          );
        }

        const { value, onValueChange } = props;
        const chosen = value[row.value];
        const missing = invalid && chosen === undefined;
        const clear = () => onValueChange(without(value, row.value));
        return (
          <RadioGroupPrimitive
            key={row.value}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            aria-required={required || undefined}
            aria-invalid={missing || undefined}
            value={chosen ?? null}
            onValueChange={(column) =>
              onValueChange({ ...answeredSingles(value), [row.value]: column as string })
            }
            onClick={repressClears(clear)}
            disabled={disabled}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <RowName
                row={row}
                labelId={labelId}
                descriptionId={descriptionId}
                missing={missing}
                className="font-medium"
              />
              <ClearRow
                labelId={labelId}
                chosen={chosen !== undefined}
                disabled={disabled}
                onClear={clear}
                className="-my-1"
              />
            </div>
            <div className={options.className} style={options.style}>
              {columns.map((column) =>
                layout.mode === 'list' ? (
                  <RadioCard
                    key={column.value}
                    value={column.value}
                    label={column.label}
                    size={size}
                    invalid={missing}
                  />
                ) : (
                  <label key={column.value} className={chipClass(layout, missing)}>
                    <RadioPrimitive.Root value={column.value} className="sr-only" />
                    <span>{column.label}</span>
                  </label>
                ),
              )}
            </div>
          </RadioGroupPrimitive>
        );
      })}
    </div>
  );
}

function without(value: SingleMatrix['value'], row: string) {
  const next = answeredSingles(value);
  delete next[row];
  return next;
}

// Ticked answers are kept in column order, whatever order they were ticked in
function toggled(
  value: MultipleMatrix['value'],
  row: string,
  chosen: readonly string[],
  column: string,
  checked: boolean,
  columns: readonly MatrixColumn[],
) {
  const next = answeredMultiples(value);
  const picked = columns
    .map((item) => item.value)
    .filter((item) => (item === column ? checked : chosen.includes(item)));
  if (picked.length) next[row] = picked;
  else delete next[row];
  return next;
}
