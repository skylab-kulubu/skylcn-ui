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

/** The signed-in person at the foot of a demo sidebar, with the profile menu every console shares. */
export function DemoProfile() {
  const { theme, setTheme } = useTheme();
  return (
    <SidebarUser
      name="Deniz Aydın"
      email="deniz@example.com"
      subtitle="WebLab"
      menu={
        <>
          <MenuLabel>deniz@example.com</MenuLabel>
          <MenuLinkItem href="#account" icon={UserRound}>
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
          <MenuItem icon={LogOut} destructive>
            Çıkış yap
          </MenuItem>
        </>
      }
    />
  );
}
