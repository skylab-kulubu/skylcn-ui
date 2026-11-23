import { SceneFrame, Sparkle, type SceneProps } from './scene-frame.js';

/**
 * 404, GECEKODU: the night-coding hooded coder asleep on folded arms at the desk, glasses
 * pushed up, the laptop with a "404" sticker beside a steaming mug. Breathes, snores,
 * lets "z z Z" rise; the stars twinkle and the screen's light flickers.
 */
export function NotFoundScene(props: SceneProps) {
  return (
    <SceneFrame kind="notFound" {...props}>
      {/* moon and stars */}
      <path d="M62 30a14 14 0 1 0 14 20a11 11 0 0 1-14-20z" stroke="var(--skylcn-scene-warm)" />
      <Sparkle x={112} y={26} className="skylcn-scene-twinkle" />
      <Sparkle x={160} y={34} r={4} className="skylcn-scene-twinkle skylcn-scene-d2" />
      <Sparkle x={196} y={58} className="skylcn-scene-twinkle skylcn-scene-d1" />
      <Sparkle x={36} y={78} r={3.5} className="skylcn-scene-twinkle skylcn-scene-d3" />

      {/* the screen's light on the sleeper */}
      <ellipse
        className="skylcn-scene-glow"
        cx="132"
        cy="110"
        rx="44"
        ry="24"
        fill="var(--skylcn-scene-cool)"
        stroke="none"
        opacity="0.1"
      />

      {/* mug and steam */}
      <g strokeWidth={1.25} stroke="var(--skylcn-scene-soft)">
        <path className="skylcn-scene-puff" d="M48 118q-2-3 0-6t0-6" />
        <path className="skylcn-scene-puff skylcn-scene-d2" d="M54 118q-2-3 0-6t0-6" />
      </g>
      <path d="M43 123h16v13a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5z" />
      <path d="M59 127h2a4 4 0 0 1 0 8h-2" strokeWidth={1.5} />

      {/* the sleeper: shoulders and head breathe, the arms stay on the desk */}
      <g className="skylcn-scene-breathe">
        <path d="M70 141c2-20 16-30 34-29c16 1 24 12 26 29" fill="var(--skylcn-scene-surface)" />
        <g transform="rotate(-12 96 114)">
          <circle cx="94" cy="108" r="18" fill="var(--skylcn-scene-surface)" />
          <circle cx="96" cy="115" r="11.5" strokeWidth={1.25} />
          {/* glasses pushed up onto the forehead */}
          <g stroke="var(--skylcn-scene-brand)" strokeWidth={1.5}>
            <rect x="87" y="102.5" width="7" height="4.5" rx="2" />
            <rect x="97.5" y="102.5" width="7" height="4.5" rx="2" />
            <path d="M94 104.5h3.5" />
          </g>
          <path d="M89.5 114.5q2.5 2.2 5 0M98 114.5q2.5 2.2 5 0" strokeWidth={1.5} />
          <ellipse
            className="skylcn-scene-snore"
            cx="96.5"
            cy="121"
            rx="1.5"
            ry="1.8"
            fill="var(--skylcn-scene-ink)"
            stroke="none"
          />
        </g>
      </g>
      <rect x="72" y="127" width="58" height="14" rx="7" fill="var(--skylcn-scene-surface)" />
      <path d="M100 131v6" strokeWidth={1.25} opacity="0.55" />

      {/* laptop, lid towards us, with its sticker */}
      <rect x="132" y="94" width="52" height="38" rx="4" fill="var(--skylcn-scene-surface)" />
      <rect
        x="146"
        y="106"
        width="24"
        height="13"
        rx="3"
        fill="var(--skylcn-scene-brand)"
        stroke="none"
      />
      <text
        x="158"
        y="115.6"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="var(--skylcn-scene-on-brand)"
        stroke="none"
        className="font-mono"
      >
        404
      </text>
      <path d="M126 136h64" strokeWidth={3} />

      {/* desk */}
      <path d="M28 142h184" stroke="var(--skylcn-scene-faint)" />

      {/* z z Z */}
      <g fill="var(--skylcn-scene-brand)" stroke="none" fontWeight="700" className="font-mono">
        <text className="skylcn-scene-drift" x="112" y="92" fontSize="9">
          z
        </text>
        <text className="skylcn-scene-drift skylcn-scene-d1" x="123" y="80" fontSize="11">
          z
        </text>
        <text className="skylcn-scene-drift skylcn-scene-d2" x="135" y="66" fontSize="14">
          Z
        </text>
      </g>
    </SceneFrame>
  );
}
