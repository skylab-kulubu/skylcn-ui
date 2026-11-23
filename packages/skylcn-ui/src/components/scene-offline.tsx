import { SceneFrame, type SceneProps } from './scene-frame.js';

// The pixel star of YıldızJam's mark, as 4-unit squares around its middle
const STAR = [
  [0, -2],
  [-1, -1],
  [0, -1],
  [1, -1],
  [-2, 0],
  [-1, 0],
  [0, 0],
  [1, 0],
  [2, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [-1, 2],
  [1, 2],
] as const;

/**
 * Offline, YıldızJam: the game jam's controller with its cable pulled out of the socket.
 * The plug swings, a spark jumps at the socket, the buttons and "P1" blink.
 */
export function OfflineScene(props: SceneProps) {
  return (
    <SceneFrame kind="offline" {...props}>
      <text
        className="skylcn-scene-blink font-mono"
        x="40"
        y="92"
        fontSize="10"
        fontWeight="700"
        letterSpacing="1"
        fill="var(--skylcn-scene-soft)"
        stroke="none"
      >
        P1
      </text>
      <g fill="var(--skylcn-scene-brand)" stroke="none" transform="translate(198 138)">
        {STAR.map(([x, y]) => (
          <rect key={`${x}${y}`} x={x * 4 - 2} y={y * 4 - 2} width="4" height="4" />
        ))}
      </g>

      {/* the cable, from the controller to the plug that swings loose */}
      <path d="M96 100C96 76 118 58 148 58" />
      <g transform="translate(148 58)">
        <g className="skylcn-scene-swing">
          <path d="M0 0c10 0 15 3 20 7" />
          <g transform="rotate(32 24 10)">
            <rect x="18" y="5" width="13" height="10" rx="2" fill="var(--skylcn-scene-surface)" />
            <path d="M31 7.5h5M31 12.5h5" strokeWidth={1.5} />
          </g>
        </g>
      </g>
      {/* the socket on the wall */}
      <g stroke="var(--skylcn-scene-soft)">
        <rect x="204" y="44" width="22" height="34" rx="4" />
        <path d="M211 55h8M211 67h8" strokeWidth={2.5} />
      </g>
      <path
        className="skylcn-scene-zap"
        d="M197 52l-4 7h5l-4 7"
        stroke="var(--skylcn-scene-warm)"
        strokeWidth={1.75}
      />

      {/* the controller */}
      <path
        d="M52 100h88a22 22 0 0 1 21 28l-6 18a12 12 0 0 1-21 3l-8-11H66l-8 11a12 12 0 0 1-21-3l-6-18a22 22 0 0 1 21-28z"
        fill="var(--skylcn-scene-surface)"
      />
      <path d="M58 108h8v6h6v8h-6v6h-8v-6h-6v-8h6z" strokeWidth={1.5} />
      <path d="M88 124h6M98 124h6" strokeWidth={1.25} opacity="0.55" />
      <circle
        className="skylcn-scene-blink"
        cx="126"
        cy="112"
        r="4.5"
        fill="var(--skylcn-scene-brand)"
        stroke="none"
      />
      <circle
        className="skylcn-scene-blink skylcn-scene-d2"
        cx="136"
        cy="121"
        r="4.5"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />
      <circle cx="116" cy="121" r="4.5" strokeWidth={1.5} />
      <circle cx="126" cy="130" r="4.5" strokeWidth={1.5} />
    </SceneFrame>
  );
}
