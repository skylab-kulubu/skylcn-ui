import { SceneFrame, type SceneProps, Pixels, type SceneTone } from './scene-frame.js';

// YıldızPlace's star, cell by cell
const PLACE_LOGO: readonly (readonly [number, number, SceneTone])[] = [
  [30.4, 18, 'warm'],
  [28.8, 19.6, 'warm'],
  [30.4, 19.6, 'alert'],
  [32, 19.6, 'warm'],
  [24, 21.2, 'warm'],
  [27.2, 21.2, 'warm'],
  [28.8, 21.2, 'alert'],
  [30.4, 21.2, 'warm'],
  [32, 21.2, 'alert'],
  [33.6, 21.2, 'warm'],
  [36.8, 21.2, 'warm'],
  [25.6, 22.8, 'warm'],
  [27.2, 22.8, 'alert'],
  [28.8, 22.8, 'warm'],
  [30.4, 22.8, 'alert'],
  [32, 22.8, 'warm'],
  [33.6, 22.8, 'alert'],
  [35.2, 22.8, 'warm'],
  [24, 24.4, 'warm'],
  [25.6, 24.4, 'alert'],
  [27.2, 24.4, 'warm'],
  [28.8, 24.4, 'alert'],
  [30.4, 24.4, 'ink'],
  [32, 24.4, 'alert'],
  [33.6, 24.4, 'warm'],
  [35.2, 24.4, 'alert'],
  [36.8, 24.4, 'warm'],
  [25.6, 26, 'warm'],
  [27.2, 26, 'alert'],
  [28.8, 26, 'warm'],
  [30.4, 26, 'alert'],
  [32, 26, 'warm'],
  [33.6, 26, 'alert'],
  [35.2, 26, 'warm'],
  [24, 27.6, 'warm'],
  [27.2, 27.6, 'warm'],
  [28.8, 27.6, 'alert'],
  [30.4, 27.6, 'warm'],
  [32, 27.6, 'alert'],
  [33.6, 27.6, 'warm'],
  [36.8, 27.6, 'warm'],
  [28.8, 29.2, 'warm'],
  [30.4, 29.2, 'alert'],
  [32, 29.2, 'warm'],
  [30.4, 30.8, 'warm'],
];

// The YıldızPlace canvas, row by row: w warm, c cool, b brand, a alert, . an empty cell
const CANVAS = [
  'wcb..awcb..a',
  'ac.b.wac.b.w',
  '.ccc...ccc..',
  '..awcb..awcb',
  'b.wac.b.wac.',
  'c...ccc...cc',
  'wcb..awcb..a',
  'ac.b.wac.b.w',
];
const PAINT: Record<string, SceneTone> = { w: 'warm', c: 'cool', b: 'brand', a: 'alert' };

function Canvas() {
  return (
    <g>
      {CANVAS.flatMap((row, r) =>
        [...row].map((cell, c) => {
          const x = 26 + c * 9;
          const y = 42 + r * 9;
          return cell === '.' ? (
            <rect
              key={`${r} ${c}`}
              x={x}
              y={y}
              width="8"
              height="8"
              strokeWidth={1.25}
              stroke="var(--skylcn-scene-faint)"
            />
          ) : (
            <rect
              key={`${r} ${c}`}
              x={x}
              y={y}
              width="8"
              height="8"
              fill={`var(--skylcn-scene-${PAINT[cell]})`}
              fillOpacity=".6"
              stroke="none"
            />
          );
        }),
      )}
    </g>
  );
}

