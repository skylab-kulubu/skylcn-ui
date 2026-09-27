'use client';

import { SideNav, SideNavLayout } from '@skylab-kulubu/skylcn-ui';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { CATEGORY_LABEL, ENTRIES, entryHref, ORDER } from '../../../demo/catalog';

const SECTIONS = ORDER.map((category) => ({
  label: CATEGORY_LABEL[category],
  items: ENTRIES.filter((entry) => entry.category === category).map((entry) => ({
    href: entryHref(entry.slug),
    label: entry.name,
  })),
}));

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <SideNavLayout
      nav={<SideNav aria-label="Bileşenler" sections={SECTIONS} activeHref={pathname} searchable />}
    >
      {children}
    </SideNavLayout>
  );
}
