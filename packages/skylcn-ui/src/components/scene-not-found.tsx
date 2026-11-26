import { ScenePage, type ErrorScenePageProps } from './scene-page.js';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: GECEKODU at 03:47 on a Friday night: `cd sayfa` answers 404 and the page drifts off the desk. */
function GecekoduSmallHours() {
  return (
    <>
      <path d="M10 146H230" stroke="var(--skylcn-scene-soft)" />
      {/* the window: night, a crescent moon */}
      <rect x="14" y="14" width="46" height="36" rx="3" fill="var(--skylcn-scene-surface)" />
      <path d="M37 14V50M14 32H60" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <circle cx="27" cy="24" r="5" fill="var(--skylcn-scene-warm)" stroke="none" />
      <circle cx="29.5" cy="22.4" r="4.4" fill="var(--skylcn-scene-surface)" stroke="none" />
      <path
        className="skylcn-scene-tw"
        d="M50 20.2L50.58 21.42L51.8 22L50.58 22.58L50 23.8L49.42 22.58L48.2 22L49.42 21.42Z"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />
      <path
        className="skylcn-scene-tw skylcn-scene-d2"
        d="M46 40.6L46.45 41.55L47.4 42L46.45 42.45L46 43.4L45.55 42.45L44.6 42L45.55 41.55Z"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />
      {/* the wall clock: Friday night, 03:47 */}
      <text
        x="196"
        y="19"
        fontSize="5.5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        letterSpacing=".8"
        stroke="none"
      >
        CUMA GECESİ
      </text>
      <rect x="168" y="24" width="56" height="24" rx="5" fill="var(--skylcn-scene-surface)" />
      <text
        x="196"
        y="41"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="var(--skylcn-scene-ink)"
        stroke="none"
      >
        03<tspan className="skylcn-scene-blink">:</tspan>47
      </text>
      {/* the laptop: 404 */}
      <rect x="88" y="64" width="90" height="72" rx="5" fill="var(--skylcn-scene-surface)" />
      <rect
        x="93"
        y="69"
        width="80"
        height="62"
        rx="2"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <rect
        className="skylcn-scene-glow"
        x="93"
        y="69"
        width="80"
        height="62"
        rx="2"
        stroke="none"
        fill="var(--skylcn-scene-cool)"
        fillOpacity="0.08"
      />
      <text
        x="98"
        y="80"
        fontSize="6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="start"
        stroke="none"
      >
        $ cd sayfa
      </text>
      <g className="skylcn-scene-type">
        <text
          x="133"
          y="110"
          fontSize="23"
          fill="var(--skylcn-scene-alert)"
          textAnchor="middle"
          fontWeight="700"
          stroke="none"
        >
          404
        </text>
        <text
          x="133"
          y="122"
          fontSize="5.4"
          fill="var(--skylcn-scene-soft)"
          textAnchor="middle"
          stroke="none"
        >
          bulunamadı
        </text>
      </g>
      <path d="M80 136H186L193 145H73Z" fill="var(--skylcn-scene-surface)" />
      <path d="M122 140.5H144" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      {/* the page that goes missing */}
      <g className="skylcn-scene-fly">
        <g transform="translate(182 60) rotate(14)">
          <path
            strokeDasharray="2 2"
            d="M0 0H10L14 4V18H0Z"
            strokeWidth="1.25"
            stroke="var(--skylcn-scene-soft)"
            fill="var(--skylcn-scene-surface)"
          />
          <path d="M3 7h7M3 11h7M3 15h5" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
        </g>
      </g>
      {/* the GECEKODU name card and a glass of tea */}
      <g>
        <path d="M4 146L7 120H69L72 146Z" fill="var(--skylcn-scene-surface)" />
        <g>
          <circle
            cx="20"
            cy="133"
            r="9.5"
            strokeWidth="1.25"
            stroke="var(--skylcn-scene-soft)"
            fill="var(--skylcn-scene-surface)"
          />
          <circle cx="15.25" cy="128.44" r="1.9" fill="var(--skylcn-scene-warm)" stroke="none" />
          <circle
            cx="16.11"
            cy="127.68"
            r="1.62"
            fill="var(--skylcn-scene-surface)"
            stroke="none"
          />
          <path
            d="M20.48 125.4L20.78 126.05L21.43 126.35L20.78 126.65L20.48 127.3L20.17 126.65L19.53 126.35L20.17 126.05Z"
            fill="var(--skylcn-scene-warm)"
            stroke="none"
          />
          <path
            d="M24.75 127.68L25.05 128.33L25.7 128.63L25.05 128.93L24.75 129.58L24.45 128.93L23.8 128.63L24.45 128.33Z"
            fill="var(--skylcn-scene-warm)"
            stroke="none"
          />
          <path
            d="M26.27 132.24L26.51 132.76L27.03 133L26.51 133.24L26.27 133.76L26.03 133.24L25.51 133L26.03 132.76Z"
            fill="var(--skylcn-scene-warm)"
            stroke="none"
          />
          <path
            d="M13.54 131.86L13.78 132.38L14.3 132.62L13.78 132.86L13.54 133.38L13.3 132.86L12.78 132.62L13.3 132.38Z"
            fill="var(--skylcn-scene-warm)"
            stroke="none"
          />
          <path
            fill="var(--skylcn-scene-cool)"
            fillOpacity=".35"
            stroke="var(--skylcn-scene-cool)"
            strokeWidth="0.8"
            d="M15.63 140.6C15.25 133.95 16.96 129.96 20 129.96C23.04 129.96 24.75 133.95 24.37 140.6"
          />
          <ellipse
            cx="20"
            cy="133.29"
            rx="2"
            ry="1.9"
            fill="var(--skylcn-scene-surface)"
            stroke="none"
          />
          <path stroke="var(--skylcn-scene-ink)" strokeWidth="0.8" d="M18.48 133H21.52" />
          <rect
            x="16.58"
            y="136.42"
            width="6.84"
            height="3.42"
            rx="0.38"
            fill="var(--skylcn-scene-surface)"
            stroke="var(--skylcn-scene-ink)"
            strokeWidth="0.8"
          />
        </g>
        <text
          x="33"
          y="132.5"
          fontSize="6.2"
          fill="var(--skylcn-scene-ink)"
          textAnchor="start"
          fontWeight="700"
          stroke="none"
        >
          GECEKODU
        </text>
        <text
          x="33"
          y="140"
          fontSize="4.3"
          fill="var(--skylcn-scene-faint)"
          textAnchor="start"
          stroke="none"
        >
          19:00 → 07:00
        </text>
      </g>
      <g transform="translate(208 146)">
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
    </>
  );
}

