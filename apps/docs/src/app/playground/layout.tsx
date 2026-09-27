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
import { LayoutGrid } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { CONSOLES } from '../../demo/consoles';
import { PlaygroundControls } from '../../demo/controls';
import { DemoProfile } from '../../demo/profile';
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarItem href="/" label="Bileşen galerisi" icon={LayoutGrid} />
        <DemoProfile />
      </SidebarFooter>
    </>
  );
}

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const scenario = SCENARIOS.find((item) => item.href === pathname);
  return (
    <AppShell
      sidebar={<Sidebar pathname={pathname} />}
      header={
        <Breadcrumbs
          items={[
            { href: '/playground', label: 'Playground' },
            ...(scenario && scenario.href !== '/playground'
              ? [{ href: scenario.href, label: scenario.label }]
              : []),
          ]}
        />
      }
    >
      <AppShellActions>
        <PlaygroundControls />
      </AppShellActions>
      {children}
    </AppShell>
  );
}
