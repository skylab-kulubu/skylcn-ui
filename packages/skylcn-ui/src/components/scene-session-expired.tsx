import { useId } from 'react';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: GECEKODU's Awareness Project: the laptop left open at the next desk has its screen turned upside down and a "kilitle :)" note; yours only shows the session closed. */
function GecekoduPrank() {
  return (
    <>
      <path d="M10 138H230" stroke="var(--skylcn-scene-soft)" />
      {/* the GECEKODU banner with the Awareness Project's motto */}
      <path d="M50 6L56 14M190 6L184 14" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <rect x="46" y="14" width="148" height="26" rx="3" fill="var(--skylcn-scene-surface)" />
      <g>
        <circle
          cx="60"
          cy="27"
          r="9"
          strokeWidth="1.25"
          stroke="var(--skylcn-scene-soft)"
          fill="var(--skylcn-scene-surface)"
        />
        <circle cx="55.5" cy="22.68" r="1.8" fill="var(--skylcn-scene-warm)" stroke="none" />
        <circle cx="56.31" cy="21.96" r="1.53" fill="var(--skylcn-scene-surface)" stroke="none" />
        <path
          d="M60.45 19.8L60.74 20.41L61.35 20.7L60.74 20.99L60.45 21.6L60.16 20.99L59.55 20.7L60.16 20.41Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M64.5 21.96L64.79 22.57L65.4 22.86L64.79 23.15L64.5 23.76L64.21 23.15L63.6 22.86L64.21 22.57Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M65.94 26.28L66.17 26.77L66.66 27L66.17 27.23L65.94 27.72L65.71 27.23L65.22 27L65.71 26.77Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          d="M53.88 25.92L54.11 26.41L54.6 26.64L54.11 26.87L53.88 27.36L53.65 26.87L53.16 26.64L53.65 26.41Z"
          fill="var(--skylcn-scene-warm)"
          stroke="none"
        />
        <path
          fill="var(--skylcn-scene-cool)"
          fillOpacity=".35"
          stroke="var(--skylcn-scene-cool)"
          strokeWidth="0.8"
          d="M55.86 34.2C55.5 27.9 57.12 24.12 60 24.12C62.88 24.12 64.5 27.9 64.14 34.2"
        />
        <ellipse
          cx="60"
          cy="27.27"
          rx="1.89"
          ry="1.8"
          fill="var(--skylcn-scene-surface)"
          stroke="none"
        />
        <path stroke="var(--skylcn-scene-ink)" strokeWidth="0.8" d="M58.56 27H61.44" />
        <rect
          x="56.76"
          y="30.24"
          width="6.48"
          height="3.24"
          rx="0.36"
          fill="var(--skylcn-scene-surface)"
          stroke="var(--skylcn-scene-ink)"
          strokeWidth="0.8"
        />
      </g>
      <text
        x="74"
        y="26.5"
        fontSize="7.6"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        GECEKODU
      </text>
      <text
        x="74"
        y="35"
        fontSize="4.4"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        kilidi açık bırakma, biz buluruz
      </text>
      {/* the next desk: left unlocked, its screen turned upside down */}
      <rect x="18" y="70" width="78" height="58" rx="5" fill="var(--skylcn-scene-surface)" />
      <rect
        x="23"
        y="75"
        width="68"
        height="48"
        rx="2"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <g transform="translate(57 99)">
        <g className="skylcn-scene-wob">
          <g transform="translate(-57 -99)">
            <g transform="rotate(180 57 99)">
              <path d="M27 121H87" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
              <g fill="var(--skylcn-scene-soft)" stroke="none">
                <rect x="30" y="80" width="7" height="6" rx="1" />
                <rect x="30" y="90" width="7" height="6" rx="1" />
                <rect x="41" y="80" width="7" height="6" rx="1" />
              </g>
              <text
                x="66"
                y="106"
                fontSize="8.4"
                fill="var(--skylcn-scene-ink)"
                textAnchor="middle"
                fontWeight="700"
                stroke="none"
              >
                SKY LAB
              </text>
            </g>
          </g>
        </g>
      </g>
      <path d="M10 128H104L111 137H3Z" fill="var(--skylcn-scene-surface)" />
      <path d="M46 132.5H68" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <path stroke="var(--skylcn-scene-warm)" d="M30 64q24-14 48 0" strokeWidth="1.25" />
      <path stroke="var(--skylcn-scene-warm)" d="M74 59l4 5-6 1" strokeWidth="1.25" />
      <g transform="rotate(10 92 59.5)">
        <rect
          x="76"
          y="52"
          width="32"
          height="15"
          rx="1.2"
          stroke="var(--skylcn-scene-warm)"
          strokeWidth="1.25"
          fill="var(--skylcn-scene-surface)"
        />
        <text
          x="92"
          y="59.5"
          fontSize="4.8"
          fill="var(--skylcn-scene-warm)"
          textAnchor="middle"
          fontWeight="700"
          stroke="none"
        >
          kilitle :)
        </text>
      </g>
      {/* your laptop: only the session closed */}
      <rect x="144" y="70" width="78" height="58" rx="5" fill="var(--skylcn-scene-surface)" />
      <rect
        x="149"
        y="75"
        width="68"
        height="48"
        rx="2"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <g>
        <g transform="translate(183 88) scale(0.5)" strokeWidth="4">
          <path className="skylcn-scene-shackle" d="M-8 0V-6a8 8 0 0 1 16 0V0" />
          <rect x="-13" y="0" width="26" height="20" rx="3.5" fill="var(--skylcn-scene-surface)" />
          <circle cx="0" cy="8" r="2" fill="var(--skylcn-scene-ink)" stroke="none" />
          <path strokeWidth="2.5" d="M0 10v4" />
        </g>
      </g>
      <text
        x="183"
        y="108"
        fontSize="5.2"
        fill="var(--skylcn-scene-soft)"
        textAnchor="middle"
        stroke="none"
      >
        oturum kapandı
      </text>
      <rect
        x="165"
        y="112"
        width="36"
        height="9"
        rx="2"
        stroke="var(--skylcn-scene-brand)"
        strokeWidth="1.25"
      />
      <text
        x="183"
        y="118.5"
        fontSize="4.8"
        fill="var(--skylcn-scene-brand)"
        textAnchor="middle"
        fontWeight="700"
        stroke="none"
      >
        giriş yap
      </text>
      <path d="M136 128H230L237 137H129Z" fill="var(--skylcn-scene-surface)" />
      <path d="M172 132.5H194" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <text
        x="57"
        y="156"
        fontSize="5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        stroke="none"
      >
        açık bırakılan
      </text>
      <text
        x="183"
        y="156"
        fontSize="5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        stroke="none"
      >
        senin
      </text>
    </>
  );
}

