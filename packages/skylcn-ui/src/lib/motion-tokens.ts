/**
 * The motion tokens for script-driven animation, mirroring tokens.css: the
 * same curves, durations and spring, in the units motion expects (seconds).
 */
export const motionTokens = {
  ease: {
    enter: [0.22, 1, 0.36, 1],
    exit: [0.4, 0, 0.2, 1],
  },
  duration: { instant: 0.1, fast: 0.15, base: 0.2, slow: 0.35 },
  /** The drawer spring: stiffness 300, damping 30, mass 0.8. */
  spring: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
  stagger: 0.06,
  shift: 4,
  shiftLarge: 8,
} as const;

/** Ready-made transitions for motion components. */
export const transitions = {
  enter: { duration: motionTokens.duration.base, ease: motionTokens.ease.enter },
  enterSlow: { duration: motionTokens.duration.slow, ease: motionTokens.ease.enter },
  exit: { duration: motionTokens.duration.fast, ease: motionTokens.ease.exit },
  spring: motionTokens.spring,
  /** For shared highlights and items settling into new places. */
  layout: { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 },
} as const;
