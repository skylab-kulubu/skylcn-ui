import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

/** A shimmering placeholder in the shape of the content that is loading. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn('shimmer-block rounded-md', className)}
      {...props}
    />
  );
}
