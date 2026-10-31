'use client';

import { ArrowUp, ChevronRight } from 'lucide-react';
import {
  Children,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { m } from 'motion/react';
import { cn } from '../lib/cn.js';
import { transitions } from '../lib/motion-tokens.js';
import { useSkylcn } from '../lib/provider.js';
import { Collapse } from './motion.js';
import { Skeleton } from './skeleton.js';
import { StateCard, type StateCardProps } from './state-card.js';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
const BREAKPOINTS = ['base', 'sm', 'md', 'lg', 'xl'] as const;
type Step = (typeof BREAKPOINTS)[number];
const RANK: Record<Step, number> = { base: 0, sm: 1, md: 2, lg: 3, xl: 4 };

// Static so Tailwind sees them; a column shown from a breakpoint hides below it.
const SHOW_FROM: Record<Breakpoint, string> = {
  sm: 'hidden sm:flex',
  md: 'hidden md:flex',
  lg: 'hidden lg:flex',
  xl: 'hidden xl:flex',
};
const JUSTIFY = { start: 'justify-start', center: 'justify-center', end: 'justify-end' } as const;
const EXPANDER = 'data-list-expander';
/** The first fill's wave runs from the top row to the last within this, however many rows there are. */
const WAVE_MS = 150;

/**
 * One column of a DataList. Lists drawn from `rows` read every field; lists put
 * together from parts read only the layout fields (`id`, `width`, `from`, `align`).
 */
export type DataListColumn<T = never> = {
  id: string;
  /**
   * A CSS grid track, such as `1.5rem`, `minmax(0,1fr)` or `7rem`, or one per
   * breakpoint, such as `{ base: 'auto', lg: '5rem' }`; each holds until the next.
   */
  width: string | ({ base: string } & Partial<Record<Breakpoint, string>>);
  /** The column appears from this breakpoint up. */
  from?: Breakpoint;
  align?: keyof typeof JUSTIFY;
  header?: ReactNode;
  /** Names a column whose header shows no text, such as a status dot or row actions. */
  label?: string;
  /** Sortable by default when it has a `sortValue`. */
  sortable?: boolean;
  /**
   * What the list sorts the rows by when it sorts them itself; leave it out
   * when the rows arrive sorted, such as one page from a server.
   */
  sortValue?: (row: T) => DataListSortValue;
  /** Lifts the column's cells above the row link so their own buttons and links can be pressed. */
  interactive?: boolean;
  cell?: (row: T) => ReactNode;
  /** Classes for every cell of the column. */
  className?: string;
};

export type DataListSort = { field: string; direction: 'asc' | 'desc' };
export type DataListSortValue = string | number | Date | null | undefined;

/**
 * The sort after a header press: a new column takes `first`, a second press turns it
 * over and a third leaves the rows unsorted, in the order they came.
 */
export function nextDataListSort(
  current: DataListSort | null | undefined,
  field: string,
  first: DataListSort['direction'] = 'asc',
): DataListSort | null {
  if (current?.field !== field) return { field, direction: first };
  return current.direction === first
    ? { field, direction: first === 'asc' ? 'desc' : 'asc' }
    : null;
}

/*
 * The columns and the sort live in separate contexts, each value kept stable,
 * so a sort change redraws the headers only and a parent's render redraws no
 * cell whose row and columns stayed the same.
 */
type ColumnsContextValue = {
  columns: readonly DataListColumn[];
  byId: ReadonlyMap<string, DataListColumn>;
  /** The column whose cells hold the row link. */
  targetId: string | undefined;
};

const ColumnsContext = createContext<ColumnsContextValue | null>(null);

type SortContextValue = { sort?: DataListSort | null; onSortChange?: (field: string) => void };

const SortContext = createContext<SortContextValue>({});

type RowTarget = {
  href?: string;
  onSelect?: () => void;
  label?: string;
  /** Set when the target opens and closes the row's panel. */
  expanded?: boolean;
  controls?: string;
};

/** The row's link or button, handed to the first cell that can hold it. */
const RowTargetContext = createContext<RowTarget | null>(null);

type RowPanelState = {
  expanded: boolean;
  toggle: () => void;
  panelId: string;
  /** The row itself opens the panel, so the chevron only shows the state. */
  rowToggles: boolean;
  label?: string;
};

const RowPanelContext = createContext<RowPanelState | null>(null);

/** Whether the panel around this content has finished opening. */
const PanelOpenedContext = createContext(true);

/**
 * Whether the row's panel has finished opening. Draw heavy content, such as a
 * chart, once it has: work done while the panel opens makes the motion stutter.
 * True outside a panel, and at once for a panel that was open when it mounted.
 */
export function useDataListPanelOpened() {
  return useContext(PanelOpenedContext);
}

/** Whether rows mounting now are the list's first rows, which come in as one wave. */
const EntranceContext = createContext(false);

/** A row's place in the body, for the entrance wave and for gliding when the order changes. */
const RowIndexContext = createContext(0);

function useColumns() {
  const context = useContext(ColumnsContext);
  if (!context) throw new Error('DataList parts must be used inside <DataList>.');
  return context;
}

/** A function whose identity never changes and which always runs the latest `fn`, for memoised rows. */
function useStableCallback<A extends unknown[], R>(fn: (...args: A) => R) {
  const ref = useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: A) => ref.current(...args), []);
}

