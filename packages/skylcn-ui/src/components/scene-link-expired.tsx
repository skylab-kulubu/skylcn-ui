import { ScenePage, type ErrorScenePageProps } from './scene-page.js';
import { SceneFrame, type SceneProps } from './scene-frame.js';

/** A: A single-use link stamped SÜRESİ DOLDU, and a turn arrow to a new one. */
function SingleUseLink() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      {/* the old link: expired */}
      <rect x="12" y="40" width="132" height="76" rx="6" fill="var(--skylcn-scene-surface)" />
      <path
        d="M24 52.5a3.4 3.4 0 0 1 4.8 0l1.6 1.6a3.4 3.4 0 0 1 0 4.8M27.4 60.5a3.4 3.4 0 0 1 -4.8 0l-1.6 -1.6a3.4 3.4 0 0 1 0 -4.8"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-soft)"
      />
      <text
        x="38"
        y="58"
        fontSize="5.6"
        fill="var(--skylcn-scene-ink)"
        textAnchor="start"
        stroke="none"
      >
        tek kullanımlık bağlantı
      </text>
      <text
        x="22"
        y="74"
        fontSize="5"
        fill="var(--skylcn-scene-faint)"
        textAnchor="start"
        stroke="none"
      >
        geçerlilik: 24 saat
      </text>
      <rect x="22" y="79" width="112" height="7" rx="3.5" strokeWidth="1.25" />
      <g className="skylcn-scene-stamp">
        <g transform="rotate(-7 78 102)">
          <rect
            x="34"
            y="92"
            width="88"
            height="20"
            rx="3"
            stroke="var(--skylcn-scene-alert)"
            strokeWidth="1.6"
            fill="var(--skylcn-scene-surface)"
          />
          <text
            x="78"
            y="105.5"
            fontSize="7.4"
            fill="var(--skylcn-scene-alert)"
            textAnchor="middle"
            fontWeight="700"
            stroke="none"
          >
            SÜRESİ DOLDU
          </text>
        </g>
      </g>
      {/* start again, get a new one */}
      <g className="skylcn-scene-spin skylcn-scene-self">
        <path
          stroke="var(--skylcn-scene-brand)"
          d="M174 78A10 10 0 1 1 167 68.5"
          strokeWidth="1.25"
        />
        <path stroke="var(--skylcn-scene-brand)" d="M165 64l3 4.5-5 1.5" strokeWidth="1.25" />
      </g>
      <rect
        x="190"
        y="60"
        width="40"
        height="34"
        rx="5"
        stroke="var(--skylcn-scene-brand)"
        strokeWidth="1.4"
        fill="var(--skylcn-scene-surface)"
      />
      <text
        x="210"
        y="74"
        fontSize="6"
        fill="var(--skylcn-scene-brand)"
        textAnchor="middle"
        fontWeight="700"
        stroke="none"
      >
        yeni
      </text>
      <rect
        x="196"
        y="81"
        width="28"
        height="5"
        rx="2.5"
        fill="var(--skylcn-scene-brand)"
        stroke="none"
      />
      <text
        x="168"
        y="106"
        fontSize="4.8"
        fill="var(--skylcn-scene-brand)"
        textAnchor="middle"
        stroke="none"
      >
        baştan başlat
      </text>
    </>
  );
}

/** B: An old envelope gathering cobwebs and dust while a new one drops in. */
function StaleEnvelope() {
  return (
    <>
      <path d="M10 150H230" stroke="var(--skylcn-scene-soft)" />
      {/* an envelope that waited too long: cobwebs and dust */}
      <g transform="rotate(-4 70 96)">
        <rect x="24" y="70" width="92" height="60" rx="2" fill="var(--skylcn-scene-surface)" />
        <path d="M24 71L70 106L116 71" strokeWidth="1.25" />
      </g>
      <path
        d="M24 66L52 66M24 66L24 92M24 66L44 84M24 66L50 75M24 66L35 90M32 66Q30 72 24 74M40 66Q37 78 24 82M48 66Q44 84 24 89"
        strokeWidth="1.25"
        stroke="var(--skylcn-scene-faint)"
      />
      <path d="M86 20V60" strokeWidth="1.25" />
      <g className="skylcn-scene-bob">
        <circle cx="86" cy="62" r="3.4" fill="var(--skylcn-scene-ink)" stroke="none" />
        <path d="M80 59l3 2M80 65l3-2M92 59l-3 2M92 65l-3-2" strokeWidth="1.25" />
      </g>
      <text
        x="70"
        y="146"
        fontSize="5.2"
        fill="var(--skylcn-scene-faint)"
        textAnchor="middle"
        stroke="none"
      >
        bekleme: çok
      </text>
      <circle cx="40" cy="138" r=".9" fill="var(--skylcn-scene-faint)" stroke="none" />
      <circle cx="104" cy="136" r="1.1" fill="var(--skylcn-scene-faint)" stroke="none" />
      <circle cx="118" cy="128" r=".8" fill="var(--skylcn-scene-faint)" stroke="none" />
      {/* a new one arrives */}
      <g className="skylcn-scene-drop">
        <rect x="156" y="82" width="60" height="40" rx="2" fill="var(--skylcn-scene-surface)" />
        <path d="M156 83L186 106L216 83" strokeWidth="1.25" />
        <rect
          x="196"
          y="74"
          width="26"
          height="12"
          rx="6"
          fill="var(--skylcn-scene-brand)"
          stroke="none"
        />
        <text
          x="209"
          y="82.4"
          fontSize="5.6"
          fill="var(--skylcn-scene-on-brand)"
          textAnchor="middle"
          fontWeight="700"
          stroke="none"
        >
          yeni
        </text>
      </g>
    </>
  );
}

/**
 * 410, a link that has expired.
 *
 * - A: A single-use link stamped SÜRESİ DOLDU, and a turn arrow to a new one.
 * - B: An old envelope gathering cobwebs and dust while a new one drops in.
 */
export function LinkExpiredScene(props: SceneProps<'linkExpired'>) {
  return (
    <SceneFrame kind="linkExpired" drawings={{ A: SingleUseLink, B: StaleEnvelope }} {...props} />
  );
}

/**
 * This kind's whole error page (ErrorScenePage) with its scene alone: what a client page
 * (error.tsx) imports to keep the other kinds' drawings out of its bundle.
 */
export function LinkExpiredScenePage(props: ErrorScenePageProps) {
  return <ScenePage kind="linkExpired" Scene={LinkExpiredScene} {...props} />;
}
