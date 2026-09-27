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
import { DemoProfile } from '../../demo/profile';
import { ENTRIES } from '../../demo/catalog';
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
                active={pathname === scenario.href}
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
  const scenario = SCENARIOS.find((item) => item.href === pathname);
  const inLibrary = pathname.startsWith('/playground/components');
  const entry = ENTRIES.find((item) => pathname === `/playground/components/${item.slug}`);
  const crumbs = [
    { href: '/playground', label: 'Playground' },
    ...(inLibrary ? [{ href: '/playground/components', label: 'Bileşenler' }] : []),
    ...(entry ? [{ href: pathname, label: entry.name }] : []),
    ...(scenario && scenario.href !== '/playground'
      ? [{ href: scenario.href, label: scenario.label }]
      : []),
  ];
  return (
    <AppShell sidebar={<Sidebar pathname={pathname} />} header={<Breadcrumbs items={crumbs} />}>
      <AppShellActions>
        <PlaygroundControls />
      </AppShellActions>
      {children}
    </AppShell>
  );
}