/** B: The ARTLAB robot asleep beside a locked laptop, z's drifting up. */
function ArtlabAsleep() {
  return (
    <>
      <path d="M10 152H230" stroke="var(--skylcn-scene-soft)" />
      <g className="skylcn-scene-breathe">
        <g transform="translate(10 66) scale(0.8)" strokeWidth="2">
          <g fill="var(--skylcn-scene-surface)">
            <path d="M58 104Q48 92 54 80l4 4q-4 8 0 20z" />
            <path d="M62 104q10-12 4-24l-4 4q4 8 0 20z" />
            <rect x="34" y="96" width="18" height="11" rx="4" />
            <rect x="68" y="96" width="18" height="11" rx="4" />
          </g>
          <circle cx="60" cy="80" r="2.6" fill="var(--skylcn-scene-warm)" stroke="none" />
          <path
            d="M39 99.5v4M43 99.5v4M47 99.5v4M73 99.5v4M77 99.5v4M81 99.5v4"
            strokeWidth="1.3"
            opacity=".55"
          />
          <circle cx="60" cy="48" r="30" fill="var(--skylcn-scene-surface)" />
          <path d="M36.6 39Q60 23.4 83.4 39" strokeWidth="1.3" opacity=".5" />
          <circle cx="31.2" cy="50.4" r="9" fill="var(--skylcn-scene-surface)" />
          <circle cx="31.2" cy="50.4" r="3.9" stroke="var(--skylcn-scene-warm)" strokeWidth="1.3" />
          <circle cx="88.8" cy="50.4" r="9" fill="var(--skylcn-scene-surface)" />
          <circle cx="88.8" cy="50.4" r="3.9" stroke="var(--skylcn-scene-warm)" strokeWidth="1.3" />
          <circle cx="60" cy="51" r="14.1" strokeWidth="1.5" fill="var(--skylcn-scene-surface)" />
          <path d="M50 52Q60 58 70 52" stroke="var(--skylcn-scene-cool)" strokeWidth="2" />
        </g>
      </g>
      <g fill="var(--skylcn-scene-brand)" stroke="none" fontWeight="700">
        <text className="skylcn-scene-drift" x="84" y="78" fontSize="9">
          z
        </text>
        <text className="skylcn-scene-drift skylcn-scene-d1" x="94" y="64" fontSize="11">
          z
        </text>
        <text className="skylcn-scene-drift skylcn-scene-d2" x="106" y="48" fontSize="14">
          Z
        </text>
      </g>
      <rect x="136" y="86" width="80" height="56" rx="4" fill="var(--skylcn-scene-surface)" />
      <rect
        x="141"
        y="91"
        width="70"
        height="46"
        rx="2"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <path d="M168 112V107a8 8 0 0 1 16 0V112" />
      <rect x="164" y="112" width="24" height="17" rx="3" fill="var(--skylcn-scene-surface)" />
      <circle cx="176" cy="119" r="1.8" fill="var(--skylcn-scene-ink)" stroke="none" />
      <path d="M176 121v3" strokeWidth="1.25" />
      <path d="M128 142H224L228 150H124Z" fill="var(--skylcn-scene-surface)" />
      <path
        className="skylcn-scene-tw"
        d="M150 27L150.84 29.16L153 30L150.84 30.84L150 33L149.16 30.84L147 30L149.16 29.16Z"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />
      <path
        className="skylcn-scene-tw skylcn-scene-d1"
        d="M214 43.6L214.67 45.33L216.4 46L214.67 46.67L214 48.4L213.33 46.67L211.6 46L213.33 45.33Z"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />
    </>
  );
}

