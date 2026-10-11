'use client';

import { useId, useState, type ReactNode } from 'react';
import {
  Area,
  AreaChart as AreaPrimitive,
  Bar,
  BarChart as BarPrimitive,
  CartesianGrid,
  Cell,
  Line,
  LineChart as LinePrimitive,
  Pie,
  PieChart as PiePrimitive,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AnimatedNumber } from '../components/motion.js';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';
import { useReducedMotion } from '../lib/use-reduced-motion.js';
import { ChartFrame, type ChartTable, type LegendItem } from './chart-frame.js';

/** One row of chart data: the category or time under `x`, and a value per series key. */
export type ChartDatum = Record<string, string | number | null | undefined>;

/**
 * The series a chart draws, in a fixed order. Colours follow that order through
 * the eight chart tokens, so a series keeps its colour when others are hidden
 * or filtered out; keep one config per chart and never reorder it by value.
 */
export type ChartSeries = Record<string, { label: string; color?: string }>;

type Resolved = LegendItem;

/**
 * A lone series has nothing to be told apart from, so it takes the brand lilac;
 * two or more take the validated chart colours in order.
 */
function resolve(series: ChartSeries): Resolved[] {
  const entries = Object.entries(series);
  return entries.map(([key, value], i) => ({
    key,
    label: value.label,
    color:
      value.color ?? (entries.length === 1 ? 'var(--chart-tone-1)' : `var(--chart-${(i % 8) + 1})`),
  }));
}

function useFormats(formatValue?: (value: number) => string) {
  const { locale } = useSkylcn();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const full = new Intl.NumberFormat(tag);
  const compact = new Intl.NumberFormat(tag, { notation: 'compact', maximumFractionDigits: 1 });
  return {
    value: formatValue ?? ((value: number) => full.format(value)),
    tick: formatValue ?? ((value: number) => compact.format(value)),
  };
}

type CartesianProps = {
  data: readonly ChartDatum[];
  /** The key of the category or time in each row. */
  x: string;
  /** Heads the first column of the table view. */
  xLabel?: string;
  series: ChartSeries;
  title: ReactNode;
  /** Next to the title, such as a TrendBadge. */
  badge?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Draws the card; turn off to set the chart straight into a section or another card. */
  framed?: boolean;
  /** Plot height with its axes; 240 by default. */
  height?: number;
  formatValue?: (value: number) => string;
  formatX?: (value: string | number) => string;
  loading?: boolean;
  /** What the empty state says; "No data to show" by default. */
  emptyMessage?: ReactNode;
  className?: string;
};

function tableOf(
  { data, x, xLabel, formatX }: Pick<CartesianProps, 'data' | 'x' | 'xLabel' | 'formatX'>,
  resolved: Resolved[],
  format: (value: number) => string,
): ChartTable {
  return {
    head: [xLabel ?? '', ...resolved.map((s) => s.label)],
    rows: data.map((row) => [
      formatX ? formatX(row[x] as string | number) : String(row[x] ?? ''),
      ...resolved.map((s) => (typeof row[s.key] === 'number' ? format(row[s.key] as number) : '—')),
    ]),
  };
}

type TooltipCardProps = {
  active?: boolean;
  payload?: readonly { dataKey?: unknown; name?: unknown; value?: unknown }[];
  label?: string | number;
  resolved: Resolved[];
  format: (value: number) => string;
  formatX?: (value: string | number) => string;
};

