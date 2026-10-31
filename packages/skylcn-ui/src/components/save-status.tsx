'use client';

import { Check, CircleAlert, LoaderCircle } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useSkylcn } from '../lib/provider.js';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export type SaveStatusProps = {
  state: SaveState;
  /** Why the save failed, in place of the general line; it stays until the next save. */
  error?: ReactNode;
  /** How long "Kaydedildi" stays before it fades, in milliseconds. */
  savedFor?: number;
  className?: string;
};

/**
 * Where an autosaving form's last change stands, said beside the form: saving, saved for a
 * moment, or failed until the next try. It takes the place of a toast for each change.
 */
export function SaveStatus({ state, error, savedFor = 2000, className }: SaveStatusProps) {
  const { messages } = useSkylcn();
  const [fresh, setFresh] = useState(false);

  // "Kaydedildi" is news only for a moment after it happens
  useEffect(() => {
    if (state !== 'saved') return;
    setFresh(true);
    const timer = setTimeout(() => setFresh(false), savedFor);
    return () => clearTimeout(timer);
  }, [state, savedFor]);

  const shown = state === 'saving' || state === 'error' || (state === 'saved' && fresh);
  return (
    <span
      role="status"
      data-slot="save-status"
      data-state={state}
      className={cn(
        'inline-flex min-h-5 items-center gap-1.5 text-2xs transition-opacity duration-(--motion-duration-base) ease-enter',
        shown ? 'opacity-100' : 'opacity-0',
        state === 'error' ? 'text-destructive-foreground' : 'text-subtle-foreground',
        className,
      )}
    >
      {state === 'saving' ? (
        <>
          <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
          {messages.saving}
        </>
      ) : state === 'saved' ? (
        <>
          <Check aria-hidden className="size-3.5 text-success" />
          {fresh ? messages.saved : null}
        </>
      ) : state === 'error' ? (
        <>
          <CircleAlert aria-hidden className="size-3.5" />
          {error ?? messages.saveFailed}
        </>
      ) : null}
    </span>
  );
}
