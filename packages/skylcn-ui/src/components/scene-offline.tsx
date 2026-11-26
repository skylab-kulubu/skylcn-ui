import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: YıldızJam's pause menu (1UP, DURAKLATILDI, DEVAM ET) above the pixel controller, its plug swinging loose from the strip. */
function YildizJamPaused() {
  return (
    <>
      <path d="M14 160H226" stroke="var(--skylcn-scene-soft)" />
      <text
        x="20"
        y="22"
        fontSize="7"
        fill="var(--skylcn-scene-warm)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        1UP
      </text>
      <text
        x="120"
        y="22"
        fontSize="8"
        fill="var(--skylcn-scene-brand)"
        textAnchor="middle"
        fontWeight="700"
        letterSpacing="1"
        stroke="none"
      >
        YILDIZ JAM
      </text>
      <g transform="translate(210 15) scale(0.55)" strokeWidth="2.73">
        <path
          d="M-12 -4a17 17 0 0 1 24 0M-8 0a11 11 0 0 1 16 0M-4 4a5 5 0 0 1 8 0"
          stroke="var(--skylcn-scene-soft)"
        />
        <circle cx="0" cy="8" r="1.6" fill="var(--skylcn-scene-soft)" stroke="none" />
        <path stroke="var(--skylcn-scene-alert)" d="M-11 10L11 -12" />
      </g>
      <path d="M20 28H220" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      {/* the pause menu: where you left off */}
      <rect x="58" y="34" width="124" height="44" rx="3" fill="var(--skylcn-scene-surface)" />
      <rect
        x="66"
        y="39"
        width="2.6"
        height="8"
        rx=".6"
        fill="var(--skylcn-scene-ink)"
        stroke="none"
      />
      <rect
        x="71"
        y="39"
        width="2.6"
        height="8"
        rx=".6"
        fill="var(--skylcn-scene-ink)"
        stroke="none"
      />
      <text
        x="79"
        y="46"
        fontSize="5.6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="start"
        letterSpacing=".5"
        stroke="none"
      >
        DURAKLATILDI
      </text>
      <g className="skylcn-scene-pause">
        <path d="M68 56l5 3.5-5 3.5z" fill="var(--skylcn-scene-warm)" stroke="none" />
      </g>
      <text
        x="78"
        y="62"
        fontSize="6.4"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        DEVAM ET
      </text>
      <text
        x="68"
        y="73"
        fontSize="4.8"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        kayıt: LVL 01 · 47:12:08
      </text>
      <g transform="translate(62 86) scale(0.9)" strokeWidth="2.22">
        <path
          strokeLinejoin="miter"
          strokeLinecap="square"
          d="M8 0H84V4H88V8H92V44H88V48H84V52H72V48H68V44H64V40H28V44H24V48H20V52H8V48H4V44H0V8H4V4H8Z"
          fill="var(--skylcn-scene-surface)"
        />
        <path
          strokeWidth="1.39"
          strokeLinejoin="miter"
          strokeLinecap="square"
          d="M13 12h6v5h5v6h-5v5h-6v-5h-5v-6h5z"
        />
        <rect x="66" y="16" width="6" height="6" fill="var(--skylcn-scene-warm)" stroke="none" />
        <rect x="75" y="16" width="6" height="6" fill="var(--skylcn-scene-cool)" stroke="none" />
        <path strokeWidth="1.39" d="M36 22h6M50 22h6" stroke="var(--skylcn-scene-faint)" />
      </g>
      <path
        className="skylcn-scene-tw skylcn-scene-d1"
        stroke="var(--skylcn-scene-brand)"
        strokeWidth="1.4"
        d="M103 139L104.85 143.45L109.66 143.84L106 146.97L107.11 151.66L103 149.15L98.89 151.66L100 146.97L96.34 143.84L101.15 143.45Z"
      />
      <path d="M103 86C103 70 146 68 166 80C180 88 186 100 188 112" />
      <g transform="translate(188 112)">
        <g className="skylcn-scene-plug">
          <g transform="translate(-188 -112)">
            <rect
              x="183"
              y="112"
              width="10"
              height="12"
              rx="1.6"
              fill="var(--skylcn-scene-surface)"
            />
            <path d="M185.8 124v4M190.2 124v4" strokeWidth="1.25" />
          </g>
        </g>
      </g>
      <path
        className="skylcn-scene-zap"
        d="M178 134l4 4-3 1 4 4"
        stroke="var(--skylcn-scene-warm)"
        strokeWidth="1.5"
      />
      <rect x="172" y="148" width="56" height="11" rx="3" fill="var(--skylcn-scene-surface)" />
      <path d="M184 151.5v4M188 151.5v4M200 151.5v4M204 151.5v4" strokeWidth="1.25" />
    </>
  );
}