function widthAt({ width }: DataListColumn, bp: Step) {
  if (typeof width === 'string') return width;
  let track = width.base;
  for (const step of BREAKPOINTS) {
    if (RANK[step] > RANK[bp]) break;
    track = width[step] ?? track;
  }
  return track;
}

function tracksAt(columns: readonly DataListColumn[], bp: Step) {
  return columns
    .filter((column) => !column.from || RANK[column.from] <= RANK[bp])
    .map((column) => widthAt(column, bp))
    .join(' ');
}

// An interactive cell is lifted above the row link and would clip it to itself.
function targetColumn(columns: readonly DataListColumn[]) {
  return columns.find((column) => !column.from && !column.interactive);
}

const ROW_GRID =
  'grid items-center gap-3 grid-cols-(--dl-base) sm:grid-cols-(--dl-sm) md:grid-cols-(--dl-md) lg:grid-cols-(--dl-lg) xl:grid-cols-(--dl-xl)';

type DataListOwnProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** The current sort, read by sortable column headers; `null` for none. */
  sort?: DataListSort | null;
  /** Called with a column id when its header is pressed. */
  onSortChange?: (field: string) => void;
  /**
   * Takes the height left in a flex column, such as AppShellFill, and scrolls
   * the rows under the header inside it, from md up; on phones the page scrolls.
   */
  fill?: boolean;
};

/** A list put together from DataListHeader, DataListBody, DataListRow and DataListCell. */
export type DataListPartsProps = DataListOwnProps & {
  columns: readonly DataListColumn[];
  children: ReactNode;
  rows?: never;
};

/** A list drawn from rows and column definitions: header, rows, loading and empty state. */
export type DataListRowsProps<T> = DataListOwnProps & {
  columns: readonly DataListColumn<T>[];
  rows: readonly T[];
  getRowId: (row: T) => string;
  rowHref?: (row: T) => string | undefined;
  onRowSelect?: (row: T) => void;
  /** The accessible name of the row's link or button. */
  rowLabel?: (row: T) => string;
  rowClassName?: (row: T) => string | undefined;
  /** Shows skeleton rows in the list's own layout. */
  loading?: boolean;
  skeletonRows?: number;
  /** The state card shown when there are no rows; "No results" by default. */
  empty?: StateCardProps;
  /**
   * Lets a row open a panel across the list's width, with a chevron column at
   * the start. Rows without their own link or action open by being pressed.
   */
  renderPanel?: (row: T) => ReactNode;
  /** Which rows can open; all of them by default. */
  canExpand?: (row: T) => boolean;
  /** The open row's id, for a list that keeps it, such as in the address. */
  expandedId?: string | null;
  onExpandedChange?: (id: string | null) => void;
  /** The sort the list starts with when it keeps the sort itself, without `sort`. */
  defaultSort?: DataListSort;
  children?: never;
};

