import { useId } from 'react';
import { SceneFrame, type SceneProps } from './scene-frame.js';

// The output that never comes clear: 5 × 5 cells of noise, each with its tone and opacity
const NOISE: [string, number, boolean][] = [
  ['soft', 0.7, true],
  ['faint', 0.5, false],
  ['ink', 0.35, true],
  ['faint', 0.8, false],
  ['soft', 0.4, true],
  ['faint', 0.6, true],
  ['cool', 0.45, false],
  ['soft', 0.55, true],
  ['ink', 0.25, true],
  ['faint', 0.7, false],
  ['ink', 0.3, false],
  ['soft', 0.65, true],
  ['faint', 0.5, false],
  ['cool', 0.35, true],
  ['soft', 0.6, true],
  ['faint', 0.75, true],
  ['ink', 0.3, false],
  ['soft', 0.5, true],
  ['faint', 0.6, false],
  ['ink', 0.3, true],
  ['soft', 0.45, false],
  ['faint', 0.7, true],
  ['cool', 0.4, false],
  ['soft', 0.6, true],
  ['faint', 0.5, false],
];
const DELAYS = ['', ' skylcn-scene-d1', ' skylcn-scene-d2', ' skylcn-scene-d3'];

/**
 * 500, ARTLAB: the summit's robot, drawn after Kaan Necip Kalp's 2026 ARTLAB figure
 * (artlab-site `src/themes/2026`), watching a training run fail. The screen reads like the
 * ARTLAB site's "DİFÜZYON · ADIM 50/50" band, stuck at step 23: the output stays noise and
 * the loss falls, then shoots off the top of the screen. The robot jumps, a spark at its ear.
 */
export function ServerErrorScene(props: SceneProps) {
  // useId's characters do not all survive inside url(#…)
  const id = `skylcn-scene-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <SceneFrame kind="error" {...props}>
      <defs>
        <clipPath id={`${id}-out`}>
          <rect x="100" y="46" width="44" height="44" rx="1" />
        </clipPath>
      </defs>

      {/* the screen */}
      <rect x="92" y="22" width="136" height="100" rx="6" fill="var(--skylcn-scene-surface)" />
      <path d="M92 36H228" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />
      <g stroke="none" className="font-mono">
        <text x="98" y="31.5" fontSize="5.1" fill="var(--skylcn-scene-soft)">
          DİFÜZYON · ADIM 23/50
        </text>
        <text x="160" y="50" fontSize="5.2" fill="var(--skylcn-scene-faint)">
          kayıp
        </text>
        <text x="189" y="110" textAnchor="middle" fontSize="5.2" fill="var(--skylcn-scene-faint)">
          adım
        </text>
        <text
          className="skylcn-scene-before"
          x="122"
          y="104"
          textAnchor="middle"
          fontSize="5.4"
          fill="var(--skylcn-scene-soft)"
        >
          gürültü 0.41
        </text>
        <text
          className="skylcn-scene-after"
          x="122"
          y="104"
          textAnchor="middle"
          fontSize="5.4"
          fill="var(--skylcn-scene-alert)"
        >
          gürültü 0.97
        </text>
      </g>

      {/* the output, still noise */}
      <rect
        x="98"
        y="44"
        width="48"
        height="48"
        rx="2"
        stroke="var(--skylcn-scene-faint)"
        strokeWidth={1.25}
      />
      <g stroke="none" clipPath={`url(#${id}-out)`}>
        {NOISE.map(([tone, opacity, moves], i) => (
          <rect
            key={i}
            className={moves ? `skylcn-scene-noise${DELAYS[i % 4]}` : undefined}
            x={101 + (i % 5) * 9}
            y={47 + Math.floor(i / 5) * 9}
            width="8"
            height="8"
            fill={`var(--skylcn-scene-${tone})`}
            opacity={opacity}
          />
        ))}
      </g>

      {/* the loss: falls, then leaves the screen */}
      <path d="M156 46V100H222" stroke="var(--skylcn-scene-faint)" strokeWidth={1.25} />
      <path
        className="skylcn-scene-trace"
        d="M158 58C166 76 174 88 186 92S200 95 204 94"
        stroke="var(--skylcn-scene-cool)"
        strokeWidth={1.6}
      />
      <path
        className="skylcn-scene-spike"
        d="M204 94L210 50L216 12"
        stroke="var(--skylcn-scene-alert)"
      />
      <path
        className="skylcn-scene-burst"
        d="M216 5L217.7 9.3L222 11L217.7 12.7L216 17L214.3 12.7L210 11L214.3 9.3Z"
        fill="var(--skylcn-scene-alert)"
        stroke="none"
      />

      {/* stand, table and floor */}
      <path d="M160 122V138M148 138H172" />
      <path d="M100 140H228M8 152H96" stroke="var(--skylcn-scene-soft)" />

      {/* the robot, its own 120-unit drawing scaled down; it looks up at the screen */}
      <g transform="translate(2 66) scale(0.8)">
        <g fill="var(--skylcn-scene-surface)">
          <path d="M58 104Q48 92 54 80l4 4q-4 8 0 20z" />
          <path d="M62 104q10-12 4-24l-4 4q4 8 0 20z" />
          <rect x="34" y="96" width="18" height="11" rx="4" />
          <rect x="68" y="96" width="18" height="11" rx="4" />
        </g>
        <circle cx="60" cy="80" r="2.6" fill="var(--skylcn-scene-warm)" stroke="none" />
        <path
          d="M39 99.5v4M43 99.5v4M47 99.5v4M73 99.5v4M77 99.5v4M81 99.5v4"
          strokeWidth={1.3}
          opacity="0.55"
        />
        <g transform="translate(60 78)">
          <g className="skylcn-scene-jolt">
            <g transform="translate(-60 -78)">
              <circle cx="60" cy="48" r="30" fill="var(--skylcn-scene-surface)" />
              <path d="M36.6 39Q60 23.4 83.4 39" strokeWidth={1.3} opacity="0.5" />
              {[31.2, 88.8].map((cx) => (
                <g key={cx}>
                  <circle cx={cx} cy="50.4" r="9" fill="var(--skylcn-scene-surface)" />
                  <circle
                    cx={cx}
                    cy="50.4"
                    r="3.9"
                    stroke="var(--skylcn-scene-warm)"
                    strokeWidth={1.3}
                  />
                </g>
              ))}
              {/* the eye: socket, lens rings, the pupil up towards the screen */}
              <circle
                cx="60"
                cy="51"
                r="14.1"
                fill="var(--skylcn-scene-surface)"
                strokeWidth={1.5}
              />
              <circle cx="60" cy="51" r="10.2" stroke="var(--skylcn-scene-cool)" />
              <circle
                cx="60"
                cy="51"
                r="6"
                stroke="var(--skylcn-scene-cool)"
                strokeWidth={1.3}
                opacity="0.6"
              />
              <circle cx="66" cy="47" r="3" fill="var(--skylcn-scene-cool)" stroke="none" />
              <path
                className="skylcn-scene-spark"
                d="M98 33l5-6-1.4 6 6-3.4"
                stroke="var(--skylcn-scene-warm)"
                strokeWidth={1.7}
              />
              <path
                d="M84 22c-2.4 4-3 6.5 0 8c3-1.5 2.4-4 0-8z"
                fill="var(--skylcn-scene-cool)"
                stroke="none"
                opacity="0.8"
              />
            </g>
          </g>
        </g>
      </g>
    </SceneFrame>
  );
}