const FILE = 'M0 0h4.5l2.5 2.5v6.5h-7z';
const FOLD = 'M4.5 0v2.5h2.5';
// The fake dialog; the file icons leave it room
const DIALOG = { x: 78, y: 58, w: 84, h: 34 };

/** The desktop's file icons, row by row, skipping the ones under the dialog. */
const ICONS = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 11 }, (_, col) => ({ x: 58 + col * 12, y: 36 + row * 17 })).filter(
    ({ x, y }) =>
      x + 7 < DIALOG.x - 2 ||
      x > DIALOG.x + DIALOG.w + 2 ||
      y + 9 < DIALOG.y - 2 ||
      y > DIALOG.y + DIALOG.h + 2,
  ),
);

/** C: A laptop left unlocked at GECEKODU gets the night's pranks: the screen turned askew, a file bomb filling the desktop, a USB stick in its side and a fake "formatlanıyor… %37". */
function GecekoduUsb() {
  // useId's characters do not all survive inside url(#…)
  const id = `skylcn-scene-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <>
      <defs>
        <clipPath id={`${id}-screen`}>
          <rect x="52" y="32" width="136" height="88" rx="2" />
        </clipPath>
      </defs>

      {/* the laptop */}
      <rect x="46" y="26" width="148" height="100" rx="6" fill="var(--skylcn-scene-surface)" />
      <g clipPath={`url(#${id}-screen)`}>
        {/* turned askew: the first prank */}
        <g transform="rotate(-6 120 76)">
          <g fill="var(--skylcn-scene-surface)" stroke="var(--skylcn-scene-soft)" strokeWidth={1.1}>
            {ICONS.map((icons, row) => (
              <g key={row} className={`skylcn-scene-c${row + 1}`}>
                {icons.map(({ x, y }) => (
                  <g key={x} transform={`translate(${x} ${y})`}>
                    <path d={FILE} />
                    <path d={FOLD} stroke="var(--skylcn-scene-faint)" />
                  </g>
                ))}
              </g>
            ))}
          </g>
          <rect
            x={DIALOG.x}
            y={DIALOG.y}
            width={DIALOG.w}
            height={DIALOG.h}
            rx="3"
            fill="var(--skylcn-scene-surface)"
          />
          <g stroke="none" fontSize="6">
            <text x="84" y="70" fill="var(--skylcn-scene-soft)">
              formatlanıyor…
            </text>
            <text x="156" y="70" textAnchor="end" fill="var(--skylcn-scene-alert)">
              %37
            </text>
          </g>
          <rect x="84" y="78" width="72" height="6" rx="3" strokeWidth={1.25} />
          <rect
            className="skylcn-scene-format"
            x="85.5"
            y="79.5"
            width="69"
            height="3"
            rx="1.5"
            fill="var(--skylcn-scene-alert)"
            stroke="none"
          />
        </g>
      </g>
      <rect
        x="52"
        y="32"
        width="136"
        height="88"
        rx="2"
        stroke="var(--skylcn-scene-faint)"
        strokeWidth={1.25}
      />
      <path d="M36 126H204L212 135H28Z" fill="var(--skylcn-scene-surface)" />
      <path d="M108 130.5H132" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />

      {/* the USB stick in its side */}
      <path d="M209 131h4" strokeWidth={1.25} />
      <rect x="213" y="127.5" width="16" height="7" rx="1.5" fill="var(--skylcn-scene-surface)" />
      <circle
        className="skylcn-scene-blink"
        cx="225"
        cy="131"
        r="1.3"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />

      {/* the desk */}
      <path d="M14 136H226" stroke="var(--skylcn-scene-soft)" />
    </>
  );
}

/**
 * An expired session.
 *
 * - A: GECEKODU's Awareness Project: the laptop left open at the next desk has its screen turned upside down and a "kilitle :)" note; yours only shows the session closed.
 * - B: The ARTLAB robot asleep beside a locked laptop, z's drifting up.
 * - C: A laptop left unlocked at GECEKODU gets the night's pranks: the screen turned askew, a file bomb filling the desktop, a USB stick in its side and a fake "formatlanıyor… %37".
 */
export function SessionExpiredScene(props: SceneProps<'sessionExpired'>) {
  return (
    <SceneFrame
      kind="sessionExpired"
      drawings={{ A: GecekoduPrank, B: ArtlabAsleep, C: GecekoduUsb }}
      {...props}
    />
  );
}
