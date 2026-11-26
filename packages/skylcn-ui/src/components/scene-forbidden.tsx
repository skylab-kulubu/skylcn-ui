import { ScenePage, type ErrorScenePageProps } from './scene-page.js';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: The SKYDAYS CTF screen refuses three guessed flags and says this is not a CTF challenge; the door stays locked and the key hangs on the team lead's tag. */
function SkydaysCtf() {
  return (
    <>
      <path d="M10 152H230" stroke="var(--skylcn-scene-soft)" />
      {/* the SKYDAYS CTF screen: three guessed flags, each refused */}
      <rect x="12" y="22" width="120" height="104" rx="5" fill="var(--skylcn-scene-surface)" />
      <path d="M12 38H132" strokeWidth="1.25" />
      <g transform="translate(22 23.79) scale(0.11)" strokeWidth="10.91">
        <path
          d="M0 0L42 12V56C42 86 24 106 0 122C-24 106 -42 86 -42 56V12Z"
          fill="var(--skylcn-scene-surface)"
        />
        <path
          stroke="var(--skylcn-scene-cool)"
          d="M0 14L30 23V56C30 78 18 94 0 107C-18 94 -30 78 -30 56V23Z"
        />
        <circle cx="0" cy="52" r="8" fill="var(--skylcn-scene-ink)" stroke="none" />
        <path d="M-3 60L-5 74H5L3 60Z" fill="var(--skylcn-scene-ink)" stroke="none" />
      </g>
      <text
        x="30"
        y="32.5"
        fontSize="6.6"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        fontWeight="700"
        letterSpacing=".4"
        stroke="none"
      >
        SKYDAYS CTF
      </text>
      <path d="M120 22V6" />
      <g transform="translate(120 8)">
        <g className="skylcn-scene-wave">
          <g transform="translate(-120 -8)">
            <path
              d="M120 7L136 11L120 15Z"
              fill="var(--skylcn-scene-warm)"
              stroke="var(--skylcn-scene-warm)"
              strokeWidth="1.25"
            />
          </g>
        </g>
      </g>
      <text
        x="20"
        y="50"
        fontSize="5.4"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        soru: bu sayfa
      </text>
      <g className="skylcn-scene-c1">
        <text
          x="20"
          y="63"
          fontSize="6"
          fill="var(--skylcn-scene-soft)"
          textAnchor="start"
          stroke="none"
        >
          {'› flag{admin}'}
        </text>
        <text
          x="124"
          y="63"
          fontSize="7"
          fill="var(--skylcn-scene-alert)"
          textAnchor="end"
          fontWeight="700"
          stroke="none"
        >
          ×
        </text>
      </g>
      <g className="skylcn-scene-c2">
        <text
          x="20"
          y="75"
          fontSize="6"
          fill="var(--skylcn-scene-soft)"
          textAnchor="start"
          stroke="none"
        >
          {'› flag{1234}'}
        </text>
        <text
          x="124"
          y="75"
          fontSize="7"
          fill="var(--skylcn-scene-alert)"
          textAnchor="end"
          fontWeight="700"
          stroke="none"
        >
          ×
        </text>
      </g>
      <g className="skylcn-scene-c3">
        <text
          x="20"
          y="87"
          fontSize="6"
          fill="var(--skylcn-scene-soft)"
          textAnchor="start"
          stroke="none"
        >
          {'› flag{lütfen}'}
        </text>
        <text
          x="124"
          y="87"
          fontSize="7"
          fill="var(--skylcn-scene-alert)"
          textAnchor="end"
          fontWeight="700"
          stroke="none"
        >
          ×
        </text>
      </g>
      <g className="skylcn-scene-deny">
        <rect
          x="20"
          y="96"
          width="104"
          height="20"
          rx="3"
          stroke="var(--skylcn-scene-alert)"
          strokeWidth="1.25"
          fill="var(--skylcn-scene-surface)"
        />
        <text
          x="72"
          y="109"
          fontSize="6.2"
          fill="var(--skylcn-scene-alert)"
          textAnchor="middle"
          fontWeight="700"
          stroke="none"
        >
          CTF sorusu değil
        </text>
      </g>
      {/* the locked door */}
      <rect x="150" y="40" width="52" height="112" rx="2" fill="var(--skylcn-scene-surface)" />
      <rect
        x="157"
        y="48"
        width="38"
        height="96"
        rx="1.5"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <text
        x="176"
        y="62"
        fontSize="5.2"
        fill="var(--skylcn-scene-soft)"
        textAnchor="middle"
        letterSpacing=".5"
        stroke="none"
      >
        BU SAYFA
      </text>
      <g className="skylcn-scene-jiggle">
        <g transform="translate(176 92) scale(0.9)" strokeWidth="2.22">
          <path d="M-8 0V-6a8 8 0 0 1 16 0V0" />
          <rect x="-13" y="0" width="26" height="20" rx="3.5" fill="var(--skylcn-scene-surface)" />
          <circle cx="0" cy="8" r="2" fill="var(--skylcn-scene-ink)" stroke="none" />
          <path strokeWidth="1.39" d="M0 10v4" />
        </g>
      </g>
      <circle cx="194" cy="104" r="2" strokeWidth="1.25" />
      {/* the key hangs with the team lead */}
      <path d="M214 40v8" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <g transform="translate(214 48)">
        <g className="skylcn-scene-sway">
          <g transform="translate(-214 -48)">
            <circle cx="214" cy="54" r="5" strokeWidth="1.25" />
            <path d="M214 59v16M214 70h4M214 74h3" strokeWidth="1.25" />
            <rect
              x="204"
              y="78"
              width="20"
              height="24"
              rx="2"
              stroke="var(--skylcn-scene-warm)"
              strokeWidth="1.25"
              fill="var(--skylcn-scene-surface)"
            />
            <text
              x="214"
              y="88"
              fontSize="4.6"
              fill="var(--skylcn-scene-warm)"
              textAnchor="middle"
              fontWeight="700"
              stroke="none"
            >
              ekip
            </text>
            <text
              x="214"
              y="96"
              fontSize="4.6"
              fill="var(--skylcn-scene-warm)"
              textAnchor="middle"
              fontWeight="700"
              stroke="none"
            >
              lideri
            </text>
          </g>
        </g>
      </g>
    </>
  );
}

