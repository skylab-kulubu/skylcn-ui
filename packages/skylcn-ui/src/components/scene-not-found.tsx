import { SceneFrame, Sparkle, type SceneProps } from './scene-frame.js';

const MUG = 'M0-19h16v15a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z';
const HANDLE = 'M16-15h3a4 4 0 0 1 0 8h-3';

/**
 * 404, GECEKODU: Friday night, 03:47 on the clock. GECEKODU's badge (the dark disc with the
 * moon and stars of its mark) over a laptop whose terminal answers `cd sayfa` with "404"
 * and a blinking cursor; both mugs are empty. The lines type in, the cursor and the clock's
 * colon blink, the moon rocks and the stars twinkle.
 */
export function NotFoundScene(props: SceneProps) {
  return (
    <SceneFrame kind="notFound" {...props}>
      {/* GECEKODU's badge */}
      <circle
        cx="46"
        cy="44"
        r="27"
        stroke="var(--skylcn-scene-soft)"
        strokeWidth={1.25}
        fill="var(--skylcn-scene-surface)"
      />
      <g transform="translate(44 42)">
        <g className="skylcn-scene-rock">
          <circle cx="-2" cy="2" r="11" fill="var(--skylcn-scene-warm)" stroke="none" />
          <circle cx="4" cy="-3" r="10" fill="var(--skylcn-scene-surface)" stroke="none" />
        </g>
      </g>
      <Sparkle x={60} y={33} r={4} className="skylcn-scene-twinkle" />
      <Sparkle x={62} y={54.5} r={2.5} className="skylcn-scene-twinkle skylcn-scene-d2" />
      <Sparkle x={30} y={58.5} r={2.5} className="skylcn-scene-twinkle skylcn-scene-d1" />
      <Sparkle x={128} y={23} r={3} className="skylcn-scene-twinkle skylcn-scene-d3" />
      <Sparkle x={106} y={42.5} r={2.5} className="skylcn-scene-twinkle skylcn-scene-d1" />

      {/* Friday night, 03:47 */}
      <g stroke="none" className="font-mono">
        <text
          x="196"
          y="19"
          textAnchor="middle"
          fontSize="5.5"
          letterSpacing="0.8"
          fill="var(--skylcn-scene-faint)"
        >
          CUMA GECESİ
        </text>
      </g>
      <rect x="168" y="24" width="56" height="24" rx="5" fill="var(--skylcn-scene-surface)" />
      <text
        x="196"
        y="41"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="var(--skylcn-scene-ink)"
        stroke="none"
        className="font-mono"
      >
        03<tspan className="skylcn-scene-cursor">:</tspan>47
      </text>

      {/* desk */}
      <path d="M12 145H228" stroke="var(--skylcn-scene-soft)" />

      {/* the laptop and its terminal */}
      <rect x="70" y="64" width="100" height="72" rx="5" fill="var(--skylcn-scene-surface)" />
      <rect
        className="skylcn-scene-glow"
        x="76"
        y="70"
        width="88"
        height="60"
        rx="2"
        fill="var(--skylcn-scene-cool)"
        stroke="none"
        opacity="0.1"
      />
      <rect
        x="76"
        y="70"
        width="88"
        height="60"
        rx="2"
        stroke="var(--skylcn-scene-faint)"
        strokeWidth={1.25}
      />
      <g stroke="none" fontSize="6.6" className="font-mono">
        <text x="82" y="84" fill="var(--skylcn-scene-soft)">
          $ cd sayfa
        </text>
        <text className="skylcn-scene-type" x="82" y="96" fill="var(--skylcn-scene-alert)">
          404<tspan fill="var(--skylcn-scene-soft)"> bulunamadı</tspan>
        </text>
        <g className="skylcn-scene-type-late">
          <text x="82" y="108" fill="var(--skylcn-scene-soft)">
            $
          </text>
          <rect
            className="skylcn-scene-cursor"
            x="90"
            y="102.5"
            width="4.5"
            height="7"
            fill="var(--skylcn-scene-ink)"
          />
        </g>
      </g>
      <path d="M60 136H180L186 144H54Z" fill="var(--skylcn-scene-surface)" />
      <path d="M108 140H132" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />

      {/* two empty mugs and a coffee ring */}
      {[
        { x: 192, flip: false },
        { x: 46, flip: true },
      ].map(({ x, flip }) => (
        <g key={x} transform={`translate(${x} 145)${flip ? ' scale(-1 1)' : ''}`}>
          <path d={MUG} fill="var(--skylcn-scene-surface)" />
          <path d={HANDLE} />
          <path d="M3-15.5h10" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />
        </g>
      ))}
      <path
        d="M215 145.2a6 1.6 0 1 0 12 0M14 145.2a5 1.4 0 1 0 10 0"
        stroke="var(--skylcn-scene-faint)"
        strokeWidth={1.25}
      />
    </SceneFrame>
  );
}
