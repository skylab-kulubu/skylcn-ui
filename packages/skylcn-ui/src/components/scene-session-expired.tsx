import { useId } from 'react';
import { SceneFrame, type SceneProps } from './scene-frame.js';

const FILE = 'M0 0h4.5l2.5 2.5v6.5h-7z';
const FOLD = 'M4.5 0v2.5h2.5';
// The fake dialog; the file icons leave it room
const DIALOG = { x: 78, y: 58, w: 84, h: 34 };

/** The desktop's file icons, row by row, skipping the ones under the dialog. */
const ICONS = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 11 }, (_, col) => ({ x: 58 + col * 12, y: 36 + row * 17 })).filter(
    ({ x, y }) =>
      x + 7 < DIALOG.x - 2 ||
      x > DIALOG.x + DIALOG.w + 2 ||
      y + 9 < DIALOG.y - 2 ||
      y > DIALOG.y + DIALOG.h + 2,
  ),
);

/**
 * Session expired, GECEKODU: a laptop left unlocked at the desk gets the night's pranks.
 * The screen is turned askew, a file bomb fills the desktop with the same file over and
 * over, a USB stick sits in the side and a fake "formatlanıyor… %37" dialog runs. The files
 * multiply row by row, the bar creeps up, the stick's light blinks.
 */
export function SessionExpiredScene(props: SceneProps) {
  // useId's characters do not all survive inside url(#…)
  const id = `skylcn-scene-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <SceneFrame kind="sessionExpired" {...props}>
      <defs>
        <clipPath id={`${id}-screen`}>
          <rect x="52" y="32" width="136" height="88" rx="2" />
        </clipPath>
      </defs>

      {/* the laptop */}
      <rect x="46" y="26" width="148" height="100" rx="6" fill="var(--skylcn-scene-surface)" />
      <g clipPath={`url(#${id}-screen)`}>
        {/* turned askew: the first prank */}
        <g transform="rotate(-6 120 76)">
          <g fill="var(--skylcn-scene-surface)" stroke="var(--skylcn-scene-soft)" strokeWidth={1.1}>
            {ICONS.map((icons, row) => (
              <g key={row} className={`skylcn-scene-c${row + 1}`}>
                {icons.map(({ x, y }) => (
                  <g key={x} transform={`translate(${x} ${y})`}>
                    <path d={FILE} />
                    <path d={FOLD} stroke="var(--skylcn-scene-faint)" />
                  </g>
                ))}
              </g>
            ))}
          </g>
          <rect
            x={DIALOG.x}
            y={DIALOG.y}
            width={DIALOG.w}
            height={DIALOG.h}
            rx="3"
            fill="var(--skylcn-scene-surface)"
          />
          <g stroke="none" fontSize="6" className="font-mono">
            <text x="84" y="70" fill="var(--skylcn-scene-soft)">
              formatlanıyor…
            </text>
            <text x="156" y="70" textAnchor="end" fill="var(--skylcn-scene-alert)">
              %37
            </text>
          </g>
          <rect x="84" y="78" width="72" height="6" rx="3" strokeWidth={1.25} />
          <rect
            className="skylcn-scene-format"
            x="85.5"
            y="79.5"
            width="69"
            height="3"
            rx="1.5"
            fill="var(--skylcn-scene-alert)"
            stroke="none"
          />
        </g>
      </g>
      <rect
        x="52"
        y="32"
        width="136"
        height="88"
        rx="2"
        stroke="var(--skylcn-scene-faint)"
        strokeWidth={1.25}
      />
      <path d="M36 126H204L212 135H28Z" fill="var(--skylcn-scene-surface)" />
      <path d="M108 130.5H132" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />

      {/* the USB stick in its side */}
      <path d="M209 131h4" strokeWidth={1.25} />
      <rect x="213" y="127.5" width="16" height="7" rx="1.5" fill="var(--skylcn-scene-surface)" />
      <circle
        className="skylcn-scene-cursor"
        cx="225"
        cy="131"
        r="1.3"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />

      {/* the desk */}
      <path d="M14 136H226" stroke="var(--skylcn-scene-soft)" />
    </SceneFrame>
  );
}
