'use client';

import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { User2 } from 'lucide-react';
import { cn } from '../lib/cn.js';

const SIZES = {
  sm: { box: 'size-7 text-3xs', icon: 'size-3' },
  md: { box: 'size-9 text-xs', icon: 'size-4' },
  lg: { box: 'size-11 text-sm', icon: 'size-5' },
} as const;

export function initialsOf(name?: string | null, email?: string | null): string {
  const source = (name || email || '').trim();
  if (!source) return '';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toLocaleUpperCase('tr-TR');
  return (parts[0]![0]! + parts[1]![0]!).toLocaleUpperCase('tr-TR');
}

export type AvatarProps = {
  name?: string | null;
  email?: string | null;
  src?: string | null;
  size?: keyof typeof SIZES;
  /** `circle` for people; `square` for teams, groups and other organisations. */
  shape?: 'circle' | 'square';
  className?: string;
};

/** A photo, else the initials of the name or e-mail, else a person icon. */
export function Avatar({
  name,
  email,
  src,
  size = 'md',
  shape = 'circle',
  className,
}: AvatarProps) {
  const s = SIZES[size];
  const initials = initialsOf(name, email);
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden border border-border bg-muted font-semibold text-secondary-foreground select-none',
        shape === 'circle' ? 'rounded-full' : 'rounded-lg',
        s.box,
        className,
      )}
    >
      {src ? (
        <AvatarPrimitive.Image src={src} alt={name ?? ''} className="size-full object-cover" />
      ) : null}
      <AvatarPrimitive.Fallback className="grid size-full place-items-center">
        {initials || <User2 className={cn('text-subtle-foreground', s.icon)} />}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
