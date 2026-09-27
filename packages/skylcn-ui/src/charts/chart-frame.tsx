'use client';

import { ChartColumn, Table2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '../components/button.js';
import { IconSwap } from '../components/icon-swap.js';
import { Skeleton } from '../components/skeleton.js';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export type LegendItem = {
  key: string;
  label: string;
  color: string;
  /** A figure after the label, such as a slice's share. */
  detail?: string;
};

export type ChartTable = {
  head: readonly ReactNode[];
  rows: readonly (readonly ReactNode[])[];
};

export type ChartFrameProps = {
  title: ReactNode;
  /** Next to the title, such as a TrendBadge. */
  badge?: ReactNode;
  description?: ReactNode;
  /** Controls at the end of the title row, such as a menu. */
  actions?: ReactNode;
  /** Height of the plot, axis labels included. */
  height: number;
  /** Series or segments; a legend shows once there are two or more. */
  legend: readonly LegendItem[];
  /** Rectangles for bars, areas and slices; short strokes for lines. */
  legendShape: 'rect' | 'line';
  /** The same values as a table, the chart's accessible twin. */
  table: ChartTable;
  /** While data reloads the last render stays, dimmed, instead of a skeleton. */
  loading?: boolean;
  empty?: boolean;
  /** Draws the card; turn off to set the chart straight into a section or another card. */
  framed?: boolean;
  className?: string;
  /** Draws the plot for the series the reader has not hidden. */
  children: (hidden: ReadonlySet<string>) => ReactNode;
};

/**
 * The card every chart sits in: title, a legend whose entries hide and show
 * their series, a switch to the table view, and the loading and empty states.
 */
export function ChartFrame({
  title,
  badge,
  description,
  actions,
  height,
  legend,
  legendShape,
  table,
  loading = false,
  empty = false,
  framed = true,
  className,
  children,
}: ChartFrameProps) {
  const { messages } = useSkylcn();
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const [asTable, setAsTable] = useState(false);

  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      // At least one series stays on, so the plot never goes blank.
      else if (legend.length - prev.size > 1) next.add(key);
      return next;
    });

  return (
    <figure
      data-slot="chart"
      className={cn(
        'm-0 flex min-w-0 flex-col',
        framed && 'rounded-xl border border-border bg-chart-surface',
        className,
      )}
    >
      <figcaption className={cn('flex items-start gap-3', framed && 'px-4 pt-4')}>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
            {badge ? <span className="shrink-0">{badge}</span> : null}
          </div>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-pressed={asTable}
          aria-label={asTable ? messages.showChart : messages.showTable}
          title={asTable ? messages.showChart : messages.showTable}
          onClick={() => setAsTable((value) => !value)}
        >
          <IconSwap swapped={asTable} icon={Table2} swappedIcon={ChartColumn} className="size-4" />
        </Button>
      </figcaption>

      {legend.length > 1 && !asTable ? (
        <ul className={cn('flex flex-wrap gap-x-1 gap-y-0.5 pt-2', framed ? 'px-3' : '-mx-1.5')}>
          {legend.map((item) => {
            const off = hidden.has(item.key);
            return (
              <li key={item.key}>
                <button
                  type="button"
                  aria-pressed={!off}
                  title={messages.toggleSeries(item.label)}
                  onClick={() => toggle(item.key)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs outline-hidden transition-[color,opacity] duration-(--motion-duration-fast)',
                    'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
                    off ? 'text-subtle-foreground opacity-60' : 'text-secondary-foreground',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'shrink-0 transition-opacity',
                      legendShape === 'rect' ? 'size-2.5 rounded-xs' : 'h-0.5 w-3 rounded-full',
                      off && 'opacity-30',
                    )}
                    style={{ background: item.color }}
                  />
                  <span className={cn(off && 'line-through decoration-subtle-foreground/60')}>
                    {item.label}
                  </span>
                  {item.detail ? (
                    <span className="text-subtle-foreground tabular-nums">{item.detail}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className={cn('min-w-0 pt-2', framed && 'px-2 pb-3')}>
        {empty && loading ? (
          <Skeleton className="mx-2 rounded-lg" style={{ height: height - 8 }} />
        ) : empty ? (
          <p className="grid place-items-center text-xs text-muted-foreground" style={{ height }}>
            {messages.noData}
          </p>
        ) : asTable ? (
          <div className="scrollbar overflow-auto px-2" style={{ maxHeight: height }}>
            <table className="w-full border-collapse text-xs">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr className="border-b border-border">
                  {table.head.map((cell, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={cn(
                        'sticky top-0 bg-chart-surface py-2 font-medium text-subtle-foreground',
                        i === 0 ? 'pr-3 text-left' : 'px-3 text-right',
                      )}
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {table.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th
                          key={i}
                          scope="row"
                          className="py-1.5 pr-3 text-left font-normal text-secondary-foreground"
                        >
                          {cell}
                        </th>
                      ) : (
                        <td key={i} className="px-3 py-1.5 text-right text-foreground tabular-nums">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            aria-busy={loading || undefined}
            className={cn(
              'transition-opacity duration-(--motion-duration-base) [&_text]:tabular-nums',
              '[&_.recharts-surface]:rounded-md [&_.recharts-surface]:outline-hidden [&_.recharts-surface:focus-visible]:ring-2 [&_.recharts-surface:focus-visible]:ring-ring',
              loading && 'opacity-50',
            )}
          >
            {children(hidden)}
          </div>
        )}
      </div>
    </figure>
  );
}
