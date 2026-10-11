import { SKYLAB_MARK_PATHS, SKYLAB_MARK_VIEWBOX } from '../assets/skylab-mark.js';
import { cn } from '../lib/cn.js';

// Its own module, so a page that shows only the mark (TaskPage) does not pull in
// the app shell, and sources/task-page.css scans only what it draws.

/** The SKY LAB mark as a still image, for brand slots. */
export function SkylabMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox={SKYLAB_MARK_VIEWBOX}
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      <g fillRule="evenodd">
        {SKYLAB_MARK_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
