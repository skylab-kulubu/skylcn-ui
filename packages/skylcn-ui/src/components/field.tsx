'use client';

import { Field as FieldPrimitive } from '@base-ui/react/field';
import { Input as InputPrimitive } from '@base-ui/react/input';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

const controlClass = [
  'w-full min-w-0 rounded-md border border-input bg-input-background text-xs text-foreground outline-hidden',
  // 16px on touch screens keeps iOS from zooming into the field
  'pointer-coarse:text-base',
  'transition-[border-color] duration-(--motion-duration-fast) ease-enter',
  'placeholder:text-subtle-foreground',
  'hover:border-border-strong focus-visible:border-skylab-400/50 focus-visible:ring-2 focus-visible:ring-skylab-400/20',
  'aria-invalid:border-destructive/60 aria-invalid:ring-destructive/20 data-invalid:border-destructive/60',
  'disabled:cursor-not-allowed disabled:opacity-60',
];

export type InputProps = InputPrimitive.Props & {
  /** A leading icon inside the box, such as a search glass. */
  icon?: LucideIcon;
  inputSize?: 'sm' | 'md';
};

export function Input({ className, icon: Icon, inputSize = 'md', ...props }: InputProps) {
  const input = (
    <InputPrimitive
      data-slot="input"
      className={cn(
        controlClass,
        inputSize === 'sm' ? 'h-7 px-2 pointer-coarse:h-9' : 'h-8 px-2.5 pointer-coarse:h-10',
        Icon && (inputSize === 'sm' ? 'pl-7' : 'pl-8'),
        !Icon && className,
      )}
      {...props}
    />
  );
  if (!Icon) return input;
  return (
    <div className={cn('relative', className)}>
      <Icon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle-foreground" />
      {input}
    </div>
  );
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        controlClass,
        'field-sizing-content min-h-16 resize-y px-2.5 py-2 leading-relaxed',
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn('text-2xs font-medium text-muted-foreground select-none', className)}
      {...props}
    />
  );
}

export type FieldProps = FieldPrimitive.Root.Props & {
  label?: ReactNode;
  description?: ReactNode;
  /** Shown under the control and marks it invalid. */
  error?: ReactNode;
};

/** A label, a control, a hint and an error, wired together for assistive tech. */
export function Field({ label, description, error, className, children, ...props }: FieldProps) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      invalid={Boolean(error) || undefined}
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      {label ? (
        <FieldPrimitive.Label className="text-2xs font-medium text-muted-foreground">
          {label}
        </FieldPrimitive.Label>
      ) : null}
      {children}
      {description ? (
        <FieldPrimitive.Description className="text-2xs leading-relaxed text-subtle-foreground">
          {description}
        </FieldPrimitive.Description>
      ) : null}
      {error ? (
        <FieldPrimitive.Error match className="text-2xs text-destructive">
          {error}
        </FieldPrimitive.Error>
      ) : null}
    </FieldPrimitive.Root>
  );
}
