'use client';

import {
  MenuItem,
  MenuLabel,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  SidebarUser,
  useTheme,
  type ThemePreference,
} from '@skylab-kulubu/skylcn-ui';
import { LogOut, Palette, UserRound } from 'lucide-react';
import { HOSTED_IN_ADMIN } from './hosting';
import { ACCOUNT_URL, signOutOfHost, useHostUser } from './session';

const DEMO_PERSON = { name: 'Deniz Aydın', email: 'deniz@example.com', subtitle: 'WebLab' };

/**
 * The signed-in person at the foot of a demo sidebar, with the profile menu
 * every console shares: a made-up member on its own, the real one inside the
 * admin panel.
 */
export function DemoProfile() {
  const { theme, setTheme } = useTheme();
  const { user, loading } = useHostUser();
  if (HOSTED_IN_ADMIN && !user) {
    return loading ? <div aria-hidden className="h-13" /> : null;
  }
  const person = user ?? DEMO_PERSON;
  return (
    <SidebarUser
      name={person.name}
      email={person.email}
      subtitle={user ? user.roleLabel : DEMO_PERSON.subtitle}
      menu={
        <>
          {person.email ? <MenuLabel>{person.email}</MenuLabel> : null}
          <MenuLinkItem href={HOSTED_IN_ADMIN ? ACCOUNT_URL : '#account'} icon={UserRound}>
            Hesap merkezi
          </MenuLinkItem>
          <MenuSub>
            <MenuSubTrigger icon={Palette}>Tema</MenuSubTrigger>
            <MenuSubContent>
              <MenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as ThemePreference)}
              >
                <MenuRadioItem value="dark">Koyu</MenuRadioItem>
                <MenuRadioItem value="light">Açık</MenuRadioItem>
                <MenuRadioItem value="system">Sistem</MenuRadioItem>
              </MenuRadioGroup>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuItem
            icon={LogOut}
            destructive
            onClick={HOSTED_IN_ADMIN ? () => void signOutOfHost() : undefined}
          >
            Çıkış yap
          </MenuItem>
        </>
      }
    />
  );
}
