'use client';

import { SkylcnProvider, TooltipProvider } from '@skylab-kulubu/skylcn-ui';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SkylcnProvider linkComponent={Link}>
      <TooltipProvider>{children}</TooltipProvider>
    </SkylcnProvider>
  );
}
