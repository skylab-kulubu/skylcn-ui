import { SceneFrame, type SceneProps } from './scene-frame.js';

const LETTERS = ['a', 'd', 'm', 'i', 'n'] as const;

/**
 * 403, SkyDays: the summit's nested shields with the maze keyhole of its mark, beside the
 * CTF's flag box. A guessed `flag{admin}` is typed in letter by letter and refused; the
 * keyhole flashes red and the flag, raised while typing, falls back to half-mast.
 */
export function ForbiddenScene(props: SceneProps) {
  return (
    <SceneFrame kind="forbidden" {...props}>
      {/* three shields and the keyhole; the still frame shows the refusal */}
      <path
        d="M68 18L110 30V74C110 104 92 124 68 140C44 124 26 104 26 74V30Z"
        fill="var(--skylcn-scene-surface)"
      />
      <path
        d="M68 30L100 39V74C100 97 87 113 68 127C49 113 36 97 36 74V39Z"
        stroke="var(--skylcn-scene-cool)"
        strokeWidth={1.25}
      />
      <path
        d="M68 41L90 47.5V74C90 90 81 102 68 112C55 102 46 90 46 74V47.5Z"
        stroke="var(--skylcn-scene-faint)"
        strokeWidth={1.25}
      />
      <g
        className="skylcn-scene-hole"
        fill="var(--skylcn-scene-surface)"
        stroke="var(--skylcn-scene-alert)"
      >
        <circle cx="68" cy="70" r="9" />
        <path d="M64.5 78L61.5 93H74.5L71.5 78" />
      </g>
      <path
        d="M64 66h4v4M71 64.5v5h2.5M63.5 73h5M66 85h4"
        stroke="var(--skylcn-scene-soft)"
        strokeWidth={1.25}
      />

      {/* the CTF's flag box */}
      <rect x="124" y="48" width="104" height="70" rx="5" fill="var(--skylcn-scene-surface)" />
      <path d="M124 60H228" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />
      <g stroke="none" className="font-mono">
        <text x="131" y="56.5" fontSize="5.6" letterSpacing="0.6" fill="var(--skylcn-scene-soft)">
          SKYDAYS CTF
        </text>
        <text x="131" y="77" fontSize="7.6" fill="var(--skylcn-scene-ink)">
          › flag{'{'}
          {LETTERS.map((letter, i) => (
            <tspan key={i} className={`skylcn-scene-c${i + 1}`}>
              {letter}
            </tspan>
          ))}
          {'}'}
        </text>
        <text
          className="skylcn-scene-deny"
          x="131"
          y="93"
          fontSize="7.2"
          fill="var(--skylcn-scene-alert)"
        >
          × yanlış bayrak
        </text>
        <text x="131" y="108" fontSize="5.6" fill="var(--skylcn-scene-faint)">
          erişim: yok
        </text>
      </g>

      {/* the flag at half-mast */}
      <path d="M214 48V12" />
      <g transform="translate(214 35)">
        <g className="skylcn-scene-hoist">
          <path
            d="M0-5L-17-0.5L0 5Z"
            fill="var(--skylcn-scene-faint)"
            stroke="var(--skylcn-scene-soft)"
            strokeWidth={1.25}
          />
        </g>
      </g>
      <path d="M14 150H226" stroke="var(--skylcn-scene-soft)" />
    </SceneFrame>
  );
}
