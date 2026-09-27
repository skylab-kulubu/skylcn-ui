'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSkylcn } from '../lib/provider.js';
import { Button, type ButtonProps } from './button.js';
import { IconSwap } from './icon-swap.js';

export type CopyButtonProps = Omit<ButtonProps, 'children' | 'onClick'> & {
  /** The text put on the clipboard. */
  value: string;
  /** Names the button; "Kopyala" by default. */
  label?: string;
};

/** Copies a value, then turns its icon into a tick for a moment and says so to screen readers. */
export function CopyButton({
  value,
  label,
  variant = 'ghost',
  size = 'icon-sm',
  ...props
}: CopyButtonProps) {
  const { messages } = useSkylcn();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const name = copied ? messages.copied : (label ?? messages.copy);
  return (
    <>
      <Button
        variant={variant}
        size={size}
        aria-label={name}
        title={name}
        onClick={() => {
          void navigator.clipboard?.writeText(value).then(() => setCopied(true));
        }}
        {...props}
      >
        <IconSwap swapped={copied} icon={Copy} swappedIcon={Check} className="size-3.5" />
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? messages.copied : ''}
      </span>
    </>
  );
}
