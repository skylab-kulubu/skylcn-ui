'use client';

import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
  type RowData,
} from '@tanstack/react-table';
import { ArrowUp, Columns3, Filter, X } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Button } from '../components/button.js';
import { Checkbox } from '../components/checkbox.js';
import { BulkBar } from '../components/display-extra.js';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../components/drawer.js';
import { Kbd } from '../components/feedback.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MenuCheckboxItem,
  MenuGroup,
} from '../components/menu.js';
import { SearchInput } from '../components/page-header.js';
import { Pagination } from '../components/pagination.js';
import { StateCard } from '../components/state-card.js';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  columnVisibilityFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
const SHOW_FROM: Record<Breakpoint, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
};

export type DataTableColumn<T extends RowData> = {
  id: string;
  header: string;
  /** The value used for sorting, searching and facet counts. */
  value: (row: T) => string | number;
  /** How the cell looks; the value as text by default. */
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  /** The column appears from this breakpoint up. */
  from?: Breakpoint;
  align?: 'start' | 'end';
  /** Can be switched off from the columns menu; true by default. */
  hideable?: boolean;
};

export type DataTableFacet = {
  column: string;
  label: string;
  /** Turns a raw value into its label, such as "active" into "Aktif". */
  format?: (value: string) => string;
};

export type DataTableProps<T extends RowData> = {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowId: (row: T) => string;
  /** Columns offered as checkbox filters with counts, beside the table. */
  facets?: readonly DataTableFacet[];
  searchPlaceholder?: string;
  /** Adds row checkboxes and a bar of actions for the picked rows. */
  bulkActions?: (rows: T[], clear: () => void) => ReactNode;
  /** Opens a row in a side panel, stepping through rows with ↑ and ↓. */
  renderDetail?: (row: T) => ReactNode;
  detailTitle?: (row: T) => ReactNode;
  pageSize?: number;
  /** Controls at the end of the toolbar, such as an add button. */
  actions?: ReactNode;
  /**
   * Keeps search, filters, sort and page in the address under this prefix,
   * so a shared link or the back button brings the same view back.
   */
  urlKey?: string;
  'aria-label': string;
  className?: string;
};

const EMPTY: never[] = [];

/**
 * An admin table for long lists: search, checkbox filters with live counts,
 * sortable and hideable columns, row selection with bulk actions, paging, and
 * a side panel that walks the rows with ↑ and ↓.
 */