export type DataListProps<T = never> = DataListPartsProps | DataListRowsProps<T>;

/**
 * A table-like list whose columns collapse by breakpoint, with sortable headers,
 * linkable rows and rows that open a panel. Pass `rows` to draw it from column
 * definitions, or put it together from its parts.
 */
export function DataList<T>(props: DataListRowsProps<T>): ReactElement;
export function DataList(props: DataListPartsProps): ReactElement;
export function DataList<T>(props: DataListProps<T>): ReactElement {
  return isRows(props) ? <DataListRows {...props} /> : <DataListFrame {...props} />;
}

function isRows<T>(props: DataListProps<T>): props is DataListRowsProps<T> {
  return props.rows !== undefined;
}

function DataListFrame({
  columns,
  sort,
  onSortChange,
  fill = false,
  className,
  style,
  children,
  ...props
}: DataListPartsProps) {
  const layout = useMemo<ColumnsContextValue>(
    () => ({
      columns,
      byId: new Map(columns.map((column) => [column.id, column])),
      targetId: targetColumn(columns)?.id,
    }),
    [columns],
  );
  const sorting = useMemo(() => ({ sort, onSortChange }), [sort, onSortChange]);
  const vars = useMemo(
    () => Object.fromEntries(BREAKPOINTS.map((bp) => [`--dl-${bp}`, tracksAt(columns, bp)])),
    [columns],
  ) as CSSProperties;
  return (
    <ColumnsContext.Provider value={layout}>
      <SortContext.Provider value={sorting}>
        <div
          data-slot="data-list"
          role="table"
          className={cn(
            'min-w-0',
            // Overflow only from md: a scroll box on phones would hold the sticky header in place
            fill && 'scrollbar md:min-h-0 md:flex-1 md:overflow-y-auto',
            className,
          )}
          style={{ ...vars, ...style }}
          {...props}
        >
          {children}
        </div>
      </SortContext.Provider>
    </ColumnsContext.Provider>
  );
}

function DataListRows<T>({
  columns,
  rows,
  getRowId,
  rowHref,
  onRowSelect,
  rowLabel,
  rowClassName,
  loading = false,
  skeletonRows = 4,
  empty,
  renderPanel,
  canExpand,
  expandedId,
  onExpandedChange,
  sort,
  onSortChange,
  defaultSort,
  ...props
}: DataListRowsProps<T>) {
  const { messages, locale } = useSkylcn();
  const [ownSort, setOwnSort] = useState<DataListSort | null>(defaultSort ?? null);
  const [ownOpenId, setOwnOpenId] = useState<string | null>(null);
  const openId = expandedId !== undefined ? expandedId : ownOpenId;

  // Rows with a link or action of their own open through a chevron button instead
  const rowsAct = Boolean(rowHref || onRowSelect);
  const hasPanel = Boolean(renderPanel);
  const all = useMemo<readonly DataListColumn<T>[]>(
    () =>
      hasPanel
        ? [
            {
              id: EXPANDER,
              width: rowsAct ? '1.5rem' : '0.875rem',
              align: 'center',
              label: messages.details,
              interactive: rowsAct,
            },
            ...columns,
          ]
        : columns,
    [hasPanel, rowsAct, messages.details, columns],
  );

  const current = sort !== undefined ? sort : ownSort;
  const changeSort = useStableCallback((field: string) => {
    onSortChange?.(field);
    if (sort !== undefined) return;
    const value = columns.find((column) => column.id === field)?.sortValue;
    // Text goes A to Z first; figures and dates go largest and latest first
    const sample = value ? rows.map(value).find((key) => key != null) : undefined;
    setOwnSort(nextDataListSort(current, field, typeof sample === 'string' ? 'asc' : 'desc'));
  });
  const sortBy = current && columns.find((column) => column.id === current.field)?.sortValue;
  const direction = current?.direction ?? 'asc';
  const shown = useMemo(
    () => (sortBy ? sortRows(rows, sortBy, direction, locale) : rows),
    [rows, sortBy, direction, locale],
  );

  const select = useStableCallback((row: T) => onRowSelect?.(row));
  const toggle = useStableCallback((id: string, open: boolean) => {
    const next = open ? id : null;
    if (expandedId === undefined) setOwnOpenId(next);
    onExpandedChange?.(next);
  });

  // The same element while the columns stay, so opening a row or typing skips the headers
  const header = useMemo(
    () => (
      <DataListHeader>
        {all.map((column) => (
          <DataListColumnHeader
            key={column.id}
            column={column.id}
            sortable={column.sortable ?? Boolean(column.sortValue)}
            label={column.label}
          >
            {column.header}
          </DataListColumnHeader>
        ))}
      </DataListHeader>
    ),
    [all],
  );

  return (
    <DataListFrame columns={all} sort={current} onSortChange={changeSort} {...props}>
      {header}
      {loading ? (
        <DataListSkeleton rows={skeletonRows} />
      ) : shown.length === 0 ? (
        <DataListEmpty title={messages.noResults} {...empty} />
      ) : (
        <DataListBody>
          {shown.map((row) => {
            const id = getRowId(row);
            const expandable = hasPanel && (canExpand?.(row) ?? true);
            const open = expandable && openId === id;
            return (
              <RowView
                key={id}
                id={id}
                row={row}
                columns={all}
                href={rowHref?.(row)}
                label={rowLabel?.(row)}
                className={rowClassName?.(row)}
                selectable={Boolean(onRowSelect)}
                onSelect={select}
                expandable={expandable}
                open={open}
                // Built for the open row only, on every render, so its panel never goes stale
                panel={open ? renderPanel?.(row) : null}
                onToggle={toggle}
              />
            );
          })}
        </DataListBody>
      )}
    </DataListFrame>
  );
}

