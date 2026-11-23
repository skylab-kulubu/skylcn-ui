import { SceneFrame, type SceneProps } from './scene-frame.js';

// Diagonal stripes along the tape, every 16 units
const STRIPES = Array.from({ length: 11 }, (_, i) => 34 + i * 16);

/**
 * Maintenance, WEBLAB: the web team's browser window with its `{ }` and globe under
 * repair. The globe turns, the progress bar fills, the wrench works at the corner and
 * construction tape runs across.
 */
export function MaintenanceScene(props: SceneProps) {
  return (
    <SceneFrame kind="maintenance" {...props}>
      {/* the window */}
      <rect x="50" y="36" width="140" height="100" rx="8" fill="var(--skylcn-scene-surface)" />
      <path d="M50 50h140" strokeWidth={1.25} opacity="0.55" />
      <g fill="var(--skylcn-scene-soft)" stroke="none">
        <circle cx="59" cy="43" r="2" />
        <circle cx="66" cy="43" r="2" />
        <circle cx="73" cy="43" r="2" />
      </g>

      {/* { globe } and the bar under it */}
      <g stroke="var(--skylcn-scene-brand)">
        <path d="M92 64q-6 0-6 6v4q0 4-4 4q4 0 4 4v4q0 6 6 6" />
        <path d="M148 64q6 0 6 6v4q0 4 4 4q-4 0-4 4v4q0 6-6 6" />
      </g>
      <circle cx="120" cy="78" r="15" />
      <path d="M105 78h30" strokeWidth={1.25} />
      <ellipse className="skylcn-scene-turn" cx="120" cy="78" rx="7" ry="15" strokeWidth={1.25} />
      <ellipse
        className="skylcn-scene-turn skylcn-scene-d2"
        cx="120"
        cy="78"
        rx="12"
        ry="15"
        strokeWidth={1.25}
        opacity="0.55"
      />
      <rect
        x="98"
        y="102"
        width="44"
        height="5"
        rx="2.5"
        strokeWidth={1.25}
        stroke="var(--skylcn-scene-soft)"
      />
      <rect
        className="skylcn-scene-progress"
        x="98"
        y="102"
        width="28"
        height="5"
        rx="2.5"
        fill="var(--skylcn-scene-brand)"
        stroke="none"
      />

      {/* construction tape across the window */}
      <g transform="rotate(-8 120 124)">
        <rect
          x="26"
          y="117"
          width="188"
          height="14"
          fill="var(--skylcn-scene-surface)"
          stroke="var(--skylcn-scene-warm)"
          strokeWidth={1.5}
        />
        <g fill="var(--skylcn-scene-warm)" stroke="none">
          {STRIPES.map((x) => (
            <path key={x} d={`M${x} 117h8l-7 14h-8z`} />
          ))}
        </g>
      </g>

      {/* the wrench at work on the corner */}
      <g transform="translate(184 40)">
        <g className="skylcn-scene-wrench">
          <g transform="rotate(-40)">
            <rect
              x="0"
              y="-3.5"
              width="30"
              height="7"
              rx="3.5"
              fill="var(--skylcn-scene-surface)"
            />
            <circle cx="37" cy="0" r="9" fill="var(--skylcn-scene-surface)" />
            <rect
              x="40"
              y="-3.5"
              width="10"
              height="7"
              fill="var(--skylcn-scene-surface)"
              stroke="none"
            />
            <path d="M45.3 -3.5h-5.3v7h5.3" />
          </g>
        </g>
      </g>
    </SceneFrame>
  );
}