export function DataTable<T extends RowData>({
  data,
  columns,
  getRowId,
  facets = EMPTY,
  searchPlaceholder,
  bulkActions,
  renderDetail,
  detailTitle,
  pageSize = 10,
  actions,
  urlKey,
  'aria-label': label,
  className,
}: DataTableProps<T>) {
  const { messages } = useSkylcn();
  const selectable = Boolean(bulkActions);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const tableColumns = useMemo(() => {
    const helper = createColumnHelper<typeof features, T>();
    const defs = columns.map((column) =>
      helper.accessor((row: T) => column.value(row), {
        id: column.id,
        header: column.header,
        enableSorting: column.sortable ?? false,
        enableHiding: column.hideable ?? true,
        sortFn: 'alphanumeric',
        filterFn: (row, columnId, filter: string[]) =>
          !filter?.length || filter.includes(String(row.getValue(columnId))),
      }),
    );
    return helper.columns(defs);
  }, [columns]);

  const table = useTable(
    {
      features,
      columns: tableColumns,
      data: data as T[],
      getRowId,
      globalFilterFn: 'includesString',
      initialState: { pagination: { pageIndex: 0, pageSize } },
      enableRowSelection: selectable,
    },
    (state) => state,
  );

  const byId = useMemo(() => new Map(columns.map((column) => [column.id, column])), [columns]);
  const ordered = table.getPrePaginatedRowModel().rows;
  const pageRows = table.getRowModel().rows;
  const openIndex = ordered.findIndex((row) => row.id === openId);
  const openRow = openIndex >= 0 ? ordered[openIndex]!.original : null;
  const selected = table.getSelectedRowModel().rows.map((row) => row.original);
  const activeFilters = table.state.columnFilters.reduce(
    (sum, filter) => sum + ((filter.value as string[] | undefined)?.length ?? 0),
    0,
  );

  // Read the view from the address once mounted, so server and first client render agree
  const [urlReady, setUrlReady] = useState(!urlKey);
  useEffect(() => {
    if (!urlKey) return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get(`${urlKey}.q`);
    if (q) table.setGlobalFilter(q);
    const sort = params.get(`${urlKey}.sort`);
    if (sort) {
      const [id, dir] = sort.split(':');
      if (id) table.setSorting([{ id, desc: dir === 'desc' }]);
    }
    const filters = [...params.entries()]
      .filter(([key]) => key.startsWith(`${urlKey}.f.`))
      .map(([key, value]) => ({ id: key.slice(`${urlKey}.f.`.length), value: value.split(',') }));
    if (filters.length) table.setColumnFilters(filters);
    const page = Number(params.get(`${urlKey}.page`));
    if (page > 1) table.setPageIndex(page - 1);
    setUrlReady(true);
    // Only on mount: later changes flow the other way
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  const { globalFilter, sorting, columnFilters, pagination } = table.state;
  useEffect(() => {
    if (!urlKey || !urlReady) return;
    const params = new URLSearchParams(window.location.search);
    for (const key of [...params.keys()]) if (key.startsWith(`${urlKey}.`)) params.delete(key);
    if (globalFilter) params.set(`${urlKey}.q`, String(globalFilter));
    if (sorting[0])
      params.set(`${urlKey}.sort`, `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`);
    for (const filter of columnFilters) {
      const value = filter.value as string[] | undefined;
      if (value?.length) params.set(`${urlKey}.f.${filter.id}`, value.join(','));
    }
    if (pagination.pageIndex > 0) params.set(`${urlKey}.page`, String(pagination.pageIndex + 1));
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, '', url);
    }
  }, [urlKey, urlReady, globalFilter, sorting, columnFilters, pagination.pageIndex]);

  // ↑ and ↓ walk the rows while the side panel is open, outside text fields
  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const step =
        event.key === 'ArrowDown' || event.key === 'j'
          ? 1
          : event.key === 'ArrowUp' || event.key === 'k'
            ? -1
            : 0;
      if (!step) return;
      const next = ordered[openIndex + step];
      if (next) {
        event.preventDefault();
        setOpenId(next.id);
      }
    };
    // Capture: the panel's own key handling would otherwise swallow the arrows
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [openId, openIndex, ordered]);

  const facetPanel = facets.length ? (
    <div className="flex flex-col gap-5">
      {facets.map((facet) => {
        const column = table.getColumn(facet.column);
        if (!column) return null;
        const counts = column.getFacetedUniqueValues();
        const value = (column.getFilterValue() as string[] | undefined) ?? [];
        const options = [...counts.keys()].map(String).sort((a, b) => a.localeCompare(b, 'tr'));
        return (
          <fieldset key={facet.column} className="flex flex-col gap-1.5">
            <legend className="mb-1 text-3xs font-medium tracking-label text-subtle-foreground uppercase">
              {facet.label}
            </legend>
            {options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm text-secondary-foreground hover:bg-accent"
              >
                <Checkbox
                  checked={value.includes(option)}
                  onCheckedChange={(on) =>
                    column.setFilterValue(
                      on ? [...value, option] : value.filter((v) => v !== option),
                    )
                  }
                />
                <span className="min-w-0 flex-1 truncate">
                  {facet.format ? facet.format(option) : option}
                </span>
                <span className="text-2xs text-subtle-foreground tabular-nums">
                  {counts.get(option) ?? 0}
                </span>
              </label>
            ))}
          </fieldset>
        );
      })}
      {activeFilters ? (
        <Button
          size="sm"
          variant="ghost"
          className="self-start"
          onClick={() => table.resetColumnFilters()}
        >
          <X /> {messages.clearFilters}
        </Button>
      ) : null}
    </div>
  ) : null;

  const total = ordered.length;
  const { pageIndex } = table.state.pagination;

  return (
    <div
      data-slot="data-table"
      className={cn(
        'flex flex-col gap-4 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-8',
        !facets.length && 'lg:grid-cols-1',
        className,
      )}
    >
      {facetPanel ? (
        <aside aria-label={messages.filters} className="sticky top-6 hidden lg:block">
          {facetPanel}
        </aside>
      ) : null}

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-0 flex-1">
            <SearchInput
              value={(table.state.globalFilter as string) ?? ''}
              onValueChange={(value) => table.setGlobalFilter(value)}
              placeholder={searchPlaceholder}
              className="max-w-sm"
            />
          </div>
          {facetPanel ? (
            <Button className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <Filter /> {messages.filters}
              {activeFilters ? (
                <span className="text-skylab-300 tabular-nums">{activeFilters}</span>
              ) : null}
            </Button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" />}>
              <Columns3 /> <span className="hidden sm:inline">{messages.columns}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <MenuGroup label={messages.columns}>
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <MenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(on) => column.toggleVisibility(on)}
                      closeOnClick={false}
                    >
                      {byId.get(column.id)?.header ?? column.id}
                    </MenuCheckboxItem>
                  ))}
              </MenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {actions}
        </div>

        <div className="scrollbar overflow-x-auto rounded-xl border border-border">
          <table aria-label={label} className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id} className="border-b border-border">
                  {selectable ? (
                    <th scope="col" className="w-10 px-3 py-2">
                      <Checkbox
                        aria-label={messages.selectAll}
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={
                          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
                        }
                        onCheckedChange={(on) => table.toggleAllPageRowsSelected(on)}
                      />
                    </th>
                  ) : null}
                  {group.headers.map((header) => {
                    const def = byId.get(header.column.id);
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={
                          sorted === 'asc'
                            ? 'ascending'
                            : sorted === 'desc'
                              ? 'descending'
                              : undefined
                        }
                        className={cn(
                          'px-3 py-2 text-left text-3xs font-medium tracking-label whitespace-nowrap text-subtle-foreground uppercase',
                          def?.from && SHOW_FROM[def.from],
                          def?.align === 'end' && 'text-right',
                        )}
                      >
                        {header.column.getCanSort() ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline-flex items-center gap-1 rounded uppercase outline-hidden hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {def?.header}
                            <ArrowUp
                              aria-hidden
                              className={cn(
                                'size-3 transition-[rotate,opacity] duration-(--motion-duration-base)',
                                sorted ? 'text-skylab-300 opacity-100' : 'opacity-0',
                                sorted === 'desc' && 'rotate-180',
                              )}
                            />
                          </button>
                        ) : (
                          def?.header
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {pageRows.map((row) => (
                <tr
                  key={row.id}
                  aria-selected={selectable ? row.getIsSelected() : undefined}
                  className={cn(
                    'transition-colors duration-(--motion-duration-instant)',
                    renderDetail && 'cursor-pointer hover:bg-card',
                    row.getIsSelected() && 'bg-skylab-500/5',
                    row.id === openId && 'bg-accent',
                  )}
                  onClick={(event) => {
                    if (!renderDetail) return;
                    if (
                      (event.target as HTMLElement).closest(
                        'button, a, input, label, [role="checkbox"]',
                      )
                    )
                      return;
                    setOpenId(row.id);
                  }}
                >
                  {selectable ? (
                    <td className="w-10 px-3 py-2.5">
                      <Checkbox
                        aria-label={messages.selectRow}
                        checked={row.getIsSelected()}
                        onCheckedChange={(on) => row.toggleSelected(on)}
                      />
                    </td>
                  ) : null}
                  {row.getVisibleCells().map((cell) => {
                    const def = byId.get(cell.column.id);
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'px-3 py-2.5 text-secondary-foreground',
                          def?.from && SHOW_FROM[def.from],
                          def?.align === 'end' && 'text-right tabular-nums',
                        )}
                      >
                        {def?.cell ? def.cell(row.original) : String(cell.getValue() ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {pageRows.length === 0 ? (
            <StateCard title={messages.noResults} className="py-12" />
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-2xs text-subtle-foreground tabular-nums">
            {total
              ? `${pageIndex * pageSize + 1}–${Math.min(total, (pageIndex + 1) * pageSize)} / ${total}`
              : '0'}
            {renderDetail ? (
              <span className="ml-3 hidden items-center gap-1 sm:inline-flex">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> {messages.stepRows}
              </span>
            ) : null}
          </p>
          <Pagination
            current={pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        </div>
      </div>

      {facetPanel ? (
        <Drawer side="bottom" open={filtersOpen} onOpenChange={setFiltersOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{messages.filters}</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>{facetPanel}</DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : null}

      {renderDetail ? (
        <Drawer open={openRow !== null} onOpenChange={(open) => !open && setOpenId(null)}>
          <DrawerContent>
            {openRow ? (
              <>
                <DrawerHeader>
                  <DrawerTitle>{detailTitle ? detailTitle(openRow) : ''}</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>{renderDetail(openRow)}</DrawerBody>
              </>
            ) : null}
          </DrawerContent>
        </Drawer>
      ) : null}

      {bulkActions ? (
        <BulkBar count={selected.length} onClear={() => table.resetRowSelection(true)}>
          {bulkActions(selected, () => table.resetRowSelection(true))}
        </BulkBar>
      ) : null}
    </div>
  );
}