type RowViewProps<T> = {
  id: string;
  row: T;
  columns: readonly DataListColumn<T>[];
  href?: string;
  label?: string;
  className?: string;
  selectable: boolean;
  onSelect: (row: T) => void;
  expandable: boolean;
  open: boolean;
  panel: ReactNode;
  onToggle: (id: string, open: boolean) => void;
};

/**
 * One row of a list drawn from `rows`. Memoised: it draws again only when its
 * row, the columns, its link or its open state change, so typing, opening a
 * row or sorting leaves the other rows alone.
 */
const RowView = memo(function RowView<T>({
  id,
  row,
  columns,
  href,
  label,
  className,
  selectable,
  onSelect,
  expandable,
  open,
  panel,
  onToggle,
}: RowViewProps<T>) {
  const select = useCallback(() => onSelect(row), [onSelect, row]);
  const changeOpen = useCallback((next: boolean) => onToggle(id, next), [onToggle, id]);
  return (
    <DataListRow
      href={href}
      onSelect={selectable ? select : undefined}
      label={label}
      className={className}
      expanded={expandable ? open : undefined}
      onExpandedChange={changeOpen}
      panel={panel}
    >
      {columns.map((column) =>
        column.id === EXPANDER ? (
          <DataListCell
            key={column.id}
            column={column.id}
            interactive={Boolean(href || selectable)}
          >
            <DataListExpander />
          </DataListCell>
        ) : (
          <DataListCell key={column.id} column={column.id} className={column.className}>
            {column.cell?.(row)}
          </DataListCell>
        ),
      )}
    </DataListRow>
  );
}) as <T>(props: RowViewProps<T>) => ReactElement;

const collators = new Map<string, Intl.Collator>();

function collatorFor(locale: string) {
  let collator = collators.get(locale);
  if (!collator) {
    collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
    collators.set(locale, collator);
  }
  return collator;
}

/** Sorts a copy, stable, with empty values last in either direction. */
function sortRows<T>(
  rows: readonly T[],
  value: (row: T) => DataListSortValue,
  direction: DataListSort['direction'],
  locale: string,
) {
  const collator = collatorFor(locale);
  const sign = direction === 'asc' ? 1 : -1;
  const keyOf = (row: T) => {
    const key = value(row);
    return key instanceof Date ? key.getTime() : key;
  };
  return rows
    .map((row) => ({ row, key: keyOf(row) }))
    .sort((a, b) => {
      if (a.key == null || b.key == null) return a.key == null ? (b.key == null ? 0 : 1) : -1;
      return (
        sign *
        (typeof a.key === 'string' && typeof b.key === 'string'
          ? collator.compare(a.key, b.key)
          : Number(a.key) - Number(b.key))
      );
    })
    .map(({ row }) => row);
}

