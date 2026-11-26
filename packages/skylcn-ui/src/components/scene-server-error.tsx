import { ScenePage, type ErrorScenePageProps } from './scene-page.js';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: Under GECEKODU's banner the clock passes midnight: the server wears a swinging "MOLADA" sign beside a steaming takeaway and a bag with its receipt. */
function GecekoduBreak() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      {/* the GECEKODU banner */}
      <path d="M22 4L28 12M164 4L158 12" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <rect x="18" y="12" width="150" height="24" rx="3" fill="var(--skylcn-scene-surface)" />
      <g>
        <circle
          cx="33"
          cy="24"
          r="8.6"
          strokeWidth="1.25"
          stroke="var(--skylcn-scene-soft)"
          fill="var(--skylcn-scene-surface)"
        />
        <circle cx="28.7" cy="19.87" r="1.72" fill="var(--skylcn-scene-warm)" stroke="none" />
        <circle cx="29.47" cy="19.18" r="1.46" fill="var(--skylcn-scene-surface)" stroke="none" />
        <path
          d="M33.43 17.12L33.71 17.7L34.29 17.98L33.71 18.26L33.43 18.84L33.15 18.26L32.57 17.98L33.15 17.7Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M37.3 19.18L37.58 19.77L38.16 20.04L37.58 20.32L37.3 20.9L37.02 20.32L36.44 20.04L37.02 19.77Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M38.68 23.31L38.9 23.78L39.36 24L38.9 24.22L38.68 24.69L38.46 24.22L37.99 24L38.46 23.78Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M27.15 22.97L27.37 23.44L27.84 23.66L27.37 23.88L27.15 24.34L26.93 23.88L26.46 23.66L26.93 23.44Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          fill="var(--skylcn-scene-cool)"
          fillOpacity=".35"
          stroke="var(--skylcn-scene-cool)"
          strokeWidth="0.8"
          d="M29.04 30.88C28.7 24.86 30.25 21.25 33 21.25C35.75 21.25 37.3 24.86 36.96 30.88"
        />
        <ellipse
          cx="33"
          cy="24.26"
          rx="1.81"
          ry="1.72"
          fill="var(--skylcn-scene-surface)"
          stroke="none"
        />
        <path stroke="var(--skylcn-scene-ink)" strokeWidth="0.8" d="M31.62 24H34.38" />
        <rect
          x="29.9"
          y="27.1"
          width="6.19"
          height="3.1"
          rx="0.34"
          fill="var(--skylcn-scene-surface)"
          stroke="var(--skylcn-scene-ink)"
          strokeWidth="0.8"
        />
      </g>
      <text
        x="46"
        y="27.5"
        fontSize="8.4"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        GECEKODU
      </text>
      <text
        x="96"
        y="27"
        fontSize="5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        19:00 → 07:00
      </text>
      {/* the clock: midnight */}
      <circle cx="204" cy="30" r="16" fill="var(--skylcn-scene-surface)" />
      <path
        d="M204 17v3M204 40v3M191 30h3M214 30h3"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <path strokeWidth="2.2" d="M204 30L204 22" />
      <path strokeWidth="1.4" d="M204 30L204 17.52" />
      <g transform="translate(204 30)">
        <g className="skylcn-scene-spin">
          <path
            stroke="var(--skylcn-scene-alert)"
            strokeWidth="1"
            d="M204 30V17"
            transform="translate(-204 -30)"
          />
        </g>
      </g>
      <circle cx="204" cy="30" r="1.6" fill="var(--skylcn-scene-ink)" stroke="none" />
      <text
        x="204"
        y="56"
        fontSize="5"
        fill="var(--skylcn-scene-warm)"
        textAnchor="middle"
        stroke="none"
      >
        00:00 · YEMEK
      </text>
      {/* the server, with a "on a break" sign hung on a nail */}
      <rect x="104" y="62" width="40" height="88" rx="4" fill="var(--skylcn-scene-surface)" />
      <path d="M111 78.5H128" strokeWidth="1.25" />
      <circle cx="135" cy="78.5" r="1.8" fill="var(--skylcn-scene-faint)" stroke="none" />
      <path d="M111 95.5H128" strokeWidth="1.25" />
      <circle cx="135" cy="95.5" r="1.8" fill="var(--skylcn-scene-faint)" stroke="none" />
      <path d="M111 112.5H128" strokeWidth="1.25" />
      <circle cx="135" cy="112.5" r="1.8" fill="var(--skylcn-scene-faint)" stroke="none" />
      <path d="M111 129.5H128" strokeWidth="1.25" />
      <circle cx="135" cy="129.5" r="1.8" fill="var(--skylcn-scene-faint)" stroke="none" />
      <g transform="translate(124 70)">
        <g className="skylcn-scene-sway">
          <g transform="translate(-124 -70)">
            <path d="M124 70L104 94M124 70L144 94" strokeWidth="1.25" />
            <rect
              x="98"
              y="92"
              width="52"
              height="20"
              rx="2"
              stroke="var(--skylcn-scene-warm)"
              strokeWidth="1.4"
              fill="var(--skylcn-scene-surface)"
            />
            <text
              x="124"
              y="105.5"
              fontSize="7.4"
              fill="var(--skylcn-scene-warm)"
              textAnchor="middle"
              fontWeight="700"
              stroke="none"
            >
              MOLADA
            </text>
          </g>
        </g>
      </g>
      <circle cx="124" cy="70" r="1.8" fill="var(--skylcn-scene-ink)" stroke="none" />
      {/* a takeaway box */}
      <path d="M48 150L44 128H90L86 150Z" fill="var(--skylcn-scene-surface)" />
      <path d="M44 128L50 120H84L90 128M60 120V128M74 120V128" strokeWidth="1.25" />
      <g strokeWidth="1.25" stroke="var(--skylcn-scene-soft)">
        <path className="skylcn-scene-puff" d="M58 116q-3-4 0-8t0-8" />
        <path className="skylcn-scene-puff skylcn-scene-d2" d="M68 116q-3-4 0-8t0-8" />
        <path className="skylcn-scene-puff skylcn-scene-d1" d="M78 116q-3-4 0-8t0-8" />
      </g>
      {/* the delivery bag, its receipt at 00:14 */}
      <path d="M160 150L163 106H195L198 150Z" fill="var(--skylcn-scene-surface)" />
      <path d="M171 106V100A8 7 0 0 1 187 100V106" />
      <rect
        x="169"
        y="116"
        width="20"
        height="18"
        rx="1"
        strokeWidth="1.25"
        fill="var(--skylcn-scene-surface)"
      />
      <text
        x="179"
        y="123.5"
        fontSize="4.2"
        fill="var(--skylcn-scene-soft)"
        textAnchor="middle"
        stroke="none"
      >
        sipariş
      </text>
      <text
        x="179"
        y="130.5"
        fontSize="5"
        fill="var(--skylcn-scene-ink)"
        textAnchor="middle"
        fontWeight="700"
        stroke="none"
      >
        00:14
      </text>
    </>
  );
}

