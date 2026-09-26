'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  createContext,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { Skeleton } from './skeleton.js';
import { StateCard, type StateCardProps } from './state-card.js';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
const BREAKPOINTS = ['base', 'sm', 'md', 'lg', 'xl'] as const;
const RANK: Record<(typeof BREAKPOINTS)[number], number> = { base: 0, sm: 1, md: 2, lg: 3, xl: 4 };

// Static so Tailwind sees them; a column shown from a breakpoint hides below it.
const SHOW_FROM: Record<Breakpoint, string> = {
  sm: 'hidden sm:flex',
  md: 'hidden md:flex',
  lg: 'hidden lg:flex',
  xl: 'hidden xl:flex',
};
const JUSTIFY = { start: 'justify-start', center: 'justify-center', end: 'justify-end' } as const;
const STAGGER_CAP = 8;

export type DataListColumn = {
  id: string;
  /** A CSS grid track, such as `1.5rem`, `minmax(0,1fr)` or `7rem`. */
  width: string;
  /** The column appears from this breakpoint up. */
  from?: Breakpoint;
  align?: keyof typeof JUSTIFY;
};

export type DataListSort = { field: string; direction: 'asc' | 'desc' };

type DataListContextValue = {
  columns: readonly DataListColumn[];
  sort?: DataListSort;
  onSortChange?: (field: string) => void;
};

const DataListContext = createContext<DataListContextValue | null>(null);

function useDataList() {
  const context = useContext(DataListContext);
  if (!context) throw new Error('DataList parts must be used inside <DataList>.');
  return context;
}

function tracksAt(columns: readonly DataListColumn[], bp: (typeof BREAKPOINTS)[number]) {
  return columns
    .filter((column) => !column.from || RANK[column.from] <= RANK[bp])
    .map((column) => column.width)
    .join(' ');
}

const ROW_GRID =
  'grid items-center gap-3 grid-cols-(--dl-base) sm:grid-cols-(--dl-sm) md:grid-cols-(--dl-md) lg:grid-cols-(--dl-lg) xl:grid-cols-(--dl-xl)';

export type DataListProps = Omit<ComponentProps<'div'>, 'children'> & {
  columns: readonly DataListColumn[];
  /** The current sort, read by sortable column headers. */
  sort?: DataListSort;
  /** Called with a column id when its header is pressed. */
  onSortChange?: (field: string) => void;
  children: ReactNode;
};

/** A table-like list whose columns collapse by breakpoint, with sortable headers and linkable rows. */
export function DataList({
  columns,
  sort,
  onSortChange,
  className,
  style,
  children,
  ...props
}: DataListProps) {
  const vars = Object.fromEntries(
    BREAKPOINTS.map((bp) => [`--dl-${bp}`, tracksAt(columns, bp)]),
  ) as CSSProperties;
  return (
    <DataListContext.Provider value={{ columns, sort, onSortChange }}>
      <div
        data-slot="data-list"
        role="table"
        className={cn('min-w-0', className)}
        style={{ ...vars, ...style }}
        {...props}
      >
        {children}
      </div>
    </DataListContext.Provider>
  );
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
        'sticky top-0 z-20 border-b border-border bg-background px-3 pb-2',
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
  children?: ReactNode;
};

const COLUMN_LABEL = 'text-3xs font-medium tracking-label text-faint-foreground uppercase';

