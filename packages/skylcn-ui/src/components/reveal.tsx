import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../lib/cn.js';

const CAP = 8;

export type RevealProps = ComponentProps<'div'> & {
  /** Position among its siblings; each step waits one stagger longer, up to eight. */
  index?: number;
  /** `lg` travels a little further, for cards and sections. */
  size?: 'md' | 'lg';
};

/**
 * Rises and fades in once when it mounts, one after another with its
 * siblings: dashboard sections, cards, search results. Reduced motion leaves
 * the fade and drops the rise.
 */
export function Reveal({ index = 0, size = 'md', className, style, ...props }: RevealProps) {
  return (
    <div
      data-slot="reveal"
      className={cn(size === 'lg' ? 'enter-rise-lg' : 'enter-rise', className)}
      style={
        {
          animationDelay: `calc(var(--motion-stagger) * ${Math.min(index, CAP)})`,
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}