function columnClass(column: DataListColumn | undefined) {
  return cn(
    'min-w-0 items-center',
    column?.from ? SHOW_FROM[column.from] : 'flex',
    JUSTIFY[column?.align ?? 'start'],
  );
}

export function DataListHeader({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="data-list-header"
      role="row"
      className={cn(
        ROW_GRID,
        'sticky top-[var(--skylcn-sticky-top,0px)] z-20 border-b border-border bg-background px-3 pb-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type DataListColumnHeaderProps = Omit<ComponentProps<'div'>, 'children'> & {
  column: string;
  /** Pressing the header asks the list to sort by this column. */
  sortable?: boolean;
  /** Names a column whose header shows no text, such as a status dot or row actions. */
  label?: string;
  children?: ReactNode;
};

const COLUMN_LABEL = 'text-2xs font-medium text-subtle-foreground';

/** A column's header; renders nothing for a column the list does not have, so columns can come and go. */
export function DataListColumnHeader({
  column,
  sortable = false,
  label,
  className,
  children,
  ...props
}: DataListColumnHeaderProps) {
  const { byId } = useColumns();
  const { sort, onSortChange } = useContext(SortContext);
  const { messages } = useSkylcn();
  const def = byId.get(column);
  if (!def) return null;
  const active = sort?.field === column;
  const descending = active && sort!.direction === 'desc';
  const name = label ?? (typeof children === 'string' ? children : undefined);
  const hiddenName = label && !children ? <span className="sr-only">{label}</span> : null;

  if (!sortable || !onSortChange) {
    return (
      <div role="columnheader" className={cn(columnClass(def), COLUMN_LABEL, className)} {...props}>
        {children}
        {hiddenName}
      </div>
    );
  }

  return (
    <div
      role="columnheader"
      aria-sort={active ? (sort!.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn(columnClass(def), className)}
      {...props}
    >
      <button
        type="button"
        onClick={() => onSortChange(column)}
        title={name ? messages.sortBy(name) : undefined}
        className={cn(
          COLUMN_LABEL,
          'group/sort inline-flex min-w-0 items-center gap-1 rounded outline-hidden',
          'transition-colors duration-(--motion-duration-fast) hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-ring',
          active && 'text-secondary-foreground',
        )}
      >
        {children ? <span className="truncate">{children}</span> : null}
        {hiddenName}
        {/* The dot turns into an arrow when the column sorts, and the arrow turns over with the direction */}
        <span aria-hidden className="grid size-2.75 shrink-0 place-items-center">
          <span
            className={cn(
              'col-start-1 row-start-1 size-1 rounded-full bg-faint-foreground transition-[opacity,scale,background-color] duration-(--motion-duration-base) ease-enter group-hover/sort:bg-muted-foreground',
              active ? 'scale-50 opacity-0' : 'scale-100 opacity-100',
            )}
          />
          <ArrowUp
            strokeWidth={2}
            className={cn(
              'col-start-1 row-start-1 size-2.75 text-skylab-300 transition-[opacity,scale,rotate] duration-(--motion-duration-base) ease-enter motion-reduce:scale-100',
              active ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
              descending ? 'rotate-180' : 'rotate-0',
            )}
          />
        </span>
      </button>
    </div>
  );
}

/**
 * When the rows first arrive they rise in one even wave, top to bottom within
 * WAVE_MS however long the list is, so no rows lag and then land together;
 * later sorts, searches and pages swap in place.
 */
export function DataListBody({ className, style, children, ...props }: ComponentProps<'div'>) {
  const count = Children.count(children);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!count || settled) return;
    const timer = setTimeout(() => setSettled(true), 500);
    return () => clearTimeout(timer);
  }, [count, settled]);

  // Never wider than half the stagger token, which reduced motion sets to zero
  const step = `min(calc(var(--motion-stagger) / 2), ${(WAVE_MS / Math.max(count - 1, 1)).toFixed(2)}ms)`;

  return (
    <EntranceContext.Provider value={!settled}>
      <div
        data-slot="data-list-body"
        role="rowgroup"
        className={cn('divide-y divide-border-subtle', className)}
        style={{ '--dl-step': step, ...style } as CSSProperties}
        {...props}
      >
        {Children.map(children, (child, index) => (
          <RowIndexContext.Provider value={index}>{child}</RowIndexContext.Provider>
        ))}
      </div>
    </EntranceContext.Provider>
  );
}

// Motion owns these handler names with its own signatures on the row element.
type MotionOwned = 'onSelect' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd';

export type DataListRowProps = Omit<ComponentProps<'div'>, MotionOwned> & {
  /** Makes the whole row a link. Interactive cells stay pressable on their own. */
  href?: string;
  /** Makes the whole row a button. */
  onSelect?: () => void;
  /** The accessible name of the row link or button. */
  label?: string;
  selected?: boolean;
  /** @deprecated DataListBody numbers its rows itself, so this does nothing; it goes away later. */
  index?: number;
  /**
   * Whether the row's panel is open; set it, even to false, to make the row
   * open one. Without `href` or `onSelect`, pressing the row opens it.
   */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** What the row opens to, across the list's width. */
  panel?: ReactNode;
};

export function DataListRow({
  href,
  onSelect,
  label,
  selected = false,
  index,
  expanded,
  onExpandedChange,
  panel,
  className,
  style,
  children,
  ...props
}: DataListRowProps) {
  const firstFill = useContext(EntranceContext);
  const position = useContext(RowIndexContext);
  const panelId = useId();
  const expandable = expanded !== undefined;
  const open = expanded === true;
  // A panel open on mount shows without motion, so it counts as opened from the start
  const [opened, setOpened] = useState(open);
  if (!open && opened) setOpened(false);
  const toggle = useCallback(() => onExpandedChange?.(!open), [onExpandedChange, open]);
  const ownTarget = Boolean(href || onSelect);
  const target = useMemo<RowTarget | null>(
    () =>
      ownTarget
        ? { href, onSelect, label }
        : expandable
          ? { onSelect: toggle, label, expanded: open, controls: open ? panelId : undefined }
          : null,
    [ownTarget, href, onSelect, label, expandable, toggle, open, panelId],
  );
  const panelState = useMemo<RowPanelState | null>(
    () => (expandable ? { expanded: open, toggle, panelId, rowToggles: !ownTarget, label } : null),
    [expandable, open, toggle, panelId, ownTarget, label],
  );

  return (
    <RowPanelContext.Provider value={panelState}>
      <RowTargetContext.Provider value={target}>
        <m.div
          data-slot="data-list-row-group"
          data-expanded={open || undefined}
          // Rows glide to their new places when the order changes, and only then
          // does motion measure them; rows that turn up later (a search, a
          // filter) fade in, the first fill comes in as the body's wave
          layout="position"
          layoutDependency={position}
          transition={{ layout: transitions.layout }}
          initial={firstFill ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'group/row transition-colors duration-(--motion-duration-fast)',
            open && 'bg-row-highlight',
            firstFill && 'enter-rise',
            className,
          )}
          style={
            firstFill
              ? {
                  animationDelay: `calc(var(--dl-step, 0ms) * ${position})`,
                  animationDuration: 'var(--motion-duration-fast)',
                  ...style,
                }
              : style
          }
          {...props}
        >
          <div
            data-slot="data-list-row"
            role="row"
            aria-selected={selected || undefined}
            className={cn(
              ROW_GRID,
              'relative px-3 py-2.5 transition-colors duration-(--motion-duration-fast)',
              target && !open && 'hover:bg-row-highlight',
              selected && 'bg-skylab-500/5',
            )}
          >
            {children}
          </div>
          {expandable ? (
            <Collapse open={open} onSettle={setOpened}>
              <div data-slot="data-list-panel" role="row">
                <div role="cell" id={panelId} className="px-3 pt-1 pb-4">
                  <PanelOpenedContext.Provider value={opened}>{panel}</PanelOpenedContext.Provider>
                </div>
              </div>
            </Collapse>
          ) : null}
        </m.div>
      </RowTargetContext.Provider>
    </RowPanelContext.Provider>
  );
}

