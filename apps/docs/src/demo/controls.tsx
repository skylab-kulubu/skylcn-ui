'use client';

import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  SegmentedControl,
  useMotionPreference,
  useTheme,
  type MotionPreference,
  type SkylcnLocale,
  type ThemePreference,
} from '@skylab-kulubu/skylcn-ui';
import { SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { useDemoLocale } from '../app/providers';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

/** The playground's own knobs: theme, the package's language and reduced motion, for every scenario. */
export function PlaygroundControls() {
  const { theme, setTheme } = useTheme();
  const { motion, setMotion } = useMotionPreference();
  const { locale, setLocale } = useDemoLocale();
  return (
    <Popover>
      <PopoverTrigger
        render={<IconButton icon={SlidersHorizontal} label="Playground ayarları" variant="ghost" />}
      />
      <PopoverContent align="end" className="flex w-72 flex-col gap-3">
        <PopoverTitle className="text-xs font-semibold text-foreground">
          Playground ayarları
        </PopoverTitle>
        <Row label="Tema">
          <SegmentedControl
            aria-label="Tema"
            value={theme}
            onValueChange={(value) => setTheme(value as ThemePreference)}
            options={[
              { value: 'dark', label: 'Koyu' },
              { value: 'light', label: 'Açık' },
              { value: 'system', label: 'Sistem' },
            ]}
          />
        </Row>
        <Row label="Dil">
          <SegmentedControl
            aria-label="Dil"
            value={locale}
            onValueChange={(value) => setLocale(value as SkylcnLocale)}
            options={[
              { value: 'tr', label: 'TR' },
              { value: 'en', label: 'EN' },
            ]}
          />
        </Row>
        <Row label="Hareket">
          <SegmentedControl
            aria-label="Hareket"
            value={motion}
            onValueChange={(value) => setMotion(value as MotionPreference)}
            options={[
              { value: 'system', label: 'Sistem' },
              { value: 'reduced', label: 'Azaltılmış' },
            ]}
          />
        </Row>
      </PopoverContent>
    </Popover>
  );
}
