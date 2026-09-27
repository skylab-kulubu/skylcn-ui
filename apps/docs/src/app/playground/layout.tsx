'use client';

import {
  AppShell,
  AppShellActions,
  Breadcrumbs,
  SidebarBrand,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
  SidebarSection,
} from '@skylab-kulubu/skylcn-ui';
import { Blocks } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { CONSOLES } from '../../demo/consoles';
import { PlaygroundControls } from '../../demo/controls';
import { PlaygroundSearch } from '../../demo/palette';
import { DemoProfile } from '../../demo/profile';
import { ENTRIES } from '../../demo/catalog';
import { MEMBERS } from '../../demo/members';
import { SCENARIOS, SCENARIO_GROUPS } from '../../demo/scenarios';

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <>
      <SidebarBrand
        name="SKY LAB Playground"
        subtitle="Senaryolar"
        current="playground"
        consoles={CONSOLES}
      />
      <SidebarContent>
        {SCENARIO_GROUPS.map((group) => (
          <SidebarSection key={group.label} label={group.label}>
            {group.scenarios.map((scenario) => (
              <SidebarItem
                key={scenario.href}
                href={scenario.href}
                label={scenario.label}
                icon={scenario.icon}
                active={
                  pathname === scenario.href ||
                  (scenario.href !== '/playground' && pathname.startsWith(`${scenario.href}/`))
                }
              />
            ))}
          </SidebarSection>
        ))}
        <SidebarSection label="Kütüphane">
          <SidebarItem
            href="/playground/components"
            label="Bileşenler"
            icon={Blocks}
            badge={ENTRIES.length}
            active={pathname.startsWith('/playground/components')}
          />
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <DemoProfile />
      </SidebarFooter>
    </>
  );
}

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const scenario =
    SCENARIOS.find((item) => item.href === pathname) ??
    (pathname.startsWith('/playground/members/')
      ? SCENARIOS.find((item) => item.href === '/playground/members')
      : undefined);
  const inLibrary = pathname.startsWith('/playground/components');
  const member = MEMBERS.find((item) => pathname === `/playground/members/${item.id}`);
  const entry = ENTRIES.find((item) => pathname === `/playground/components/${item.slug}`);
  const crumbs = [
    { href: '/playground', label: 'Playground' },
    ...(inLibrary ? [{ href: '/playground/components', label: 'Bileşenler' }] : []),
    ...(entry ? [{ href: pathname, label: entry.name }] : []),
    ...(scenario && scenario.href !== '/playground'
      ? [{ href: scenario.href, label: scenario.label }]
      : []),
    ...(member ? [{ href: pathname, label: member.name }] : []),
  ];
  return (
    <AppShell sidebar={<Sidebar pathname={pathname} />} header={<Breadcrumbs items={crumbs} />}>
      <AppShellActions>
        <PlaygroundSearch />
        <PlaygroundControls />
      </AppShellActions>
      {children}
    </AppShell>
  );
}
