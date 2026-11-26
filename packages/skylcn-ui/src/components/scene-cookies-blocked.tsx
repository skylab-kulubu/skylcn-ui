import { ScenePage, type ErrorScenePageProps } from './scene-page.js';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: A sign-in window with cookies switched off, and in the middle of the GECEKODU table an empty plate. */
function EmptyPlate() {
  return (
    <>
      <path d="M10 146H230" stroke="var(--skylcn-scene-soft)" />
      <rect x="58" y="12" width="124" height="76" rx="5" fill="var(--skylcn-scene-surface)" />
      <path d="M58 24H182" strokeWidth="1.25" />
      <circle cx="65" cy="18" r="1.5" fill="var(--skylcn-scene-soft)" stroke="none" />
      <circle cx="70.5" cy="18" r="1.5" fill="var(--skylcn-scene-soft)" stroke="none" />
      <circle cx="76" cy="18" r="1.5" fill="var(--skylcn-scene-soft)" stroke="none" />
      <rect
        x="84"
        y="14.5"
        width="90"
        height="7"
        rx="3.5"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <text
        x="129"
        y="19.8"
        fontSize="4.6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="middle"
        stroke="none"
      >
        giriş
      </text>
      <text
        x="70"
        y="42"
        fontSize="6.4"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        stroke="none"
      >
        çerezler
      </text>
      <rect x="138" y="35" width="28" height="12" rx="6" strokeWidth="1.25" />
      <circle cx="144" cy="41" r="3.8" fill="var(--skylcn-scene-alert)" stroke="none" />
      <text
        x="70"
        y="56"
        fontSize="5.4"
        fill="var(--skylcn-scene-alert)"
        textAnchor="start"
        stroke="none"
      >
        kapalı
      </text>
      <rect
        x="70"
        y="64"
        width="100"
        height="14"
        rx="3"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <text
        x="120"
        y="73.5"
        fontSize="5.6"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        stroke="none"
      >
        giriş yap
      </text>
      {/* the middle of the table: an empty plate */}
      <ellipse cx="124" cy="138" rx="34" ry="7" fill="var(--skylcn-scene-surface)" />
      <ellipse
        cx="124"
        cy="137"
        rx="22"
        ry="4"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <circle cx="116" cy="137" r=".9" fill="var(--skylcn-scene-soft)" stroke="none" />
      <circle cx="130" cy="138" r=".8" fill="var(--skylcn-scene-soft)" stroke="none" />
      <circle cx="124" cy="136" r=".7" fill="var(--skylcn-scene-soft)" stroke="none" />
      <text
        x="124"
        y="118"
        fontSize="5.4"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        stroke="none"
      >
        ortada: —
      </text>
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

/** B: Settings › Privacy: the cursor turns "çerezlere izin ver" on. */
function PrivacySetting() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      <rect x="22" y="18" width="196" height="118" rx="6" fill="var(--skylcn-scene-surface)" />
      <path d="M22 36H218" strokeWidth="1.25" />
      <g transform="translate(34 27)">
        <circle r="3.2" strokeWidth="1.25" />
        <path
          d="M0 -6V-4.4M0 4.4V6M-6 0H-4.4M4.4 0H6M-4.2 -4.2l1.1 1.1M3.1 3.1l1.1 1.1M-4.2 4.2l1.1-1.1M3.1 -3.1l1.1-1.1"
          strokeWidth="1.25"
        />
      </g>
      <text
        x="44"
        y="30"
        fontSize="6"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        Ayarlar › Gizlilik
      </text>
      <text
        x="34"
        y="58"
        fontSize="6.2"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        stroke="none"
      >
        çerezlere izin ver
      </text>
      <rect x="170" y="50" width="30" height="13" rx="6.5" strokeWidth="1.25" />
      <rect
        className="skylcn-scene-toggle-on"
        x="170"
        y="50"
        width="30"
        height="13"
        rx="6.5"
        fill="var(--skylcn-scene-brand)"
        stroke="var(--skylcn-scene-brand)"
        opacity="0"
      />
      <g className="skylcn-scene-toggle-knob">
        <circle cx="176.5" cy="56.5" r="4.2" strokeWidth="1.5" fill="var(--skylcn-scene-surface)" />
      </g>
      <text
        x="34"
        y="70"
        fontSize="4.8"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        girişi hatırlamak için gerekli
      </text>
      <path d="M34 82H206" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <text
        x="34"
        y="98"
        fontSize="6"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        konum
      </text>
      <rect
        x="170"
        y="90"
        width="30"
        height="13"
        rx="6.5"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <circle cx="176.5" cy="96.5" r="4.2" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <text
        x="34"
        y="120"
        fontSize="6"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        bildirimler
      </text>
      <rect
        x="170"
        y="112"
        width="30"
        height="13"
        rx="6.5"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <circle cx="176.5" cy="118.5" r="4.2" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <g className="skylcn-scene-toggle-cursor">
        <path
          transform="translate(196 68)"
          strokeWidth="1.5"
          d="M0 0L0 15L4 11L7 17.5L9.5 16.3L6.6 10H12Z"
          fill="var(--skylcn-scene-surface)"
        />
      </g>
    </>
  );
}

/**
 * Cookies blocked, so signing in cannot work.
 *
 * - A: A sign-in window with cookies switched off, and in the middle of the GECEKODU table an empty plate.
 * - B: Settings › Privacy: the cursor turns "çerezlere izin ver" on.
 */
export function CookiesBlockedScene(props: SceneProps<'cookiesBlocked'>) {
  return (
    <SceneFrame kind="cookiesBlocked" drawings={{ A: EmptyPlate, B: PrivacySetting }} {...props} />
  );
}

/**
 * This kind's whole error page (ErrorScenePage) with its scene alone: what a client page
 * (error.tsx) imports to keep the other kinds' drawings out of its bundle.
 */
export function CookiesBlockedScenePage(props: ErrorScenePageProps) {
  return <ScenePage kind="cookiesBlocked" Scene={CookiesBlockedScene} {...props} />;
}