const OVERLAY =
  'absolute inset-0 rounded-[inherit] outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';

/** Stretches over the whole row from inside a cell, so the table keeps only cells in its rows. */
function RowTargetOverlay({ href, onSelect, label, expanded, controls }: RowTarget) {
  const { Link } = useSkylcn();
  if (href) {
    return (
      <Link href={href} className={OVERLAY}>
        <span className="sr-only">{label}</span>
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      className={OVERLAY}
    />
  );
}

export type DataListCellProps = ComponentProps<'div'> & {
  column: string;
  /** Lifts the cell above the row link so its own buttons and links can be pressed. */
  interactive?: boolean;
};

/** A row's cell; renders nothing for a column the list does not have, so columns can come and go. */
export function DataListCell({
  column,
  interactive,
  className,
  children,
  ...props
}: DataListCellProps) {
  const { byId, targetId } = useColumns();
  const target = useContext(RowTargetContext);
  const def = byId.get(column);
  if (!def) return null;
  const holdsTarget = target && targetId === column;
  return (
    <div
      role="cell"
      className={cn(
        columnClass(def),
        (interactive ?? def.interactive) && 'relative z-10',
        className,
      )}
      {...props}
    >
      {holdsTarget ? <RowTargetOverlay {...target} /> : null}
      {children}
    </div>
  );
}

/**
 * The chevron of a row that opens a panel, turning as it opens. When the row
 * has a link or action of its own, the chevron is the button that opens it.
 */
export function DataListExpander({ className }: { className?: string }) {
  const state = useContext(RowPanelContext);
  const { messages } = useSkylcn();
  if (!state) return null;
  const icon = (
    <ChevronRight
      aria-hidden
      className={cn(
        'size-3.5 shrink-0 transition-[rotate,color] duration-(--motion-duration-base) ease-enter',
        state.expanded
          ? 'rotate-90 text-secondary-foreground'
          : 'text-subtle-foreground group-hover/row:text-muted-foreground',
      )}
    />
  );
  if (state.rowToggles) {
    return <span className={cn('pointer-events-none inline-flex', className)}>{icon}</span>;
  }
  return (
    <button
      type="button"
      onClick={state.toggle}
      aria-expanded={state.expanded}
      aria-controls={state.expanded ? state.panelId : undefined}
      aria-label={state.label ? messages.rowDetails(state.label) : messages.details}
      className={cn(
        'inline-grid size-6 place-items-center rounded-md outline-hidden transition-colors duration-(--motion-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {icon}
    </button>
  );
}

// Static so Tailwind sees them
const HOVER_FROM: Record<Step, string> = {
  base: 'pointer-fine:grid-cols-[0fr] pointer-fine:opacity-0',
  sm: 'sm:pointer-fine:grid-cols-[0fr] sm:pointer-fine:opacity-0',
  md: 'md:pointer-fine:grid-cols-[0fr] md:pointer-fine:opacity-0',
  lg: 'lg:pointer-fine:grid-cols-[0fr] lg:pointer-fine:opacity-0',
  xl: 'xl:pointer-fine:grid-cols-[0fr] xl:pointer-fine:opacity-0',
};

export type DataListActionsProps = ComponentProps<'div'> & {
  /**
   * Waits for hover only from this breakpoint up and shows the actions below
   * it. Use it when the column's width is `auto` there, so opening them does
   * not shift the row.
   */
  hoverFrom?: Breakpoint;
};

/**
 * A row's quick actions. Where there is a mouse they open out while the row is
 * hovered, focused or open; on touch screens they always show.
 */
export function DataListActions({
  hoverFrom,
  className,
  children,
  ...props
}: DataListActionsProps) {
  return (
    <div
      data-slot="data-list-actions"
      className={cn(
        // Animating the track from 0fr to 1fr opens them to their own width, however many there are
        'grid grid-cols-[1fr] transition-[grid-template-columns,opacity] duration-(--motion-duration-base) ease-enter',
        HOVER_FROM[hoverFrom ?? 'base'],
        'group-hover/row:grid-cols-[1fr] group-hover/row:opacity-100',
        'group-focus-within/row:grid-cols-[1fr] group-focus-within/row:opacity-100',
        'group-data-expanded/row:grid-cols-[1fr] group-data-expanded/row:opacity-100',
        className,
      )}
      {...props}
    >
      {/* The inset keeps the buttons' focus rings clear of the clipping */}
      <div className="-m-0.5 flex min-w-0 items-center gap-1 overflow-hidden p-0.5">{children}</div>
    </div>
  );
}

export type DataListTitleProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: ReactNode;
  subtitle?: ReactNode;
  /** An icon tile, avatar or status before the text. */
  leading?: ReactNode;
  /** `md` for a row's main column, `sm` for a secondary one such as an owner. */
  size?: 'sm' | 'md';
};

/** A cell's title with a line under it and something before it: a form, a person, a file. */
export function DataListTitle({
  title,
  subtitle,
  leading,
  size = 'md',
  className,
  ...props
}: DataListTitleProps) {
  return (
    <div
      data-slot="data-list-title"
      className={cn('flex min-w-0 items-center', size === 'md' ? 'gap-3' : 'gap-2.5', className)}
      {...props}
    >
      {leading}
      <div className="min-w-0">
        <p
          className={cn(
            'truncate font-medium text-secondary-foreground',
            size === 'md'
              ? 'text-sm transition-colors duration-(--motion-duration-fast) group-hover/row:text-foreground-strong'
              : 'text-2xs',
          )}
        >
          {title}
        </p>
        {subtitle ? (
          <div className="mt-0.5 flex min-w-0 items-center gap-2 text-3xs text-subtle-foreground">
            {typeof subtitle === 'string' ? <span className="truncate">{subtitle}</span> : subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The line under a list: a count or summary at the start, paging at the end.
 * It stays at the bottom of the screen while a long list scrolls under it.
 */
export function DataListFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="data-list-footer"
      className={cn(
        'sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background pt-3 pb-3 text-2xs text-subtle-foreground',
        // A filled page already ends at the panel's foot, whose padding does the work
        'md:in-data-[slot=app-shell-fill]:pb-0',
        className,
      )}
      {...props}
    />
  );
}

/** Placeholder rows in the list's own column layout, shown while rows load. */
export function DataListSkeleton({ rows = 4, className }: { rows?: number; className?: string }) {
  const { columns } = useColumns();
  const { messages } = useSkylcn();
  const wide = columns.findIndex((column) => widthAt(column, 'base').includes('fr'));
  return (
    <div
      role="rowgroup"
      aria-busy="true"
      className={cn('divide-y divide-border-subtle', className)}
    >
      <div role="row" className="sr-only">
        <div role="cell">
          <span role="status">{messages.loading}</span>
        </div>
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} aria-hidden className={cn(ROW_GRID, 'px-3 py-2.5')}>
          {columns.map((column, i) => {
            const base = widthAt(column, 'base');
            const narrow = /^\d*\.?\d+rem$/.test(base) && Number.parseFloat(base) <= 2;
            return (
              <div key={column.id} className={columnClass(column)}>
                {column.id === EXPANDER ? null : narrow ? (
                  <Skeleton className="size-1.5 rounded-full" />
                ) : (
                  <Skeleton
                    className={cn('h-3.5', i === wide ? 'w-40 max-w-full' : 'w-16 max-w-full')}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** The empty or error state of a list, in place of its rows. */
export function DataListEmpty(props: StateCardProps) {
  return (
    <div role="rowgroup">
      <div role="row">
        <div role="cell">
          <StateCard className="py-12" {...props} />
        </div>
      </div>
    </div>
  );
}
