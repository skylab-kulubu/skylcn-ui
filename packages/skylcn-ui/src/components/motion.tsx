'use client';

import {
  AnimatePresence,
  animate,
  m,
  useIsPresent,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { motionTokens, transitions } from '../lib/motion-tokens.js';
import { numberFormat } from '../lib/number-format.js';
import { useSkylcn } from '../lib/provider.js';
import { useReducedMotion } from '../lib/use-reduced-motion.js';

export type CollapseProps = {
  open: boolean;
  children: ReactNode;
  className?: string;
  /** Called when the content has finished opening (true) or closing (false). */
  onSettle?: (open: boolean) => void;
};

/**
 * Content that opens to its natural height and closes back to nothing, such
 * as a field's error or a revealed section. Its overflow is released once
 * open, so focus rings inside are not clipped.
 */
export function Collapse({ open, children, className, onSettle }: CollapseProps) {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(false);
  const [moving, setMoving] = useState(false);
  // Set while rendering, so the layer is there on the motion's first frame
  const [shownOpen, setShownOpen] = useState(open);
  if (open !== shownOpen) {
    setShownOpen(open);
    setMoving(true);
  }
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <m.div
          key="collapse"
          data-slot="collapse"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: reduced ? { duration: 0 } : transitions.enterSlow,
            opacity: transitions.enter,
          }}
          onAnimationStart={() => setSettled(false)}
          onAnimationComplete={() => {
            setSettled(open);
            setMoving(false);
            onSettle?.(open);
          }}
          style={{ overflow: settled ? 'visible' : 'hidden' }}
          className={className}
        >
          {/* While the height moves, the content sits on its own layer: painted once and only
              clipped each frame, instead of painted again on every frame. Only while moving,
              as a layer of its own loses the text's subpixel smoothing */}
          <div style={moving ? { willChange: 'transform' } : undefined}>{children}</div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

export type SwapProps = {
  /** Identifies the content; changing it swaps the old content for the new. */
  id: string | number;
  /**
   * Which way the new content comes from: 1 from the right (next), -1 from the
   * left (previous), 0 a plain cross-fade.
   */
  direction?: -1 | 0 | 1;
  children: ReactNode;
  className?: string;
};

const SWAP_SHIFT = 16;

/**
 * Replaces content with a short cross-fade that slides in the direction of
 * travel: tab panels, wizard steps, calendar months, a list and its empty state.
 */
export function Swap({ id, direction = 0, children, className }: SwapProps) {
  return (
    <div data-slot="swap" className={cn('relative', className)}>
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <m.div
          key={id}
          custom={direction}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * SWAP_SHIFT }),
            center: { opacity: 1, x: 0, transition: transitions.enter },
            exit: (d: number) => ({ opacity: 0, x: d * -SWAP_SHIFT, transition: transitions.exit }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <Leaving>{children}</Leaving>
        </m.div>
      </AnimatePresence>
    </div>
  );
}

// Content on its way out can no longer be clicked or reached, so a quick
// click never lands on a result that has already been replaced
function Leaving({ children }: { children: ReactNode }) {
  const present = useIsPresent();
  return <div inert={!present || undefined}>{children}</div>;
}

export type AnimatedNumberProps = {
  value: number;
  /** Formats the figure on every frame; whole numbers in the reader's locale by default. */
  format?: (value: number) => string;
  /** Gives every digit the same width, for figures in columns or small counters. */
  tabular?: boolean;
  className?: string;
};

/**
 * A figure that runs to its new value when it changes, never on first show.
 * Screen readers get the final value only, once.
 */
export function AnimatedNumber({ value, format, tabular = false, className }: AnimatedNumberProps) {
  const { locale } = useSkylcn();
  const reduced = useReducedMotion();
  const tag = locale === 'tr' ? 'tr-TR' : 'en-US';
  const fmt = format ?? ((n: number) => numberFormat(tag).format(Math.round(n)));
  const formatRef = useRef(fmt);
  useEffect(() => {
    formatRef.current = fmt;
  });

  const current = useMotionValue(value);
  const text = useTransform(current, (n) => formatRef.current(n));

  useEffect(() => {
    const controls = animate(
      current,
      value,
      reduced ? { duration: 0 } : { duration: 0.6, ease: motionTokens.ease.enter },
    );
    return () => controls.stop();
  }, [current, value, reduced]);

  return (
    <span data-slot="animated-number" className={cn(tabular && 'tabular-nums', className)}>
      <m.span aria-hidden>{text}</m.span>
      <span className="sr-only">{fmt(value)}</span>
    </span>
  );
}

export { AnimatePresence, LayoutGroup, m } from 'motion/react';