/** A: Sign-in tries fly one after another at the SKYDAYS shield; its alarm blinks "saldırı?" and the server behind says wait a minute. */
function SkydaysShield() {
  return (
    <>
      <path d="M10 152H230" stroke="var(--skylcn-scene-soft)" />
      {/* the attempt counter */}
      <rect x="12" y="16" width="74" height="30" rx="4" fill="var(--skylcn-scene-surface)" />
      <text
        x="20"
        y="27"
        fontSize="4.6"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        letterSpacing=".4"
        stroke="none"
      >
        GİRİŞ DENEMESİ
      </text>
      <text
        className="skylcn-scene-count-before"
        x="20"
        y="40.5"
        fontSize="9"
        fontWeight="700"
        fill="var(--skylcn-scene-alert)"
        stroke="none"
        opacity="0"
      >
        36
      </text>
      <text
        className="skylcn-scene-count-after"
        x="20"
        y="40.5"
        fontSize="9"
        fontWeight="700"
        fill="var(--skylcn-scene-alert)"
        stroke="none"
      >
        37
      </text>
      <text
        x="42"
        y="40"
        fontSize="5.2"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        / dk
      </text>
      {/* tries, one after another */}
      <g className="skylcn-scene-shot">
        <g transform="translate(18 70)">
          <rect
            width="22"
            height="9"
            rx="2"
            strokeWidth="1.25"
            fill="var(--skylcn-scene-surface)"
          />
          <circle cx="5" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="9" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="13" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="17" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
        </g>
      </g>
      <g className="skylcn-scene-shot skylcn-scene-lag1">
        <g transform="translate(26 85)">
          <rect
            width="22"
            height="9"
            rx="2"
            strokeWidth="1.25"
            fill="var(--skylcn-scene-surface)"
          />
          <circle cx="5" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="9" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="13" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="17" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
        </g>
      </g>
      <g className="skylcn-scene-shot skylcn-scene-lag2">
        <g transform="translate(18 100)">
          <rect
            width="22"
            height="9"
            rx="2"
            strokeWidth="1.25"
            fill="var(--skylcn-scene-surface)"
          />
          <circle cx="5" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="9" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="13" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="17" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
        </g>
      </g>
      <g className="skylcn-scene-shot skylcn-scene-lag3">
        <g transform="translate(26 115)">
          <rect
            width="22"
            height="9"
            rx="2"
            strokeWidth="1.25"
            fill="var(--skylcn-scene-surface)"
          />
          <circle cx="5" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="9" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="13" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="17" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
        </g>
      </g>
      <g className="skylcn-scene-shot skylcn-scene-lag4">
        <g transform="translate(18 130)">
          <rect
            width="22"
            height="9"
            rx="2"
            strokeWidth="1.25"
            fill="var(--skylcn-scene-surface)"
          />
          <circle cx="5" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="9" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="13" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
          <circle cx="17" cy="4.5" r="1.1" fill="var(--skylcn-scene-soft)" stroke="none" />
        </g>
      </g>
      {/* the SKYDAYS shield and its alarm */}
      <g transform="translate(122 34) scale(0.78)">
        <path
          d="M0 0L42 12V56C42 86 24 106 0 122C-24 106 -42 86 -42 56V12Z"
          fill="var(--skylcn-scene-surface)"
        />
        <path
          stroke="var(--skylcn-scene-cool)"
          d="M0 12L32 21V56C32 79 19 95 0 109C-19 95 -32 79 -32 56V21Z"
          strokeWidth="1.25"
        />
        <path
          d="M0 23L22 29.5V56C22 72 13 84 0 94C-13 84 -22 72 -22 56V29.5Z"
          strokeWidth="1.25"
          stroke="var(--skylcn-scene-faint)"
        />
        <g className="skylcn-scene-hole" stroke="var(--skylcn-scene-alert)">
          <circle cx="0" cy="52" r="9" fill="var(--skylcn-scene-surface)" />
          <path d="M-3.5 60L-6.5 75H6.5L3.5 60" fill="var(--skylcn-scene-surface)" />
        </g>
      </g>
      <text
        x="122"
        y="144"
        fontSize="7"
        fill="var(--skylcn-scene-ink)"
        textAnchor="middle"
        fontWeight="700"
        letterSpacing="1"
        stroke="none"
      >
        SKYDAYS
      </text>
      <g className="skylcn-scene-blink">
        <path
          d="M114 30V22a8 8 0 0 1 16 0V30Z"
          fill="var(--skylcn-scene-alert)"
          fillOpacity=".85"
          stroke="var(--skylcn-scene-alert)"
        />
      </g>
      <path d="M110 30H134" />
      <text
        x="150"
        y="18"
        fontSize="6"
        fill="var(--skylcn-scene-alert)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        saldırı?
      </text>
      {/* the guarded server says wait */}
      <rect x="176" y="66" width="40" height="86" rx="4" fill="var(--skylcn-scene-surface)" />
      <path d="M183 82.25H200" strokeWidth="1.25" />
      <circle cx="207" cy="82.25" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M183 98.75H200" strokeWidth="1.25" />
      <circle cx="207" cy="98.75" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M183 115.25H200" strokeWidth="1.25" />
      <circle cx="207" cy="115.25" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M183 131.75H200" strokeWidth="1.25" />
      <circle cx="207" cy="131.75" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <rect x="172" y="40" width="48" height="16" rx="8" fill="var(--skylcn-scene-surface)" />
      <text
        x="196"
        y="50.5"
        fontSize="5.4"
        fill="var(--skylcn-scene-ink)"
        textAnchor="middle"
        stroke="none"
      >
        bekle 1 dk
      </text>
    </>
  );
}

