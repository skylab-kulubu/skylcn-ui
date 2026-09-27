'use client';

import {
  Button,
  CommandPalette,
  Kbd,
  useCommandShortcut,
  type CommandItem,
} from '@skylab-kulubu/skylcn-ui';
import { Blocks, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CATEGORY_LABEL, ENTRIES, entryHref } from './catalog';
import { SCENARIOS } from './scenarios';

const ITEMS: CommandItem[] = [
  ...SCENARIOS.map((s) => ({
    id: s.href,
    label: s.label,
    group: 'Senaryolar',
    icon: s.icon,
    href: s.href,
  })),
  {
    id: 'lib',
    label: 'Tüm bileşenler',
    group: 'Kütüphane',
    icon: Blocks,
    href: '/playground/components',
  },
  ...ENTRIES.map((e) => ({
    id: e.slug,
    label: e.name,
    group: 'Kütüphane',
    keywords: `${CATEGORY_LABEL[e.category]} ${e.imports.join(' ')}`,
    href: entryHref(e.slug),
  })),
];

/** The playground's search button and its Ctrl/⌘+K palette over scenarios and library pages. */
export function PlaygroundSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useCommandShortcut(useCallback(() => setOpen(true), []));
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label="Ara"
        className="gap-2"
      >
        <Search />
        <span className="hidden text-subtle-foreground sm:inline">Ara</span>
        <span className="hidden items-center gap-0.5 sm:flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>
      <CommandPalette
        items={ITEMS}
        open={open}
        onOpenChange={setOpen}
        navigate={(href) => router.push(href)}
      />
    </>
  );
}