/** B: A browser window on yildizskylab.com/sayfa with an empty old spot; the page slides away in a box marked WEBLAB. */
function MovedByWeblab() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      <rect x="14" y="14" width="130" height="96" rx="5" fill="var(--skylcn-scene-surface)" />
      <path d="M14 26H144" strokeWidth="1.25" />
      <circle cx="21" cy="20" r="1.5" fill="var(--skylcn-scene-soft)" stroke="none" />
      <circle cx="26.5" cy="20" r="1.5" fill="var(--skylcn-scene-soft)" stroke="none" />
      <circle cx="32" cy="20" r="1.5" fill="var(--skylcn-scene-soft)" stroke="none" />
      <rect
        x="40"
        y="16.5"
        width="96"
        height="7"
        rx="3.5"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <text
        x="88"
        y="21.8"
        fontSize="4.6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="middle"
        stroke="none"
      >
        yildizskylab.com/sayfa
      </text>
      <rect
        x="42"
        y="40"
        width="74"
        height="52"
        rx="2"
        strokeDasharray="3 3"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <text
        x="79"
        y="64"
        fontSize="5.6"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        stroke="none"
      >
        eski yer
      </text>
      <text
        x="79"
        y="74"
        fontSize="5.6"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        stroke="none"
      >
        boş
      </text>
      <text
        x="20"
        y="104"
        fontSize="5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        haber: —
      </text>
      {/* the moved page: a box with WEBLAB on it */}
      <g className="skylcn-scene-slide">
        <rect x="150" y="92" width="74" height="58" rx="2" fill="var(--skylcn-scene-surface)" />
        <path d="M150 104H224M187 92V104" strokeWidth="1.25" />
        <path
          d="M150 92L142 84M224 92L232 84"
          strokeWidth="1.25"
          stroke="var(--skylcn-scene-faint)"
        />
        <text
          x="168"
          y="100.5"
          fontSize="5"
          fill="var(--skylcn-scene-soft)"
          textAnchor="middle"
          stroke="none"
        >
          sayfa
        </text>
        <g transform="translate(187 127) scale(0.62)" strokeWidth="2.26">
          <circle r="16" fill="var(--skylcn-scene-surface)" />
          <path d="M-14 -7Q0 -4 14 -7M-14 7Q0 10 14 7M0 -16V16" stroke="var(--skylcn-scene-soft)" />
          <ellipse rx="8" ry="16" stroke="var(--skylcn-scene-soft)" />
          <rect
            x="-24"
            y="-5.5"
            width="48"
            height="11"
            rx="2.5"
            stroke="var(--skylcn-scene-brand)"
            fill="var(--skylcn-scene-surface)"
          />
          <text
            x="0"
            y="2.2"
            fontSize="6.2"
            fill="var(--skylcn-scene-brand)"
            textAnchor="middle"
            fontWeight="700"
            stroke="none"
          >
            {'<weblab/>'}
          </text>
          <path
            stroke="var(--skylcn-scene-brand)"
            d="M-30 -16q-4 0-4 4v6q0 6-4 6q4 0 4 6v6q0 4 4 4M30 -16q4 0 4 4v6q0 6 4 6q-4 0-4 6v6q0 4-4 4"
          />
        </g>
      </g>
      <path
        strokeDasharray="2 3"
        d="M120 120Q134 112 144 118"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-soft)"
      />
      <path d="M140 114l5 4-5 3" strokeWidth="1.25" stroke="var(--skylcn-scene-soft)" />
    </>
  );
}