/** B: Our server says ✓ and its line runs out fine; it breaks on your side, where the laptop shows no internet. */
function YourInternet() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      {/* our server: running */}
      <rect x="20" y="58" width="44" height="92" rx="4" fill="var(--skylcn-scene-surface)" />
      <path d="M27 75H48" strokeWidth="1.25" />
      <circle cx="55" cy="75" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M27 93H48" strokeWidth="1.25" />
      <circle cx="55" cy="93" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M27 111H48" strokeWidth="1.25" />
      <circle cx="55" cy="111" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M27 129H48" strokeWidth="1.25" />
      <circle cx="55" cy="129" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <rect
        x="14"
        y="30"
        width="56"
        height="16"
        rx="8"
        stroke="var(--skylcn-scene-cool)"
        strokeWidth="1.25"
        fill="var(--skylcn-scene-surface)"
      />
      <text
        x="42"
        y="40.5"
        fontSize="5.8"
        fill="var(--skylcn-scene-cool)"
        textAnchor="middle"
        fontWeight="700"
        stroke="none"
      >
        sunucu ✓
      </text>
      {/* the line leaves us fine and breaks on your side */}
      <path d="M64 100H118" strokeWidth="1.25" />
      <g className="skylcn-scene-sig1">
        <circle cx="80" cy="100" r="2" fill="var(--skylcn-scene-cool)" stroke="none" />
      </g>
      <g className="skylcn-scene-sig2">
        <circle cx="96" cy="100" r="2" fill="var(--skylcn-scene-cool)" stroke="none" />
      </g>
      <g className="skylcn-scene-sig3">
        <circle cx="112" cy="100" r="2" fill="var(--skylcn-scene-cool)" stroke="none" />
      </g>
      <path
        strokeDasharray="2 3"
        d="M124 100H138"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <path
        className="skylcn-scene-zap"
        d="M120 92l4 4-3 1 4 4"
        stroke="var(--skylcn-scene-warm)"
        strokeWidth="1.5"
      />
      {/* your laptop: no internet */}
      <rect x="146" y="76" width="72" height="54" rx="5" fill="var(--skylcn-scene-surface)" />
      <rect
        x="151"
        y="81"
        width="62"
        height="44"
        rx="2"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <g transform="translate(182 103) scale(0.85)" strokeWidth="1.76">
        <path
          d="M-12 -4a17 17 0 0 1 24 0M-8 0a11 11 0 0 1 16 0M-4 4a5 5 0 0 1 8 0"
          stroke="var(--skylcn-scene-soft)"
        />
        <circle cx="0" cy="8" r="1.6" fill="var(--skylcn-scene-soft)" stroke="none" />
        <path stroke="var(--skylcn-scene-alert)" d="M-11 10L11 -12" />
      </g>
      <path d="M138 130H226L233 139H131Z" fill="var(--skylcn-scene-surface)" />
      <path d="M171 134.5H193" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <rect
        x="152"
        y="40"
        width="60"
        height="16"
        rx="8"
        stroke="var(--skylcn-scene-alert)"
        strokeWidth="1.25"
        fill="var(--skylcn-scene-surface)"
      />
      <text
        x="182"
        y="50.5"
        fontSize="5.8"
        fill="var(--skylcn-scene-alert)"
        textAnchor="middle"
        fontWeight="700"
        stroke="none"
      >
        internet ×
      </text>
    </>
  );
}

/**
 * Offline: the browser has no connection.
 *
 * - A: YıldızJam's pause menu (1UP, DURAKLATILDI, DEVAM ET) above the pixel controller, its plug swinging loose from the strip.
 * - B: Our server says ✓ and its line runs out fine; it breaks on your side, where the laptop shows no internet.
 */
export function OfflineScene(props: SceneProps<'offline'>) {
  return (
    <SceneFrame kind="offline" drawings={{ A: YildizJamPaused, B: YourInternet }} {...props} />
  );
}
