'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { SkylabLoader } from './skylab-loader.js';

const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center gap-2 border font-medium whitespace-nowrap select-none',
    'transition-[color,background-color,border-color,box-shadow,transform] duration-(--motion-duration-fast) ease-enter',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
    /** Locks the button and shows the SKY LAB mark while an action runs. */
    pending?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  pending = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      {pending ? <SkylabLoader size={16} className="text-current" /> : null}
      {children}
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
      {pending ? null : <Icon />}
    </Button>
  );
}

export { buttonVariants };
