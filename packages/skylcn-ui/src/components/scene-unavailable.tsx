import { ScenePage, type ErrorScenePageProps } from './scene-page.js';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: A server rack with one slot empty and a "çaya gittim" note; a dotted path leads to the GECEKODU tea urn. */
function GoneForTea() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      {/* the server rack: one slot empty */}
      <rect x="18" y="38" width="60" height="112" rx="4" fill="var(--skylcn-scene-surface)" />
      <rect x="24" y="46" width="48" height="20" rx="2" strokeWidth="1.25" />
      <circle cx="64" cy="56" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M30 56H54" strokeWidth="1.25" />
      <rect
        x="24"
        y="72"
        width="48"
        height="20"
        rx="2"
        strokeDasharray="3 3"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <rect x="24" y="98" width="48" height="20" rx="2" strokeWidth="1.25" />
      <circle cx="64" cy="108" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M30 108H54" strokeWidth="1.25" />
      <rect x="24" y="124" width="48" height="20" rx="2" strokeWidth="1.25" />
      <circle cx="64" cy="134" r="1.8" fill="var(--skylcn-scene-cool)" stroke="none" />
      <path d="M30 134H54" strokeWidth="1.25" />
      <g transform="rotate(-5 49 82)">
        <rect
          x="29"
          y="74"
          width="40"
          height="16"
          rx="1.2"
          stroke="var(--skylcn-scene-warm)"
          strokeWidth="1.25"
          fill="var(--skylcn-scene-surface)"
        />
        <text
          x="49"
          y="81.5"
          fontSize="4.8"
          fill="var(--skylcn-scene-warm)"
          textAnchor="middle"
          fontWeight="700"
          stroke="none"
        >
          çaya gittim
        </text>
      </g>
      <path
        strokeDasharray="2 4"
        d="M80 82Q112 52 140 92"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <path d="M136 88l4 4 1-6" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      {/* the tea urn, with a GECEKODU label */}
      <path d="M162 72Q158 54 178 52Q198 54 194 72Z" fill="var(--skylcn-scene-surface)" />
      <circle cx="178" cy="49" r="2.4" strokeWidth="1.25" fill="var(--skylcn-scene-surface)" />
      <path d="M194 64L204 56" />
      <rect x="152" y="72" width="52" height="68" rx="8" fill="var(--skylcn-scene-surface)" />
      <text
        x="178"
        y="90"
        fontSize="9"
        fill="var(--skylcn-scene-ink)"
        textAnchor="middle"
        fontWeight="700"
        letterSpacing="1"
        stroke="none"
      >
        ÇAY
      </text>
      <g>
        <circle
          cx="164"
          cy="112"
          r="6.2"
          strokeWidth="1.25"
          stroke="var(--skylcn-scene-soft)"
          fill="var(--skylcn-scene-surface)"
        />
        <circle cx="160.9" cy="109.02" r="1.24" fill="var(--skylcn-scene-warm)" stroke="none" />
        <circle cx="161.46" cy="108.53" r="1.05" fill="var(--skylcn-scene-surface)" stroke="none" />
        <path
          d="M164.31 107.04L164.51 107.46L164.93 107.66L164.51 107.86L164.31 108.28L164.11 107.86L163.69 107.66L164.11 107.46Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M167.1 108.53L167.3 108.95L167.72 109.15L167.3 109.35L167.1 109.77L166.9 109.35L166.48 109.15L166.9 108.95Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M168.09 111.5L168.25 111.84L168.59 112L168.25 112.16L168.09 112.5L167.93 112.16L167.6 112L167.93 111.84Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M159.78 111.26L159.94 111.59L160.28 111.75L159.94 111.91L159.78 112.25L159.63 111.91L159.29 111.75L159.63 111.59Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          fill="var(--skylcn-scene-cool)"
          fillOpacity=".35"
          stroke="var(--skylcn-scene-cool)"
          strokeWidth="0.8"
          d="M161.15 116.96C160.9 112.62 162.02 110.02 164 110.02C165.98 110.02 167.1 112.62 166.85 116.96"
        />
        <ellipse
          cx="164"
          cy="112.19"
          rx="1.3"
          ry="1.24"
          fill="var(--skylcn-scene-surface)"
          stroke="none"
        />
        <path stroke="var(--skylcn-scene-ink)" strokeWidth="0.8" d="M163.01 112H164.99" />
        <rect
          x="161.77"
          y="114.23"
          width="4.46"
          height="2.23"
          rx="0.25"
          fill="var(--skylcn-scene-surface)"
          stroke="var(--skylcn-scene-ink)"
          strokeWidth="0.8"
        />
      </g>
      <text
        x="173"
        y="114.6"
        fontSize="4.8"
        fill="var(--skylcn-scene-soft)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        GECEKODU
      </text>
      <path d="M158 140v10M198 140v10" strokeWidth="1.25" />
      <path d="M152 122H142v6" />
      <path
        className="skylcn-scene-drip"
        d="M142 130v6"
        stroke="var(--skylcn-scene-warm)"
        strokeWidth="1.2"
      />
      <g transform="translate(142 150)">
        <path d="M-11 0.6a11 2.4 0 0 0 22 0" strokeWidth="1.25" stroke="var(--skylcn-scene-soft)" />
        <path d="M-11 0.6a11 2 0 0 1 22 0" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
        <path
          d="M-5.2 -16Q-4.8 -10.5 -2.7 -8Q-4.9 -4.8 -3.6 -1H3.6Q4.9 -4.8 2.7 -8Q4.8 -10.5 5.2 -16Z"
          fill="var(--skylcn-scene-alert)"
          fillOpacity=".5"
          stroke="none"
        />
        <path
          strokeWidth="1.5"
          d="M-6 -19Q-5.4 -11 -2.8 -8Q-5.6 -4.6 -3.8 -0.6H3.8Q5.6 -4.6 2.8 -8Q5.4 -11 6 -19"
        />
        <path d="M2 -23L-1 -9" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
        <g strokeWidth="1.25" stroke="var(--skylcn-scene-soft)">
          <path className="skylcn-scene-puff" d="M-2.5 -22q-2.5-3 0-6t0-6" />
          <path className="skylcn-scene-puff skylcn-scene-d2" d="M3 -23q-2.5-3 0-6t0-6" />
        </g>
      </g>
      <g transform="translate(222 150)">
        <path d="M-11 0.6a11 2.4 0 0 0 22 0" strokeWidth="1.25" stroke="var(--skylcn-scene-soft)" />
        <path d="M-11 0.6a11 2 0 0 1 22 0" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
        <path
          d="M-5.2 -16Q-4.8 -10.5 -2.7 -8Q-4.9 -4.8 -3.6 -1H3.6Q4.9 -4.8 2.7 -8Q4.8 -10.5 5.2 -16Z"
          fill="var(--skylcn-scene-alert)"
          fillOpacity=".5"
          stroke="none"
        />
        <path
          strokeWidth="1.5"
          d="M-6 -19Q-5.4 -11 -2.8 -8Q-5.6 -4.6 -3.8 -0.6H3.8Q5.6 -4.6 2.8 -8Q5.4 -11 6 -19"
        />
        <path d="M2 -23L-1 -9" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      </g>
    </>
  );
}

