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

/*
 * Initials sit on one of the chart hues, faint, so people in a list tell apart
 * at a glance. Spelled out in full for Tailwind; the text stays in the
 * foreground colour, so the tint never decides the contrast.
 */
const TONES = [
  'border-chart-1/30 bg-chart-1/20',
  'border-chart-2/30 bg-chart-2/20',
  'border-chart-3/30 bg-chart-3/20',
  'border-chart-4/30 bg-chart-4/20',
  'border-chart-5/30 bg-chart-5/20',
  'border-chart-6/30 bg-chart-6/20',
  'border-chart-7/30 bg-chart-7/20',
  'border-chart-8/30 bg-chart-8/20',
] as const;

/** The tone a person always gets, from their name or e-mail; -1 when there is neither. */
export function avatarTone(name?: string | null, email?: string | null): number {
  const source = (name || email || '').trim().toLocaleLowerCase('tr-TR');
  if (!source) return -1;
  let hash = 0;
  for (const char of source) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  return hash % TONES.length;
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
  const tone = avatarTone(name, email);
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden border font-semibold text-foreground select-none',
        tone < 0 ? 'border-border bg-muted' : TONES[tone],
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