export function DataListColumnHeader({
  column,
  sortable = false,
  className,
  children,
  ...props
}: DataListColumnHeaderProps) {
  const { columns, sort, onSortChange } = useDataList();
  const { messages } = useSkylcn();
  const def = columns.find((c) => c.id === column);
  const active = sort?.field === column;

  if (!sortable || !onSortChange) {
    return (
      <div role="columnheader" className={cn(columnClass(def), COLUMN_LABEL, className)} {...props}>
        {children}
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
        title={typeof children === 'string' ? messages.sortBy(children) : undefined}
        className={cn(
          COLUMN_LABEL,
          'group/sort inline-flex min-w-0 items-center gap-1 rounded outline-none',
          'transition-colors duration-(--motion-duration-fast) hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-ring',
          active && 'text-secondary-foreground',
        )}
      >
        {children ? <span className="truncate">{children}</span> : null}
        {active ? (
          sort!.direction === 'asc' ? (
            <ArrowUp className="size-2.75 shrink-0 text-skylab-300" strokeWidth={2} />
          ) : (
            <ArrowDown className="size-2.75 shrink-0 text-skylab-300" strokeWidth={2} />
          )
        ) : (
          <span className="size-1 shrink-0 rounded-full bg-faint-foreground transition-colors group-hover/sort:bg-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export function DataListBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="data-list-body"
      role="rowgroup"
      className={cn('divide-y divide-border-subtle', className)}
      {...props}
    />
  );
}

export type DataListRowProps = Omit<ComponentProps<'div'>, 'onSelect'> & {
  /** Makes the whole row a link. Interactive cells stay pressable on their own. */
  href?: string;
  /** Makes the whole row a button. */
  onSelect?: () => void;
  /** The accessible name of the row link or button. */
  label?: string;
  selected?: boolean;
  /** Position in the list; staggers the entrance of the first rows. */
  index?: number;
};

export function DataListRow({
  href,
  onSelect,
  label,
  selected = false,
  index,
  className,
  style,
  children,
  ...props
}: DataListRowProps) {
  const { Link } = useSkylcn();
  const overlay =
    'absolute inset-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';
  return (
    <div
      data-slot="data-list-row"
      role="row"
      aria-selected={selected || undefined}
      className={cn(
        ROW_GRID,
        'group/row relative px-3 py-2.5 transition-colors duration-(--motion-duration-fast)',
        (href || onSelect) && 'hover:bg-card',
        selected && 'bg-skylab-500/5',
        index !== undefined &&
          'animate-in duration-(--motion-duration-base) ease-enter fade-in-0 slide-in-from-bottom-1',
        className,
      )}
      style={
        index !== undefined
          ? {
              animationDelay: `calc(var(--motion-stagger) * ${Math.min(index, STAGGER_CAP)})`,
              animationFillMode: 'backwards',
              ...style,
            }
          : style
      }
      {...props}
    >
      {href ? (
        <Link href={href} className={overlay}>
          <span className="sr-only">{label}</span>
        </Link>
      ) : onSelect ? (
        <button type="button" onClick={onSelect} aria-label={label} className={overlay} />
      ) : null}
      {children}
    </div>
  );
}

export type DataListCellProps = ComponentProps<'div'> & {
  column: string;
  /** Lifts the cell above the row link so its own buttons and links can be pressed. */
  interactive?: boolean;
};

export function DataListCell({
  column,
  interactive = false,
  className,
  ...props
}: DataListCellProps) {
  const { columns } = useDataList();
  return (
    <div
      role="cell"
      className={cn(
        columnClass(columns.find((c) => c.id === column)),
        interactive && 'relative z-10',
        className,
      )}
      {...props}
    />
  );
}

/** Placeholder rows in the list's own column layout, shown while rows load. */
export function DataListSkeleton({ rows = 4, className }: { rows?: number; className?: string }) {
  const { columns } = useDataList();
  const { messages } = useSkylcn();
  return (
    <div
      role="status"
      aria-label={messages.loading}
      className={cn('divide-y divide-border-subtle', className)}
    >
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className={cn(ROW_GRID, 'px-3 py-2.5')}>
          {columns.map((column, i) => {
            const narrow =
              /^\d*\.?\d+rem$/.test(column.width) && Number.parseFloat(column.width) <= 2;
            return (
              <div key={column.id} className={columnClass(column)}>
                {narrow ? (
                  <Skeleton className="size-1.5 rounded-full" />
                ) : (
                  <Skeleton
                    className={cn('h-3.5', i === 1 ? 'w-40 max-w-full' : 'w-16 max-w-full')}
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
  return <StateCard className="py-12" {...props} />;
}