/** The hover and keyboard readout: every series at that point, values first. */
function TooltipCard({ active, payload, label, resolved, format, formatX }: TooltipCardProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-overlay">
      {label !== undefined ? (
        <p className="mb-1.5 text-muted-foreground">{formatX ? formatX(label) : label}</p>
      ) : null}
      <ul className="flex flex-col gap-1">
        {payload.map((item) => {
          const series =
            resolved.find((s) => s.key === item.dataKey) ??
            resolved.find((s) => s.key === item.name);
          if (!series || typeof item.value !== 'number') return null;
          return (
            <li key={series.key} className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-0.5 w-3 shrink-0 rounded-full"
                style={{ background: series.color }}
              />
              <span className="font-semibold text-foreground tabular-nums">
                {format(item.value)}
              </span>
              <span className="truncate text-muted-foreground">{series.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const TICK = { fill: 'var(--subtle-foreground)', fontSize: 11 };
const TICK_COMPACT = { fill: 'var(--subtle-foreground)', fontSize: 10 };
const MARGIN = { top: 8, right: 12, bottom: 0, left: 4 };

function useMotion() {
  const reduced = useReducedMotion();
  return {
    isAnimationActive: !reduced,
    animationDuration: 450,
    animationEasing: 'ease-out' as const,
  };
}

function chartTitle(title: ReactNode) {
  return typeof title === 'string' ? title : undefined;
}

type SharedProps = CartesianProps & {
  /** A small chart for a card: no value axis or grid, lighter ticks; 120 high by default. */
  compact?: boolean;
};

function frameProps(props: SharedProps, resolved: Resolved[], format: (value: number) => string) {
  return {
    title: props.title,
    badge: props.badge,
    framed: props.framed,
    description: props.description,
    actions: props.actions,
    legend: resolved,
    table: tableOf(props, resolved, format),
    loading: props.loading,
    empty: props.data.length === 0,
    emptyMessage: props.emptyMessage,
    className: props.className,
  };
}

/** Grid, axes and the hover readout shared by area and line charts. */
function timeAxes(props: SharedProps, resolved: Resolved[], format: ReturnType<typeof useFormats>) {
  const compact = props.compact ?? false;
  return [
    compact ? null : <CartesianGrid key="grid" vertical={false} stroke="var(--chart-grid)" />,
    <XAxis
      key="x"
      dataKey={props.x}
      tickLine={false}
      axisLine={compact ? false : { stroke: 'var(--chart-axis)' }}
      tick={compact ? TICK_COMPACT : TICK}
      tickMargin={compact ? 4 : 8}
      minTickGap={16}
      padding={{ left: 8, right: 8 }}
      tickFormatter={props.formatX}
    />,
    <YAxis
      key="y"
      hide={compact}
      tickLine={false}
      axisLine={false}
      tick={TICK}
      width="auto"
      tickFormatter={format.tick}
    />,
    <Tooltip
      key="tooltip"
      isAnimationActive={false}
      cursor={{ stroke: 'var(--chart-axis)', strokeWidth: 1 }}
      content={(tooltip) => (
        <TooltipCard
          active={tooltip.active}
          payload={tooltip.payload}
          label={tooltip.label}
          resolved={resolved}
          format={format.value}
          formatX={props.formatX}
        />
      )}
    />,
  ];
}

const dot = (color: string) => ({
  r: 4,
  fill: color,
  stroke: 'var(--chart-surface)',
  strokeWidth: 2,
});

export type AreaChartProps = SharedProps & {
  /** Stacks the areas so their tops show the running total. */
  stacked?: boolean;
  /** Marks every data point, for short series of a dozen points or fewer. */
  markers?: boolean;
};

/**
 * Change over time as filled areas; best for one to three series. A single
 * series fades from a light wash at its line to nothing at the baseline.
 */
export function AreaChart({ stacked = false, markers = false, ...props }: AreaChartProps) {
  const height = props.height ?? (props.compact ? 120 : 240);
  const resolved = resolve(props.series);
  const format = useFormats(props.formatValue);
  const motion = useMotion();
  const gradient = useId().replace(/:/g, '');
  const single = resolved.length === 1;
  return (
    <ChartFrame {...frameProps(props, resolved, format.value)} height={height} legendShape="rect">
      {(hidden) => (
        <AreaPrimitive
          data={props.data as ChartDatum[]}
          responsive
          style={{ width: '100%', height }}
          margin={props.compact ? { ...MARGIN, left: 0, right: 0 } : MARGIN}
          title={chartTitle(props.title)}
        >
          {single ? (
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: resolved[0]!.color, stopOpacity: 0.28 }} />
                <stop offset="100%" style={{ stopColor: resolved[0]!.color, stopOpacity: 0 }} />
              </linearGradient>
            </defs>
          ) : null}
          {timeAxes(props, resolved, format)}
          {resolved
            .filter((s) => !hidden.has(s.key))
            .map((s) => (
              <Area
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type="monotone"
                stackId={stacked ? 'stack' : undefined}
                stroke={s.color}
                strokeWidth={2}
                fill={single ? `url(#${gradient})` : s.color}
                fillOpacity={single ? 1 : 0.1}
                dot={markers ? dot(s.color) : false}
                activeDot={dot(s.color)}
                {...motion}
              />
            ))}
        </AreaPrimitive>
      )}
    </ChartFrame>
  );
}

export type LineChartProps = SharedProps & {
  /** Marks every data point, for short series of a dozen points or fewer. */
  markers?: boolean;
};

/** Trends of several series over the same time, as 2px lines. */
export function LineChart({ markers = false, ...props }: LineChartProps) {
  const height = props.height ?? (props.compact ? 120 : 240);
  const resolved = resolve(props.series);
  const format = useFormats(props.formatValue);
  const motion = useMotion();
  return (
    <ChartFrame {...frameProps(props, resolved, format.value)} height={height} legendShape="line">
      {(hidden) => (
        <LinePrimitive
          data={props.data as ChartDatum[]}
          responsive
          style={{ width: '100%', height }}
          margin={props.compact ? { ...MARGIN, left: 0, right: 0 } : MARGIN}
          title={chartTitle(props.title)}
        >
          {timeAxes(props, resolved, format)}
          {resolved
            .filter((s) => !hidden.has(s.key))
            .map((s) => (
              <Line
                key={s.key}
                dataKey={s.key}
                name={s.label}
                type="monotone"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={markers ? dot(s.color) : false}
                activeDot={dot(s.color)}
                {...motion}
              />
            ))}
        </LinePrimitive>
      )}
    </ChartFrame>
  );
}

export type BarChartProps = SharedProps & {
  /** Stacks each category's series into one bar, parted by 2px gaps. */
  stacked?: boolean;
  /** `horizontal` lays bars sideways, for many or long category names. */
  orientation?: 'vertical' | 'horizontal';
};

/** Magnitudes side by side: columns by default, bars sideways for long names. */
export function BarChart({ stacked = false, orientation = 'vertical', ...props }: BarChartProps) {
  const height = props.height ?? (props.compact ? 120 : 240);
  const resolved = resolve(props.series);
  const format = useFormats(props.formatValue);
  const motion = useMotion();
  const sideways = orientation === 'horizontal';
  const compact = props.compact ?? false;
  const [pointed, setPointed] = useState<number | null>(null);
  return (
    <ChartFrame {...frameProps(props, resolved, format.value)} height={height} legendShape="rect">
      {(hidden) => {
        const shown = resolved.filter((s) => !hidden.has(s.key));
        // With one series the pointed bar comes forward and the rest step back.
        const spotlight = shown.length === 1 && !stacked;
        const categoryAxis = {
          dataKey: props.x,
          type: 'category' as const,
          tickLine: false,
          tick: compact ? TICK_COMPACT : TICK,
          tickFormatter: props.formatX,
        };
        const valueAxis = {
          type: 'number' as const,
          hide: compact,
          tickLine: false,
          axisLine: false,
          tick: TICK,
          tickFormatter: format.tick,
        };
        return (
          <BarPrimitive
            data={props.data as ChartDatum[]}
            layout={sideways ? 'vertical' : 'horizontal'}
            responsive
            style={{ width: '100%', height }}
            margin={compact ? { ...MARGIN, left: 0, right: 0 } : MARGIN}
            barGap={2}
            barCategoryGap="24%"
            title={chartTitle(props.title)}
            onMouseMove={(state) =>
              setPointed(
                typeof state.activeTooltipIndex === 'number' ? state.activeTooltipIndex : null,
              )
            }
            onMouseLeave={() => setPointed(null)}
          >
            {compact ? null : (
              <CartesianGrid
                vertical={sideways}
                horizontal={!sideways}
                stroke="var(--chart-grid)"
              />
            )}
            {sideways ? (
              <>
                <XAxis {...valueAxis} />
                <YAxis {...categoryAxis} axisLine={{ stroke: 'var(--chart-axis)' }} width="auto" />
              </>
            ) : (
              <>
                <XAxis
                  {...categoryAxis}
                  axisLine={compact ? false : { stroke: 'var(--chart-axis)' }}
                  tickMargin={compact ? 4 : 8}
                  minTickGap={8}
                />
                <YAxis {...valueAxis} width="auto" />
              </>
            )}
            <Tooltip
              isAnimationActive={false}
              cursor={{ fill: 'var(--accent)' }}
              content={(tooltip) => (
                <TooltipCard
                  active={tooltip.active}
                  payload={tooltip.payload}
                  label={tooltip.label}
                  resolved={resolved}
                  format={format.value}
                  formatX={props.formatX}
                />
              )}
            />
            {shown.map((s, i) => {
              // Only the outer end of a bar is rounded; a stack rounds its last segment.
              const rounded = !stacked || i === shown.length - 1;
              const radius: [number, number, number, number] = !rounded
                ? [0, 0, 0, 0]
                : sideways
                  ? [0, 4, 4, 0]
                  : [4, 4, 0, 0];
              return (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={s.color}
                  maxBarSize={compact ? 40 : 28}
                  radius={radius}
                  stackId={stacked ? 'stack' : undefined}
                  stroke={stacked ? 'var(--chart-surface)' : undefined}
                  strokeWidth={stacked ? 2 : 0}
                  activeBar={spotlight ? false : { fillOpacity: 0.85 }}
                  {...motion}
                >
                  {spotlight
                    ? props.data.map((_, index) => (
                        <Cell
                          key={index}
                          fill={s.color}
                          fillOpacity={pointed === null || pointed === index ? 1 : 0.35}
                          className="transition-[fill-opacity] duration-(--motion-duration-fast)"
                        />
                      ))
                    : null}
                </Bar>
              );
            })}
          </BarPrimitive>
        );
      }}
    </ChartFrame>
  );
}

export type DonutSlice = { key: string; label: string; value: number };

export type DonutChartProps = {
  /** Up to six slices in a fixed order; the rest are folded into "Other". */
  data: readonly DonutSlice[];
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** The figure in the hole; the total by default. */
  centerLabel?: ReactNode;
  /** The ring's size; the list sits beside it, or below when there is no room. */
  height?: number;
  /**
   * `tones`, the default, draws the slices in one lilac family, for the parts of a single
   * answer; `categorical` uses the eight distinct chart colours, for unrelated groups.
   */
  palette?: 'tones' | 'categorical';
  formatValue?: (value: number) => string;
  loading?: boolean;
  /** What the empty state says, shown when every slice is zero; "No data to show" by default. */
  emptyMessage?: ReactNode;
  /** Draws the card; turn off to set the chart straight into a section or another card. */
  framed?: boolean;
  className?: string;
};

const MAX_SLICES = 6;

/**
 * Part of a whole at a glance, for up to six parts; compare close values with bars instead.
 * The list beside the ring carries every value, hides a slice when pressed, and pointing at
 * a slice or a row brings that part forward and writes its share in the hole.
 */
export function DonutChart({ height = 200, palette = 'tones', ...props }: DonutChartProps) {
  const { messages, locale } = useSkylcn();
  const format = useFormats(props.formatValue);
  const motion = useMotion();
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
  const [focus, setFocus] = useState<string | null>(null);

  const kept = props.data.slice(0, MAX_SLICES - (props.data.length > MAX_SLICES ? 1 : 0));
  const rest = props.data.slice(kept.length);
  const colour = (i: number) =>
    palette === 'categorical' ? `var(--chart-${i + 1})` : `var(--chart-tone-${(i % 5) + 1})`;
  const slices: Resolved[] = kept.map((slice, i) => ({
    key: slice.key,
    label: slice.label,
    color: colour(i),
  }));
  const values = new Map(kept.map((slice) => [slice.key, slice.value]));
  if (rest.length) {
    slices.push({ key: '__other', label: messages.other, color: 'var(--subtle-foreground)' });
    values.set(
      '__other',
      rest.reduce((sum, slice) => sum + slice.value, 0),
    );
  }
  const value = (key: string) => values.get(key) ?? 0;
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const share = (part: number, whole: number) => {
    const pct = whole ? (part / whole) * 100 : 0;
    const text = pct.toLocaleString(tag, { maximumFractionDigits: 1 });
    return locale === 'tr' ? `%${text}` : `${text}%`;
  };
  const total = [...values.values()].reduce((sum, v) => sum + v, 0);

  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      // At least one slice stays on, so the ring never goes blank.
      else if (slices.length - prev.size > 1) next.add(key);
      return next;
    });

  return (
    <ChartFrame
      title={props.title}
      description={props.description}
      actions={props.actions}
      height={height}
      legend={[]}
      legendShape="rect"
      table={{
        head: ['', messages.total, '%'],
        rows: slices.map((slice) => [
          slice.label,
          format.value(value(slice.key)),
          share(value(slice.key), total),
        ]),
      }}
      loading={props.loading}
      empty={props.data.every((slice) => slice.value <= 0)}
      emptyMessage={props.emptyMessage}
      framed={props.framed}
      className={props.className}
    >
      {() => {
        const shown = slices.filter((slice) => !hidden.has(slice.key));
        const shownTotal = shown.reduce((sum, slice) => sum + value(slice.key), 0);
        const focused = focus && !hidden.has(focus) ? focus : null;
        const lit = (key: string) => focused === null || focused === key;
        return (
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-2">
            <div className="relative shrink-0" style={{ width: height, height }}>
              <PiePrimitive
                responsive
                style={{ width: height, height }}
                title={chartTitle(props.title)}
              >
                <Pie
                  data={shown.map((slice) => ({ ...slice, value: value(slice.key) }))}
                  dataKey="value"
                  nameKey="key"
                  innerRadius="62%"
                  outerRadius="92%"
                  paddingAngle={shown.length > 1 ? 2 : 0}
                  cornerRadius={3}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                  onMouseEnter={(_, index) => setFocus(shown[index]?.key ?? null)}
                  onMouseLeave={() => setFocus(null)}
                  {...motion}
                >
                  {shown.map((slice) => (
                    <Cell
                      key={slice.key}
                      fill={slice.color}
                      fillOpacity={lit(slice.key) ? 1 : 0.3}
                      className="transition-[fill-opacity] duration-(--motion-duration-fast)"
                    />
                  ))}
                </Pie>
              </PiePrimitive>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="max-w-[56%] text-center">
                  <p className="text-xl font-semibold text-foreground tabular-nums">
                    {focused
                      ? share(value(focused), shownTotal)
                      : (props.centerLabel ?? (
                          <AnimatedNumber value={shownTotal} format={format.value} />
                        ))}
                  </p>
                  <p className="truncate text-3xs tracking-label text-subtle-foreground uppercase">
                    {focused
                      ? slices.find((slice) => slice.key === focused)?.label
                      : messages.total}
                  </p>
                </div>
              </div>
            </div>
            <ul className="flex w-full max-w-72 min-w-44 flex-1 flex-col gap-0.5">
              {slices.map((slice) => {
                const off = hidden.has(slice.key);
                return (
                  <li key={slice.key}>
                    <button
                      type="button"
                      aria-pressed={!off}
                      title={messages.toggleSeries(slice.label)}
                      onClick={() => toggle(slice.key)}
                      onMouseEnter={() => setFocus(slice.key)}
                      onMouseLeave={() => setFocus(null)}
                      onFocus={() => setFocus(slice.key)}
                      onBlur={() => setFocus(null)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-xs outline-hidden',
                        'transition-[background-color,opacity] duration-(--motion-duration-fast)',
                        'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
                        off ? 'opacity-45' : lit(slice.key) ? 'opacity-100' : 'opacity-55',
                      )}
                    >
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-xs"
                        style={{ background: slice.color }}
                      />
                      <span
                        className={cn(
                          'min-w-0 flex-1 truncate text-secondary-foreground',
                          off && 'line-through decoration-subtle-foreground/60',
                        )}
                      >
                        {slice.label}
                      </span>
                      <span className="shrink-0 text-2xs text-subtle-foreground tabular-nums">
                        <span className="text-foreground">{format.value(value(slice.key))}</span>
                        {' · '}
                        {share(value(slice.key), total)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    </ChartFrame>
  );
}
