import { cn } from '../lib/cn.js';

const WIDTH = 100;
const HEIGHT = 32;
const PAD = 3;

export type SparklineProps = {
  /** The figures in time order; the last one is the current period. */
  values: readonly number[];
  className?: string;
};

/**
 * A small trend line without axes, for stat cards: the history in a quiet
 * grey and the current period marked in the brand colour. Decorative, so the
 * figure it sits beside must say the value.
 */
export function Sparkline({ values, className }: SparklineProps) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const points = values.map((value, i) => [
    PAD + (i / (values.length - 1)) * (WIDTH - PAD * 2),
    PAD + (1 - (value - min) / span) * (HEIGHT - PAD * 2),
  ]);
  const path = points
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x!.toFixed(2)} ${y!.toFixed(2)}`)
    .join(' ');
  const [lastX, lastY] = points.at(-1)!;

  return (
    <div data-slot="sparkline" aria-hidden className={cn('relative h-8 w-full', className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible"
      >
        <path
          d={path}
          fill="none"
          stroke="var(--subtle-foreground)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The end dot is HTML so the stretched viewBox cannot squash it into an ellipse */}
      <span
        className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-1 ring-2 ring-background"
        style={{ left: `${(lastX! / WIDTH) * 100}%`, top: `${(lastY! / HEIGHT) * 100}%` }}
      />
    </div>
  );
}