/** C: A link cut short by scissors, its tail falling away, and a message asking the sender for it again. */
function CutLink() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      {/* the link, cut short by scissors */}
      <rect x="14" y="44" width="122" height="20" rx="10" fill="var(--skylcn-scene-surface)" />
      <path
        d="M24 50.5a3 3 0 0 1 4.2 0l1.4 1.4a3 3 0 0 1 0 4.2M27 57.5a3 3 0 0 1 -4.2 0l-1.4 -1.4a3 3 0 0 1 0 -4.2"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-soft)"
      />
      <text
        x="36"
        y="57"
        fontSize="6.2"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        stroke="none"
      >
        yildizskylab.com/etk
      </text>
      <path
        stroke="var(--skylcn-scene-alert)"
        strokeDasharray="2 2"
        d="M138 40V68"
        strokeWidth="1.25"
      />
      <g className="skylcn-scene-fall">
        <g transform="rotate(18 168 54)">
          <path d="M142 44H178a10 10 0 0 1 0 20H142Z" fill="var(--skylcn-scene-surface)" />
          <text
            x="146"
            y="57"
            fontSize="6.2"
            fill="var(--skylcn-scene-faint)"
            textAnchor="start"
            stroke="none"
          >
            inlik/43
          </text>
        </g>
      </g>
      {/* the scissors */}
      <g transform="translate(138 82)">
        <g className="skylcn-scene-snip">
          <path d="M0 0L-6 -26L0 -6Z" fill="var(--skylcn-scene-surface)" />
          <path d="M0 0L6 -26L0 -6Z" fill="var(--skylcn-scene-surface)" />
          <circle cx="-6" cy="10" r="6" fill="var(--skylcn-scene-surface)" />
          <circle cx="6" cy="10" r="6" fill="var(--skylcn-scene-surface)" />
          <path d="M-3 5L0 0L3 5" strokeWidth="1.25" />
        </g>
      </g>
      {/* a message to the sender */}
      <rect x="22" y="100" width="96" height="34" rx="8" fill="var(--skylcn-scene-surface)" />
      <path d="M34 134l-4 9 12-9" fill="var(--skylcn-scene-surface)" />
      <text
        x="30"
        y="114"
        fontSize="5.6"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        stroke="none"
      >
        bağlantının sonu
      </text>
      <text
        x="30"
        y="124"
        fontSize="5.6"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        stroke="none"
      >
        kesilmiş, yeniden at?
      </text>
      <g className="skylcn-scene-sig1">
        <circle cx="186" cy="124" r="2" fill="var(--skylcn-scene-soft)" stroke="none" />
      </g>
      <g className="skylcn-scene-sig2">
        <circle cx="194" cy="124" r="2" fill="var(--skylcn-scene-soft)" stroke="none" />
      </g>
      <g className="skylcn-scene-sig3">
        <circle cx="202" cy="124" r="2" fill="var(--skylcn-scene-soft)" stroke="none" />
      </g>
      <rect
        x="174"
        y="112"
        width="40"
        height="24"
        rx="8"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
    </>
  );
}

/**
 * 404, page not found.
 *
 * - A: GECEKODU at 03:47 on a Friday night: `cd sayfa` answers 404 and the page drifts off the desk.
 * - B: A browser window on yildizskylab.com/sayfa with an empty old spot; the page slides away in a box marked WEBLAB.
 * - C: A link cut short by scissors, its tail falling away, and a message asking the sender for it again.
 */
export function NotFoundScene(props: SceneProps<'notFound'>) {
  return (
    <SceneFrame
      kind="notFound"
      drawings={{ A: GecekoduSmallHours, B: MovedByWeblab, C: CutLink }}
      {...props}
    />
  );
}

/**
 * This kind's whole error page (ErrorScenePage) with its scene alone: what a client page
 * (error.tsx) imports to keep the other kinds' drawings out of its bundle.
 */
export function NotFoundScenePage(props: ErrorScenePageProps) {
  return <ScenePage kind="notFound" Scene={NotFoundScene} {...props} />;
}