/** B: The YıldızPlace canvas with a pixel in hand and a ring counting down 0:42 to the next one. */
function YildizPlaceWait() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      <rect x="18" y="16" width="124" height="120" rx="5" fill="var(--skylcn-scene-surface)" />
      <path d="M18 34H142" strokeWidth="1.25" />
      <g stroke="none">
        <Pixels cells={PLACE_LOGO} width={1.6} height={1.6} />
      </g>
      <text
        x="42"
        y="28.5"
        fontSize="7"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        YıldızPlace
      </text>
      {/* the canvas */}
      <Canvas />
      <rect x="160" y="62" width="10" height="10" fill="var(--skylcn-scene-warm)" stroke="none" />
      <g>
        <path
          transform="translate(172 80)"
          strokeWidth="1.5"
          d="M0 0L0 15L4 11L7 17.5L9.5 16.3L6.6 10H12Z"
          fill="var(--skylcn-scene-surface)"
        />
      </g>
      <path
        d="M190 84h10M188 90h14M192 96h8"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-soft)"
      />
      <path
        d="M152 40V136"
        strokeDasharray="3 3"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <circle cx="196" cy="122" r="16" fill="var(--skylcn-scene-surface)" />
      <circle
        className="skylcn-scene-ring"
        cx="196"
        cy="122"
        r="16"
        stroke="var(--skylcn-scene-brand)"
        strokeDasharray="100.5"
        strokeDashoffset="52"
        transform="rotate(-90 196 122)"
      />
      <text
        x="196"
        y="125"
        fontSize="7"
        fill="var(--skylcn-scene-ink)"
        textAnchor="middle"
        fontWeight="700"
        stroke="none"
      >
        0:42
      </text>
      <text
        x="196"
        y="148"
        fontSize="5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        stroke="none"
      >
        bekleme
      </text>
    </>
  );
}

/**
 * 429, too many tries.
 *
 * - A: Sign-in tries fly one after another at the SKYDAYS shield; its alarm blinks "saldırı?" and the server behind says wait a minute.
 * - B: The YıldızPlace canvas with a pixel in hand and a ring counting down 0:42 to the next one.
 */
export function TooManyRequestsScene(props: SceneProps<'tooManyRequests'>) {
  return (
    <SceneFrame
      kind="tooManyRequests"
      drawings={{ A: SkydaysShield, B: YildizPlaceWait }}
      {...props}
    />
  );
}