/** B: A server smoking beside a dropped screwdriver, tagged "bozan: biz"; your cursor waits far off, clean. */
function SmokingServer() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      {/* the smoking server */}
      <rect x="84" y="54" width="54" height="96" rx="4" fill="var(--skylcn-scene-surface)" />
      <path d="M91 71.5H122" strokeWidth="1.25" />
      <circle
        className="skylcn-scene-blink"
        cx="129"
        cy="71.5"
        r="1.8"
        fill="var(--skylcn-scene-alert)"
        stroke="none"
      />
      <path d="M91 90.5H122" strokeWidth="1.25" />
      <circle cx="129" cy="90.5" r="1.8" fill="var(--skylcn-scene-alert)" stroke="none" />
      <path d="M91 109.5H122" strokeWidth="1.25" />
      <circle cx="129" cy="109.5" r="1.8" fill="var(--skylcn-scene-alert)" stroke="none" />
      <path d="M91 128.5H122" strokeWidth="1.25" />
      <circle cx="129" cy="128.5" r="1.8" fill="var(--skylcn-scene-alert)" stroke="none" />
      <path stroke="var(--skylcn-scene-alert)" d="M98 86l6 6-4 3 6 7" strokeWidth="1.25" />
      <g strokeWidth="1.25" stroke="var(--skylcn-scene-soft)">
        <path className="skylcn-scene-puff" d="M98 50q-4-5 0-10t0-10" />
        <path className="skylcn-scene-puff skylcn-scene-d2" d="M110 50q-4-5 0-10t0-10" />
        <path className="skylcn-scene-puff skylcn-scene-d1" d="M122 50q-4-5 0-10t0-10" />
      </g>
      {/* a dropped screwdriver */}
      <path d="M146 148l20-8" strokeWidth="1.25" />
      <rect
        x="164"
        y="134"
        width="16"
        height="7"
        rx="3"
        transform="rotate(-22 172 137)"
        fill="var(--skylcn-scene-surface)"
      />
      {/* your cursor, far away and clean */}
      <path
        strokeDasharray="2 3"
        d="M60 60V150"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <g className="skylcn-scene-bob">
        <path
          transform="translate(24 92)"
          strokeWidth="1.5"
          d="M0 0L0 15L4 11L7 17.5L9.5 16.3L6.6 10H12Z"
          fill="var(--skylcn-scene-surface)"
        />
      </g>
      <rect
        x="14"
        y="120"
        width="40"
        height="14"
        rx="7"
        stroke="var(--skylcn-scene-cool)"
        strokeWidth="1.25"
        fill="var(--skylcn-scene-surface)"
      />
      <text
        x="34"
        y="129.5"
        fontSize="5.6"
        fill="var(--skylcn-scene-cool)"
        textAnchor="middle"
        fontWeight="700"
        stroke="none"
      >
        sen ✓
      </text>
      <rect
        x="170"
        y="36"
        width="56"
        height="16"
        rx="8"
        stroke="var(--skylcn-scene-alert)"
        strokeWidth="1.25"
        fill="var(--skylcn-scene-surface)"
      />
      <text
        x="198"
        y="46.5"
        fontSize="5.6"
        fill="var(--skylcn-scene-alert)"
        textAnchor="middle"
        fontWeight="700"
        stroke="none"
      >
        bozan: biz
      </text>
      <path d="M170 50L144 64" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
    </>
  );
}

/**
 * 500, an unexpected server error.
 *
 * - A: Under GECEKODU's banner the clock passes midnight: the server wears a swinging "MOLADA" sign beside a steaming takeaway and a bag with its receipt.
 * - B: A server smoking beside a dropped screwdriver, tagged "bozan: biz"; your cursor waits far off, clean.
 */
export function ServerErrorScene(props: SceneProps<'error'>) {
  return <SceneFrame kind="error" drawings={{ A: GecekoduBreak, B: SmokingServer }} {...props} />;
}

/**
 * This kind's whole error page (ErrorScenePage) with its scene alone: what a client page
 * (error.tsx) imports to keep the other kinds' drawings out of its bundle.
 */
export function ServerErrorScenePage(props: ErrorScenePageProps) {
  return <ScenePage kind="error" Scene={ServerErrorScene} {...props} />;
}
