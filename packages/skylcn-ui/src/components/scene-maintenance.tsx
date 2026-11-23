import { SceneFrame, type SceneProps } from './scene-frame.js';

const STEPS = ['2/5', '3/5', '4/5'] as const;

/**
 * Maintenance, WEBLAB: the team's mark — a globe inside `{ <weblab/> }` — in a browser
 * window, with a deploy to production under way and a cone beside it. The globe turns, the
 * bar fills and the step count moves on.
 */
export function MaintenanceScene(props: SceneProps) {
  return (
    <SceneFrame kind="maintenance" {...props}>
      {/* the window */}
      <rect x="20" y="16" width="200" height="128" rx="6" fill="var(--skylcn-scene-surface)" />
      <path d="M20 30H220" strokeWidth={1.25} />
      <g fill="var(--skylcn-scene-soft)" stroke="none">
        <circle cx="29" cy="23" r="1.7" />
        <circle cx="36" cy="23" r="1.7" />
        <circle cx="43" cy="23" r="1.7" />
      </g>
      <rect
        x="62"
        y="19"
        width="116"
        height="8"
        rx="4"
        stroke="var(--skylcn-scene-faint)"
        strokeWidth={1.25}
      />
      <text
        x="120"
        y="25"
        textAnchor="middle"
        fontSize="5"
        fill="var(--skylcn-scene-soft)"
        stroke="none"
        className="font-mono"
      >
        yildizskylab.com
      </text>

      {/* WEBLAB's globe and braces */}
      <circle cx="120" cy="70" r="25" fill="var(--skylcn-scene-surface)" />
      <g stroke="var(--skylcn-scene-soft)" strokeWidth={1.25}>
        <path d="M99 57Q120 62 141 57M99 83Q120 88 141 83M120 45V95" />
        <ellipse className="skylcn-scene-turn" cx="120" cy="70" rx="12" ry="25" />
        <ellipse className="skylcn-scene-turn skylcn-scene-d2" cx="120" cy="70" rx="20" ry="25" />
      </g>
      <rect
        x="86"
        y="63"
        width="68"
        height="14"
        rx="3"
        fill="var(--skylcn-scene-surface)"
        stroke="var(--skylcn-scene-brand)"
        strokeWidth={1.25}
      />
      <text
        x="120"
        y="72.6"
        textAnchor="middle"
        fontSize="7.4"
        fontWeight="700"
        fill="var(--skylcn-scene-brand)"
        stroke="none"
        className="font-mono"
      >
        {'<weblab/>'}
      </text>
      <path
        d="M79 50q-6 0-6 6v7q0 7-5 7q5 0 5 7v7q0 6 6 6M161 50q6 0 6 6v7q0 7 5 7q-5 0-5 7v7q0 6-6 6"
        stroke="var(--skylcn-scene-brand)"
      />

      {/* the deploy */}
      <g stroke="none" fontSize="6.2" className="font-mono">
        <text x="58" y="112" fill="var(--skylcn-scene-soft)">
          $ deploy production
        </text>
        {STEPS.map((step, i) => (
          <text
            key={step}
            className={`skylcn-scene-step${i + 1}`}
            x="182"
            y="112"
            textAnchor="end"
            fill="var(--skylcn-scene-faint)"
          >
            {step}
          </text>
        ))}
      </g>
      <rect x="58" y="118" width="124" height="7" rx="3.5" strokeWidth={1.25} />
      <rect
        className="skylcn-scene-progress"
        x="60"
        y="120"
        width="120"
        height="3"
        rx="1.5"
        fill="var(--skylcn-scene-brand)"
        stroke="none"
      />

      {/* a cone by the window */}
      <path d="M216 160L226 130L236 160Z" fill="var(--skylcn-scene-surface)" />
      <path d="M220 150H232M223 140H229" stroke="var(--skylcn-scene-warm)" strokeWidth={1.25} />
      <path d="M212 160H238" />
      <path d="M10 160H206" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />
    </SceneFrame>
  );
}