/** B: A locked door beside a chat with the team lead, asking for access. */
function AskTeamLead() {
  return (
    <>
      <path d="M10 152H230" stroke="var(--skylcn-scene-soft)" />
      <rect x="28" y="40" width="56" height="112" rx="2" fill="var(--skylcn-scene-surface)" />
      <rect
        x="35"
        y="48"
        width="42"
        height="96"
        rx="1.5"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <g className="skylcn-scene-jiggle">
        <g transform="translate(56 92) scale(0.9)" strokeWidth="2.22">
          <path d="M-8 0V-6a8 8 0 0 1 16 0V0" />
          <rect x="-13" y="0" width="26" height="20" rx="3.5" fill="var(--skylcn-scene-surface)" />
          <circle cx="0" cy="8" r="2" fill="var(--skylcn-scene-ink)" stroke="none" />
          <path strokeWidth="1.39" d="M0 10v4" />
        </g>
      </g>
      <circle cx="72" cy="104" r="2" strokeWidth="1.25" />
      {/* a message to the team lead */}
      <rect x="104" y="28" width="122" height="98" rx="6" fill="var(--skylcn-scene-surface)" />
      <path d="M104 44H226" strokeWidth="1.25" />
      <g transform="translate(116 36)">
        <circle r="4" strokeWidth="1.25" />
        <path d="M3 3l7 7M8 8l2-2M10 10l2-2" strokeWidth="1.25" />
      </g>
      <text
        x="134"
        y="39"
        fontSize="6"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        fontWeight="700"
        stroke="none"
      >
        ekip lideri
      </text>
      <rect
        x="138"
        y="54"
        width="80"
        height="22"
        rx="7"
        stroke="var(--skylcn-scene-brand)"
        strokeWidth="1.25"
        fill="var(--skylcn-scene-surface)"
      />
      <text
        x="144"
        y="63"
        fontSize="5.2"
        fill="var(--skylcn-scene-brand)"
        textAnchor="start"
        stroke="none"
      >
        bu sayfaya
      </text>
      <text
        x="144"
        y="71"
        fontSize="5.2"
        fill="var(--skylcn-scene-brand)"
        textAnchor="start"
        stroke="none"
      >
        yetki verir misin?
      </text>
      <rect
        x="112"
        y="86"
        width="36"
        height="16"
        rx="7"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <g className="skylcn-scene-sig1">
        <circle cx="122" cy="94" r="1.9" fill="var(--skylcn-scene-soft)" stroke="none" />
      </g>
      <g className="skylcn-scene-sig2">
        <circle cx="130" cy="94" r="1.9" fill="var(--skylcn-scene-soft)" stroke="none" />
      </g>
      <g className="skylcn-scene-sig3">
        <circle cx="138" cy="94" r="1.9" fill="var(--skylcn-scene-soft)" stroke="none" />
      </g>
      <path d="M112 114H200" strokeWidth="1.25" stroke="var(--skylcn-scene-faint)" />
      <path stroke="var(--skylcn-scene-brand)" d="M206 108l12 6-12 6 3-6z" strokeWidth="1.25" />
    </>
  );
}

