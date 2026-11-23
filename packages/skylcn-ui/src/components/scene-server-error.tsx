import { useId } from 'react';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/**
 * 500, ARTLAB: the summit's robot, drawn after Kaan Necip Kalp's 2026 ARTLAB figure
 * (artlab-site `src/themes/2026`), crying. Eyelid low, eye looking down, tears falling
 * into a small puddle, a spark at its ear; the head sobs twice.
 */
export function ServerErrorScene(props: SceneProps) {
  // useId's characters do not all survive inside url(#…)
  const id = `skylcn-scene-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <SceneFrame kind="error" {...props}>
      <defs>
        <clipPath id={`${id}-lid`}>
          <circle cx="60" cy="51" r="13.2" />
        </clipPath>
      </defs>
      {/* the figure's own 120-unit drawing, enlarged; lines thinned to keep the 2-unit weight */}
      <g transform="translate(39 2) scale(1.35)" strokeWidth={1.5}>
        <ellipse
          className="skylcn-scene-spread"
          cx="60"
          cy="113"
          rx="18"
          ry="2.6"
          fill="var(--skylcn-scene-cool)"
          stroke="none"
          opacity="0.3"
        />
        {/* legs, hip and feet */}
        <g fill="var(--skylcn-scene-surface)">
          <path d="M58 104Q48 92 54 80l4 4q-4 8 0 20z" />
          <path d="M62 104q10-12 4-24l-4 4q4 8 0 20z" />
          <rect x="34" y="96" width="18" height="11" rx="4" />
          <rect x="68" y="96" width="18" height="11" rx="4" />
        </g>
        <circle cx="60" cy="80" r="2.6" fill="var(--skylcn-scene-warm)" stroke="none" />
        <path
          d="M39 99.5v4M43 99.5v4M47 99.5v4M73 99.5v4M77 99.5v4M81 99.5v4"
          strokeWidth={0.95}
          opacity="0.55"
        />

        <g className="skylcn-scene-sob">
          <circle cx="60" cy="48" r="30" fill="var(--skylcn-scene-surface)" />
          <path d="M36.6 39Q60 23.4 83.4 39" strokeWidth={0.95} opacity="0.5" />
          {[31.2, 88.8].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="50.4" r="9" fill="var(--skylcn-scene-surface)" />
              <circle
                cx={cx}
                cy="50.4"
                r="3.9"
                stroke="var(--skylcn-scene-warm)"
                strokeWidth={0.95}
              />
            </g>
          ))}
          {/* the eye: socket, lens rings, the pupil looking down, a heavy lid */}
          <circle cx="60" cy="51" r="14.1" fill="var(--skylcn-scene-surface)" strokeWidth={1.1} />
          <circle cx="60" cy="51" r="10.2" stroke="var(--skylcn-scene-cool)" />
          <circle
            cx="60"
            cy="51"
            r="6"
            stroke="var(--skylcn-scene-cool)"
            strokeWidth={0.95}
            opacity="0.6"
          />
          <circle cx="60" cy="56.5" r="2.8" fill="var(--skylcn-scene-cool)" stroke="none" />
          <path
            d="M44 47.5Q60 41.5 76 50V34H44z"
            fill="var(--skylcn-scene-surface)"
            stroke="none"
            clipPath={`url(#${id}-lid)`}
          />
          <path d="M47 47Q60 42 73 49.2" />
          <path
            className="skylcn-scene-flash"
            d="M97 35l4-5-1 5 5-3"
            stroke="var(--skylcn-scene-warm)"
            strokeWidth={1.2}
          />
        </g>
        <g fill="var(--skylcn-scene-cool)" stroke="none">
          <path className="skylcn-scene-drip" d="M54 64c-2.4 4-3 6.5 0 8c3-1.5 2.4-4 0-8z" />
          <path
            className="skylcn-scene-drip skylcn-scene-d2"
            d="M66 64c-2.4 4-3 6.5 0 8c3-1.5 2.4-4 0-8z"
          />
        </g>
      </g>
    </SceneFrame>
  );
}
