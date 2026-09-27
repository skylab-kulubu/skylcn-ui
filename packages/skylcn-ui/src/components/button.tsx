'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { isValidElement } from 'react';
import { cn } from '../lib/cn.js';
import { usePendingIndicator } from '../lib/use-pending-indicator.js';
import { SkylabLoader } from './skylab-loader.js';

const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 items-center justify-center gap-2 border font-medium whitespace-nowrap select-none',
    'transition-[color,background-color,border-color,translate] duration-(--motion-duration-fast) ease-enter',
    'outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
    'active:not-aria-[haspopup]:translate-y-px',
    'disabled:cursor-not-allowed disabled:opacity-60 aria-busy:cursor-wait aria-busy:opacity-100',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary:
          'border-skylab-400/40 bg-skylab-500/10 text-skylab-300 hover:border-skylab-300/60 hover:bg-skylab-400/20',
        solid: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/85',
        outline:
          'border-border bg-transparent text-secondary-foreground hover:border-border-strong hover:bg-accent',
        ghost:
          'border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground aria-expanded:bg-accent',
        destructive:
          'border-destructive/40 bg-destructive/10 text-destructive hover:border-destructive/60 hover:bg-destructive/20',
        link: 'border-transparent px-0 text-skylab-300 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-7 rounded-md px-2.5 text-2xs pointer-coarse:h-9 pointer-coarse:text-xs',
        md: 'h-8 rounded-md px-3 text-2xs pointer-coarse:h-10 pointer-coarse:px-3.5 pointer-coarse:text-xs',
        lg: 'h-9 rounded-lg px-3.5 text-xs pointer-coarse:h-11 pointer-coarse:text-sm',
        'icon-sm': 'size-7 rounded-md text-2xs pointer-coarse:size-9',
        icon: 'size-8 rounded-md text-2xs pointer-coarse:size-10',
        'icon-lg': 'size-9 rounded-lg text-xs pointer-coarse:size-11',
      },
    },
    defaultVariants: { variant: 'outline', size: 'md' },
  },
);

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /**
     * Locks the button while an action runs. The SKY LAB mark takes the place of
     * the content only if the wait lasts, so quick actions never flash it.
     */
    pending?: boolean;
    /**
     * An icon that takes the label's place on hover and keyboard focus: the
     * label slides down and out, the icon slides down in. The label stays the
     * accessible name.
     */
    hoverIcon?: LucideIcon;
  };

export function Button({
  className,
  variant,
  size,
  pending = false,
  disabled,
  children,
  render,
  nativeButton,
  hoverIcon: HoverIcon,
  ...props
}: ButtonProps) {
  const busy = usePendingIndicator(pending);
  // A button rendered as a link (render={<a href />}) keeps link semantics.
  const native = nativeButton ?? !(isValidElement(render) && render.type !== 'button');
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || pending || busy}
      aria-busy={busy || undefined}
      render={render}
      nativeButton={native}
      {...props}
    >
      <span
        data-slot="button-content"
        className={cn(
          'inline-flex items-center justify-center gap-[inherit] transition-opacity duration-(--motion-duration-fast)',
          busy && 'opacity-0',
          HoverIcon && 'relative overflow-hidden',
        )}
      >
        {HoverIcon ? (
          <>
            <span className="inline-flex items-center gap-[inherit] transition-[translate,opacity] duration-(--motion-duration-base) ease-enter group-hover/button:translate-y-full group-hover/button:opacity-0 group-focus-visible/button:translate-y-full group-focus-visible/button:opacity-0 motion-reduce:translate-y-0!">
              {children}
            </span>
            <span
              aria-hidden
              className="absolute inset-0 grid -translate-y-full place-items-center opacity-0 transition-[translate,opacity] duration-(--motion-duration-base) ease-enter group-hover/button:translate-y-0 group-hover/button:opacity-100 group-focus-visible/button:translate-y-0 group-focus-visible/button:opacity-100 motion-reduce:translate-y-0!"
            >
              <HoverIcon />
            </span>
          </>
        ) : (
          children
        )}
      </span>
      {busy ? (
        <SkylabLoader size={16} className="absolute inset-0 m-auto enter-fade text-current" />
      ) : null}
    </ButtonPrimitive>
  );
}

export type IconButtonProps = Omit<ButtonProps, 'children'> & {
  icon: LucideIcon;
  /** Read by screen readers and shown as the native tooltip. */
  label: string;
};

/** A square button holding one icon; the admin toolbars' action button. */
export function IconButton({
  icon: Icon,
  label,
  size = 'icon',
  pending,
  title,
  ...props
}: IconButtonProps) {
  return (
    <Button size={size} aria-label={label} title={title ?? label} pending={pending} {...props}>
      <Icon />
    </Button>
  );
}

export { buttonVariants };
