import { ScenePage, type ErrorScenePageProps } from './scene-page.js';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: An application form stamped KAPANDI, its answer box shut, and a letter on its way to the team that shared it. */
function ClosedForm() {
  return (
    <>
      <path d="M10 152H230" stroke="var(--skylcn-scene-soft)" />
      <rect x="18" y="20" width="80" height="132" rx="4" fill="var(--skylcn-scene-surface)" />
      <text
        x="26"
        y="32"
        fontSize="4.8"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        letterSpacing=".4"
        stroke="none"
      >
        BAŞVURU FORMU
      </text>
      <path d="M26 38H90" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <path d="M26 48h6v6h-6zM26 64h6v6h-6zM26 80h6v6h-6zM26 96h6v6h-6z" strokeWidth="1.25" />
      <path
        d="M38 51H88M38 67H84M38 83H88M38 99H80"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <rect
        x="38"
        y="120"
        width="40"
        height="12"
        rx="3"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <g className="skylcn-scene-stamp">
        <g transform="rotate(-14 58 82)">
          <rect
            x="24"
            y="72"
            width="68"
            height="20"
            rx="3"
            fillOpacity=".85"
            stroke="var(--skylcn-scene-alert)"
            strokeWidth="1.6"
            fill="var(--skylcn-scene-surface)"
          />
          <text
            x="58"
            y="86"
            fontSize="9"
            fill="var(--skylcn-scene-alert)"
            textAnchor="middle"
            fontWeight="700"
            letterSpacing="1"
            stroke="none"
          >
            KAPANDI
          </text>
        </g>
      </g>
      {/* the answer box is shut */}
      <text
        x="126"
        y="48"
        fontSize="5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        yanıt: 0 yeni
      </text>
      <rect x="118" y="54" width="48" height="30" rx="3" fill="var(--skylcn-scene-surface)" />
      <path d="M126 64H158" strokeWidth="1.25" />
      <path stroke="var(--skylcn-scene-alert)" d="M122 58l40 22" strokeWidth="1.25" />
      {/* write to the team that shared it */}
      <g className="skylcn-scene-drift">
        <rect x="118" y="108" width="30" height="20" rx="2" fill="var(--skylcn-scene-surface)" />
        <path d="M118 109L133 120L148 109" strokeWidth="1.25" />
      </g>
      <path
        strokeDasharray="2 3"
        d="M152 118H178"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-soft)"
      />
      <path d="M175 114l4 4-4 4" strokeWidth="1.25" stroke="var(--skylcn-scene-soft)" />
      <rect x="184" y="98" width="44" height="42" rx="6" fill="var(--skylcn-scene-surface)" />
      <circle cx="206" cy="112" r="6" strokeWidth="1.25" />
      <path
        d="M206 108.6L207.09 110.91L209.4 112L207.09 113.09L206 115.4L204.91 113.09L202.6 112L204.91 110.91Z"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />
      <text
        x="206"
        y="128"
        fontSize="4.6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="middle"
        stroke="none"
      >
        formu
      </text>
      <text
        x="206"
        y="135"
        fontSize="4.6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="middle"
        stroke="none"
      >
        paylaşan
      </text>
    </>
  );
}

/** B: The clock turns 23:59 into 00:00 over a closed form; write to the team anyway. */
function LastMinute() {
  return (
    <>
      <path d="M10 152H230" stroke="var(--skylcn-scene-soft)" />
      {/* the clock: 23:59 turns 00:00 */}
      <rect x="16" y="22" width="88" height="40" rx="5" fill="var(--skylcn-scene-surface)" />
      <path d="M16 42H104" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <text
        x="60"
        y="16"
        fontSize="5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        letterSpacing=".8"
        stroke="none"
      >
        SON GÜN
      </text>
      <g className="skylcn-scene-flip-before" opacity="0">
        <text
          x="60"
          y="50"
          fontSize="20"
          fill="var(--skylcn-scene-ink)"
          textAnchor="middle"
          fontWeight="700"
          stroke="none"
        >
          23:59
        </text>
      </g>
      <g className="skylcn-scene-flip-after">
        <text
          x="60"
          y="50"
          fontSize="20"
          fill="var(--skylcn-scene-alert)"
          textAnchor="middle"
          fontWeight="700"
          stroke="none"
        >
          00:00
        </text>
      </g>
      {/* the form: closed */}
      <rect x="26" y="74" width="64" height="78" rx="4" fill="var(--skylcn-scene-surface)" />
      <path d="M34 86h5v5h-5zM34 100h5v5h-5zM34 114h5v5h-5z" strokeWidth="1.25" />
      <path
        d="M44 88.5H82M44 102.5H78M44 116.5H82"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <g className="skylcn-scene-stamp">
        <g transform="rotate(-12 58 128)">
          <rect
            x="30"
            y="120"
            width="56"
            height="16"
            rx="3"
            fillOpacity=".85"
            stroke="var(--skylcn-scene-alert)"
            strokeWidth="1.5"
            fill="var(--skylcn-scene-surface)"
          />
          <text
            x="58"
            y="131.5"
            fontSize="7.4"
            fill="var(--skylcn-scene-alert)"
            textAnchor="middle"
            fontWeight="700"
            stroke="none"
          >
            KAPANDI
          </text>
        </g>
      </g>
      {/* write to the team anyway */}
      <text
        x="132"
        y="72"
        fontSize="5.6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="start"
        stroke="none"
      >
        yine de
      </text>
      <text
        x="132"
        y="81"
        fontSize="5.6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="start"
        stroke="none"
      >
        ekibe yaz
      </text>
      <g className="skylcn-scene-drift">
        <rect x="130" y="92" width="40" height="26" rx="2" fill="var(--skylcn-scene-surface)" />
        <path d="M130 93L150 107.6L170 93" strokeWidth="1.25" />
      </g>
      <path
        strokeDasharray="2 3"
        d="M176 105H196"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-soft)"
      />
      <path d="M193 101l4 4-4 4" strokeWidth="1.25" stroke="var(--skylcn-scene-soft)" />
      <rect x="198" y="88" width="30" height="34" rx="5" fill="var(--skylcn-scene-surface)" />
      <circle cx="213" cy="100" r="5" strokeWidth="1.25" />
      <path
        d="M213 97L213.96 99.04L216 100L213.96 100.96L213 103L212.04 100.96L210 100L212.04 99.04Z"
        fill="var(--skylcn-scene-warm)"
        stroke="none"
      />
      <text
        x="213"
        y="115"
        fontSize="4.6"
        fill="var(--skylcn-scene-soft)"
        textAnchor="middle"
        stroke="none"
      >
        ekip
      </text>
    </>
  );
}

/**
 * A form that no longer takes answers.
 *
 * - A: An application form stamped KAPANDI, its answer box shut, and a letter on its way to the team that shared it.
 * - B: The clock turns 23:59 into 00:00 over a closed form; write to the team anyway.
 */
export function FormClosedScene(props: SceneProps<'formClosed'>) {
  return <SceneFrame kind="formClosed" drawings={{ A: ClosedForm, B: LastMinute }} {...props} />;
}

/**
 * This kind's whole error page (ErrorScenePage) with its scene alone: what a client page
 * (error.tsx) imports to keep the other kinds' drawings out of its bundle.
 */
export function FormClosedScenePage(props: ErrorScenePageProps) {
  return <ScenePage kind="formClosed" Scene={FormClosedScene} {...props} />;
}
