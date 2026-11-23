import { SceneFrame, Sparkle, type SceneProps } from './scene-frame.js';

/**
 * Session expired, SkyCamp: the camp's fire has gone out between the tent and the pine.
 * A last thread of smoke rises and the embers glow now and then.
 */
export function SessionExpiredScene(props: SceneProps) {
  return (
    <SceneFrame kind="sessionExpired" {...props}>
      <Sparkle x={58} y={40} r={4} className="skylcn-scene-twinkle skylcn-scene-d1" />
      <Sparkle x={178} y={30} className="skylcn-scene-twinkle" />

      {/* tent and pine, quiet in the back */}
      <g stroke="var(--skylcn-scene-soft)">
        <path d="M28 146 58 96l30 50" />
        <path d="M58 112 51 146M58 112l7 34" strokeWidth={1.25} />
        <path d="M188 88l-16 24h8l-13 20h42l-13-20h8z" />
        <path d="M188 132v14" />
      </g>

      {/* the last smoke */}
      <g stroke="var(--skylcn-scene-soft)" strokeWidth={1.5}>
        <path className="skylcn-scene-smoke" d="M118 118c-6-8 6-14 0-22s6-14 0-22" />
        <path className="skylcn-scene-smoke skylcn-scene-d2" d="M126 116c-4-6 4-10 0-16" />
      </g>

      {/* stones, logs and embers */}
      <g stroke="var(--skylcn-scene-soft)">
        <path d="M74 146a7 5 0 0 1 14 0M152 146a7 5 0 0 1 14 0" />
      </g>
      {[-14, 14].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 120 138)`}>
          <rect
            x="92"
            y="132.5"
            width="56"
            height="11"
            rx="5.5"
            fill="var(--skylcn-scene-surface)"
          />
          <circle
            cx={angle < 0 ? 97.5 : 142.5}
            cy="138"
            r="2.5"
            strokeWidth={1.25}
            opacity="0.55"
          />
        </g>
      ))}
      <g fill="var(--skylcn-scene-warm)" stroke="none">
        <circle className="skylcn-scene-ember" cx="111" cy="128" r="2" />
        <circle className="skylcn-scene-ember skylcn-scene-d1" cx="124" cy="125.5" r="1.6" />
        <circle className="skylcn-scene-ember skylcn-scene-d2" cx="131" cy="130" r="1.8" />
        <circle className="skylcn-scene-ember skylcn-scene-d3" cx="118" cy="131.5" r="1.4" />
      </g>
      <path d="M28 146h184" stroke="var(--skylcn-scene-faint)" />
    </SceneFrame>
  );
}
