import { SceneFrame, type SceneProps } from './scene-frame.js';

const SHIELD = 'M120 22c20 8 40 11 56 11c0 63-18 97-56 123C82 130 64 96 64 33c16 0 36-3 56-11z';
const KEYHOLE = 'M114.5 89 111 108h18l-3.5-19';

/**
 * 403, SkyDays: the CTF's nested shield with its maze keyhole. A key slides in, tries to
 * turn and will not; the keyhole flashes and the key backs out.
 */
export function ForbiddenScene(props: SceneProps) {
  return (
    <SceneFrame kind="forbidden" {...props}>
      {/* three shields, the inner ones scaled about the keyhole; widths keep 2, 1.5 and 1.25 */}
      <path className="skylcn-scene-pulse" d={SHIELD} />
      <path
        d={SHIELD}
        stroke="var(--skylcn-scene-cool)"
        strokeWidth={1.875}
        transform="translate(24 17.6) scale(0.8)"
      />
      <path
        d={SHIELD}
        stroke="var(--skylcn-scene-cool)"
        strokeWidth={2.08}
        opacity="0.55"
        transform="translate(48 35.2) scale(0.6)"
      />
      <g fill="var(--skylcn-scene-surface)">
        <path d={KEYHOLE} />
        <circle cx="120" cy="80" r="12.5" />
      </g>
      {/* the keyhole's maze */}
      <path
        d="M112.5 81a7.5 7.5 0 0 1 12-6M127.5 80a7.5 7.5 0 0 1-3 6M116 80a4 4 0 0 1 7-2.6"
        stroke="var(--skylcn-scene-cool)"
        strokeWidth={1.25}
      />
      <g className="skylcn-scene-deny" stroke="var(--skylcn-scene-alert)">
        <circle cx="120" cy="80" r="12.5" />
        <path d={KEYHOLE} />
      </g>
      <g transform="translate(120 82)">
        <g className="skylcn-scene-key" stroke="var(--skylcn-scene-warm)">
          <path d="M0 0h27M3 0v5M8 0v4" />
          <circle cx="34" cy="0" r="7" />
          <circle cx="34" cy="0" r="2.2" strokeWidth={1.25} />
        </g>
      </g>
    </SceneFrame>
  );
}
