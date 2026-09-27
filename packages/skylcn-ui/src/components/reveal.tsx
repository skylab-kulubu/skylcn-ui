'use client';

import { m } from 'motion/react';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../lib/cn.js';
import { motionTokens, transitions } from '../lib/motion-tokens.js';

const CAP = 8;

export type RevealProps = Omit<
  ComponentProps<'div'>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  /** Position among its siblings; each step waits one stagger longer, up to eight. */
  index?: number;
  /** `lg` travels a little further, for cards and sections. */
  size?: 'md' | 'lg';
  /**
   * Waits until it scrolls into view instead of animating on mount, for the
   * sections of a long public page.
   */
  inView?: boolean;
};

/**
 * Rises and fades in once, one after another with its siblings: dashboard
 * sections, cards, search results, landing page blocks. Reduced motion leaves
 * the fade and drops the rise.
 */
export function Reveal({
  index = 0,
  size = 'md',
  inView = false,
  className,
  style,
  ...props
}: RevealProps) {
  const step = Math.min(index, CAP);
  if (inView) {
    return (
      <m.div
        data-slot="reveal"
        initial={{
          opacity: 0,
          y: size === 'lg' ? motionTokens.shiftLarge * 2 : motionTokens.shiftLarge,
        }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ ...transitions.enterSlow, delay: step * motionTokens.stagger }}
        className={className}
        style={style}
        {...props}
      />
    );
  }
  return (
    <div
      data-slot="reveal"
      className={cn(size === 'lg' ? 'enter-rise-lg' : 'enter-rise', className)}
      style={
        {
          animationDelay: `calc(var(--motion-stagger) * ${step})`,
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}