const SHIELD = 'M120 22c20 8 40 11 56 11c0 63-18 97-56 123C82 130 64 96 64 33c16 0 36-3 56-11z';
const KEYHOLE = 'M114.5 89 111 108h18l-3.5-19';

/** C: SKYDAYS' nested shields and maze keyhole: a key slides in, will not turn, and backs out as the keyhole flashes. */
function SkydaysKey() {
  return (
    <>
      {/* three shields, the inner ones scaled about the keyhole; widths keep 2, 1.5 and 1.25 */}
      <path className="skylcn-scene-key-pulse" d={SHIELD} />
      <path
        d={SHIELD}
        stroke="var(--skylcn-scene-cool)"
        strokeWidth={1.875}
        transform="translate(24 17.6) scale(0.8)"
      />
      <path
        d={SHIELD}
        stroke="var(--skylcn-scene-cool)"
        strokeWidth={2.08}
        opacity="0.55"
        transform="translate(48 35.2) scale(0.6)"
      />
      <g fill="var(--skylcn-scene-surface)">
        <path d={KEYHOLE} />
        <circle cx="120" cy="80" r="12.5" />
      </g>
      {/* the keyhole's maze */}
      <path
        d="M112.5 81a7.5 7.5 0 0 1 12-6M127.5 80a7.5 7.5 0 0 1-3 6M116 80a4 4 0 0 1 7-2.6"
        stroke="var(--skylcn-scene-cool)"
        strokeWidth={1.25}
      />
      <g className="skylcn-scene-key-deny" stroke="var(--skylcn-scene-alert)">
        <circle cx="120" cy="80" r="12.5" />
        <path d={KEYHOLE} />
      </g>
      {/* the key turns about the keyhole, where its group starts */}
      <g transform="translate(120 82)">
        <g className="skylcn-scene-key" stroke="var(--skylcn-scene-warm)">
          <path d="M0 0h27M3 0v5M8 0v4" />
          <circle cx="34" cy="0" r="7" />
          <circle cx="34" cy="0" r="2.2" strokeWidth={1.25} />
        </g>
      </g>
    </>
  );
}

/**
 * 403, no access.
 *
 * - A: The SKYDAYS CTF screen refuses three guessed flags and says this is not a CTF challenge; the door stays locked and the key hangs on the team lead's tag.
 * - B: A locked door beside a chat with the team lead, asking for access.
 * - C: SKYDAYS' nested shields and maze keyhole: a key slides in, will not turn, and backs out as the keyhole flashes.
 */
export function ForbiddenScene(props: SceneProps<'forbidden'>) {
  return (
    <SceneFrame
      kind="forbidden"
      drawings={{ A: SkydaysCtf, B: AskTeamLead, C: SkydaysKey }}
      {...props}
    />
  );
}

/**
 * This kind's whole error page (ErrorScenePage) with its scene alone: what a client page
 * (error.tsx) imports to keep the other kinds' drawings out of its bundle.
 */
export function ForbiddenScenePage(props: ErrorScenePageProps) {
  return <ScenePage kind="forbidden" Scene={ForbiddenScene} {...props} />;
}
