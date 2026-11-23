import { SceneFrame, type SceneProps } from './scene-frame.js';

/**
 * Offline, YıldızJam: the game jam's pixel controller (its mark, with the star below) under
 * the HUD of the jam's site — 1UP, LVL 01 and the jam clock stopped at 47:12:08 — paused,
 * its cable out of the power strip. The plug swings, a spark jumps, "DURAKLATILDI" blinks.
 */
export function OfflineScene(props: SceneProps) {
  return (
    <SceneFrame kind="offline" {...props}>
      {/* the HUD */}
      <g stroke="none" className="font-mono">
        <text x="20" y="22" fontSize="7" fontWeight="700" fill="var(--skylcn-scene-warm)">
          1UP
        </text>
        <text
          x="120"
          y="22"
          textAnchor="middle"
          fontSize="6.4"
          letterSpacing="0.6"
          fill="var(--skylcn-scene-soft)"
        >
          LVL 01
        </text>
        <text
          x="220"
          y="12"
          textAnchor="end"
          fontSize="4.8"
          letterSpacing="0.6"
          fill="var(--skylcn-scene-faint)"
        >
          JAM SAYACI
        </text>
        <text
          x="220"
          y="22"
          textAnchor="end"
          fontSize="8"
          fontWeight="700"
          fill="var(--skylcn-scene-ink)"
        >
          47:12:08
        </text>
      </g>
      <path d="M20 28H220" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />

      {/* paused */}
      <g className="skylcn-scene-pause">
        <rect x="80" y="36" width="80" height="18" rx="3" fill="var(--skylcn-scene-surface)" />
        <g fill="var(--skylcn-scene-ink)" stroke="none">
          <rect x="88" y="40.5" width="3" height="9" rx="0.6" />
          <rect x="93.5" y="40.5" width="3" height="9" rx="0.6" />
        </g>
        <text
          x="102"
          y="47.8"
          fontSize="6"
          letterSpacing="0.5"
          fill="var(--skylcn-scene-soft)"
          stroke="none"
          className="font-mono"
        >
          DURAKLATILDI
        </text>
      </g>

      {/* the pixel controller and its two coloured buttons */}
      <g strokeLinejoin="miter" strokeLinecap="square">
        <path
          d="M70 76H146V80H150V84H154V120H150V124H146V128H134V124H130V120H126V116H90V120H86V124H82V128H70V124H66V120H62V84H66V80H70Z"
          fill="var(--skylcn-scene-surface)"
        />
        <path d="M75 88h6v5h5v6h-5v5h-6v-5h-5v-6h5z" strokeWidth={1.25} />
      </g>
      <rect x="128" y="92" width="6" height="6" fill="var(--skylcn-scene-warm)" stroke="none" />
      <rect x="137" y="92" width="6" height="6" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M98 98h6M112 98h6" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />
      <path
        className="skylcn-scene-twinkle skylcn-scene-d1"
        d="M108 136L110.6 141.4L116.6 142.2L112.3 146.3L113.3 152.2L108 149.4L102.7 152.2L103.7 146.3L99.4 142.2L105.4 141.4Z"
        stroke="var(--skylcn-scene-brand)"
        strokeWidth={1.4}
      />

      {/* the cable, the plug out of the strip, a spark */}
      <path d="M108 76C108 58 146 56 166 70C180 80 186 96 188 112" />
      <g transform="translate(188 112)">
        <g className="skylcn-scene-swing">
          <rect x="-5" y="0" width="10" height="12" rx="1.6" fill="var(--skylcn-scene-surface)" />
          <path d="M-2.2 12v4M2.2 12v4" strokeWidth={1.25} />
        </g>
      </g>
      <path
        className="skylcn-scene-zap"
        d="M178 134l4 4-3 1 4 4"
        stroke="var(--skylcn-scene-warm)"
        strokeWidth={1.5}
      />
      <rect x="172" y="148" width="56" height="11" rx="3" fill="var(--skylcn-scene-surface)" />
      <path d="M184 151.5v4M188 151.5v4M200 151.5v4M204 151.5v4" strokeWidth={1.25} />
      <rect
        x="215"
        y="151"
        width="7"
        height="5"
        rx="1"
        fill="var(--skylcn-scene-alert)"
        stroke="none"
        opacity="0.8"
      />
      <path d="M14 160H226" stroke="var(--skylcn-scene-soft)" />
    </SceneFrame>
  );
}