/** B: An ALGOLAB AGC judge screen: two tests pass, the third gets TLE at 2000 ms, and a stopwatch ticks past the limit. */
function AlgolabTimeLimit() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      <rect x="12" y="18" width="160" height="112" rx="5" fill="var(--skylcn-scene-surface)" />
      <path d="M12 38H172" strokeWidth="1.25" />
      <g transform="translate(19 22) scale(0.78)" strokeWidth="1.6">
        <rect x="0" y="0" width="20" height="14" rx="1.5" fill="var(--skylcn-scene-surface)" />
        <path d="M10 14v3M6 17.5h8" />
        <path
          d="M10 2.6L14.3 5.1V9.9L10 12.4L5.7 9.9V5.1Z"
          fill="var(--skylcn-scene-ink)"
          stroke="none"
        />
        <path
          d="M11.6 6.1A2.2 2.2 0 1 0 11.6 8.9"
          stroke="var(--skylcn-scene-surface)"
          strokeWidth="1.41"
        />
        <path d="M20 4.5h3.5M20 9h3.5" stroke="var(--skylcn-scene-faint)" />
        <circle cx="25" cy="4.5" r="1.4" stroke="var(--skylcn-scene-faint)" />
        <circle cx="25" cy="9" r="1.4" stroke="var(--skylcn-scene-faint)" />
      </g>
      <text
        x="42"
        y="31.5"
        fontSize="7"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        ALGOLAB · AGC
      </text>
      <text
        x="20"
        y="50"
        fontSize="5.4"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        gönderen: sunucumuz
      </text>
      <g className="skylcn-scene-c1">
        <text
          x="20"
          y="66"
          fontSize="6"
          fill="var(--skylcn-scene-soft)"
          textAnchor="start"
          stroke="none"
        >
          test 1
        </text>
        <text
          x="110"
          y="66"
          fontSize="6.4"
          fill="var(--skylcn-scene-cool)"
          textAnchor="middle"
          stroke="none"
        >
          ✓
        </text>
        <text
          x="164"
          y="66"
          fontSize="5.6"
          fill="var(--skylcn-scene-faint)"
          textAnchor="end"
          stroke="none"
        >
          12 ms
        </text>
      </g>
      <g className="skylcn-scene-c3">
        <text
          x="20"
          y="80"
          fontSize="6"
          fill="var(--skylcn-scene-soft)"
          textAnchor="start"
          stroke="none"
        >
          test 2
        </text>
        <text
          x="110"
          y="80"
          fontSize="6.4"
          fill="var(--skylcn-scene-cool)"
          textAnchor="middle"
          stroke="none"
        >
          ✓
        </text>
        <text
          x="164"
          y="80"
          fontSize="5.6"
          fill="var(--skylcn-scene-faint)"
          textAnchor="end"
          stroke="none"
        >
          31 ms
        </text>
      </g>
      <g className="skylcn-scene-c5">
        <text
          x="20"
          y="94"
          fontSize="6"
          fill="var(--skylcn-scene-soft)"
          textAnchor="start"
          stroke="none"
        >
          test 3
        </text>
        <text
          x="110"
          y="94"
          fontSize="6.6"
          fill="var(--skylcn-scene-alert)"
          textAnchor="middle"
          fontWeight="700"
          stroke="none"
        >
          TLE
        </text>
        <text
          x="164"
          y="94"
          fontSize="5.6"
          fill="var(--skylcn-scene-alert)"
          textAnchor="end"
          fontWeight="700"
          stroke="none"
        >
          2000 ms
        </text>
      </g>
      <path d="M20 104H164" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <text
        x="20"
        y="118"
        fontSize="5.4"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        süre sınırı: 2 sn
      </text>
      <circle cx="200" cy="104" r="20" fill="var(--skylcn-scene-surface)" />
      <path d="M200 84v-6M195 77h10M215 89l4 -4" />
      <g transform="translate(200 104)">
        <g className="skylcn-scene-spin">
          <path
            d="M200 104V89"
            stroke="var(--skylcn-scene-alert)"
            strokeWidth="1.6"
            transform="translate(-200 -104)"
          />
        </g>
      </g>
      <circle cx="200" cy="104" r="1.8" fill="var(--skylcn-scene-ink)" stroke="none" />
    </>
  );
}

/**
 * The server does not answer: 502, 503, 504 or a timeout.
 *
 * - A: A server rack with one slot empty and a "çaya gittim" note; a dotted path leads to the GECEKODU tea urn.
 * - B: An ALGOLAB AGC judge screen: two tests pass, the third gets TLE at 2000 ms, and a stopwatch ticks past the limit.
 */
export function UnavailableScene(props: SceneProps<'unavailable'>) {
  return (
    <SceneFrame kind="unavailable" drawings={{ A: GoneForTea, B: AlgolabTimeLimit }} {...props} />
  );
}

/**
 * This kind's whole error page (ErrorScenePage) with its scene alone: what a client page
 * (error.tsx) imports to keep the other kinds' drawings out of its bundle.
 */
export function UnavailableScenePage(props: ErrorScenePageProps) {
  return <ScenePage kind="unavailable" Scene={UnavailableScene} {...props} />;
}
