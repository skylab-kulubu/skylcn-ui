'use client';

import {
  Button,
  SegmentedControl,
  SkylabLoader,
  SkylabMark,
  m,
  motionTokens,
  useMotionPreference,
  type MotionPreference,
} from '@skylab-kulubu/skylcn-ui';
import { useEffect, useState } from 'react';
import { Example } from '../doc';

function luminance(hex: string) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/** The current value of each token, read again whenever the theme changes. */
function useTokens(names: readonly string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      setValues(
        Object.fromEntries(names.map((name) => [name, style.getPropertyValue(`--${name}`).trim()])),
      );
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, [names]);
  return values;
}

const TEXT = [
  'foreground',
  'secondary-foreground',
  'muted-foreground',
  'subtle-foreground',
  'faint-foreground',
] as const;
const SURFACES = ['sidebar', 'background', 'sheet', 'popover'] as const;
const STATUS = ['destructive', 'success', 'warning', 'info'] as const;
const BRAND = [
  'skylab-300',
  'skylab-400',
  'skylab-500',
  'skylab-600',
  'skylab-700',
  'skylab-800',
  'skylab-900',
] as const;
const CHART = [
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'chart-6',
  'chart-7',
  'chart-8',
] as const;
const ALL = [...TEXT, ...SURFACES, ...STATUS, ...BRAND, ...CHART, 'primary'];

function Swatch({ name, value, against }: { name: string; value?: string; against?: string }) {
  const ratio =
    value?.startsWith('#') && against?.startsWith('#') && value.length === 7 && against.length === 7
      ? contrast(value, against)
      : null;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className="size-9 shrink-0 rounded-lg border border-border"
        style={{ background: `var(--${name})` }}
      />
      <div className="min-w-0">
        <p className="truncate font-mono text-2xs text-foreground">--{name}</p>
        <p className="font-mono text-3xs text-subtle-foreground">
          {value || '…'}
          {ratio ? ` · ${ratio.toFixed(2)}:1` : ''}
        </p>
      </div>
    </div>
  );
}

function Palette({ names, against }: { names: readonly string[]; against?: string }) {
  const values = useTokens(ALL);
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {names.map((name) => (
        <Swatch
          key={name}
          name={name}
          value={values[name]}
          against={against ? values[against] : undefined}
        />
      ))}
    </div>
  );
}

function Colors() {
  return (
    <>
      <Example
        title="Metin tonları"
        description="Oran, sayfa zemini (--background) karşısında."
        align="start"
      >
        <Palette names={TEXT} against="background" />
      </Example>
      <Example
        title="Yüzeyler"
        description="Kenar çubuğu, sayfa, sayfa üstü panel, açılır pencere."
        align="start"
      >
        <Palette names={SURFACES} />
      </Example>
      <Example
        title="Marka lilası"
        description="Renkler değişmedi; koyu ve açık temada ayrı adımlar."
        align="start"
      >
        <Palette names={[...BRAND, 'primary']} against="background" />
      </Example>
      <Example
        title="Durum"
        description="Anlamı sabit renkler; her zaman ikon ya da metinle birlikte."
        align="start"
      >
        <Palette names={STATUS} against="background" />
      </Example>
      <Example
        title="Grafik paleti"
        description="Sabit sırada sekiz renk; renk körlüğü ve normal görüşte komşular ayırt edilir diye doğrulandı."
        align="start"
      >
        <Palette names={CHART} against="background" />
      </Example>
    </>
  );
}

const TYPE = [
  ['text-2xl', 'Sayfa ve pano başlığı', 'Genel bakış'],
  ['text-lg', 'Sayfa başlığı', 'Üyeler'],
  ['text-sm', 'Gövde, liste satırı', 'Gece Kodu 2026 başvuruları açıldı.'],
  ['text-xs', 'Yardımcı metin, kontrol', 'Kayıt olduğun etkinlikten bir gün önce.'],
  ['text-2xs', 'Meta satırı', '412 yanıt · son 7 gün'],
  ['text-3xs tracking-label uppercase', 'Etiket, sütun başlığı', 'Katıldı'],
] as const;

function Typography() {
  return (
    <>
      <Example title="Ölçek" align="start">
        <div className="flex flex-col divide-y divide-border-subtle">
          {TYPE.map(([cls, use, sample]) => (
            <div key={cls} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:items-baseline">
              <p className="font-mono text-3xs text-subtle-foreground">
                {cls.split(' ')[0]} · {use}
              </p>
              <p className={`${cls} text-foreground`}>{sample}</p>
            </div>
          ))}
        </div>
      </Example>
      <Example title="Yazı aileleri" align="start">
        <p className="text-lg text-foreground">Space Grotesk — SKY LAB Kulüp Konsolu 0123456789</p>
        <p className="font-mono text-sm text-secondary-foreground">
          Space Mono — skylab-kulubu/skylcn-ui@0.1.0
        </p>
      </Example>
    </>
  );
}

const CURVES = [
  {
    key: 'enter',
    label: 'Giriş eğrisi',
    note: '200ms · cubic-bezier(0.22, 1, 0.36, 1)',
    transition: { duration: 0.2, ease: motionTokens.ease.enter },
  },
  {
    key: 'exit',
    label: 'Çıkış eğrisi',
    note: '150ms · cubic-bezier(0.4, 0, 0.2, 1)',
    transition: { duration: 0.15, ease: motionTokens.ease.exit },
  },
  {
    key: 'slow',
    label: 'Yavaş giriş',
    note: '350ms · kartlar ve bölümler',
    transition: { duration: 0.35, ease: motionTokens.ease.enter },
  },
  {
    key: 'spring',
    label: 'Yay',
    note: 'stiffness 300 · damping 30 · mass 0.8',
    transition: motionTokens.spring,
  },
] as const;

function Motion() {
  const [flip, setFlip] = useState(false);
  const { motion, setMotion } = useMotionPreference();
  return (
    <>
      <Example
        title="Eğriler ve yay"
        description="Oynat: her kutu kendi eğrisiyle yolun sonuna gider."
        align="start"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm" onClick={() => setFlip((value) => !value)}>
            Oynat
          </Button>
          <SegmentedControl
            aria-label="Hareket"
            value={motion}
            onValueChange={(value) => setMotion(value as MotionPreference)}
            options={[
              { value: 'system', label: 'Sistem' },
              { value: 'reduced', label: 'Azaltılmış' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-4">
          {CURVES.map((curve) => (
            <div key={curve.key} className="flex flex-col gap-1.5">
              <p className="text-2xs text-muted-foreground">
                <span className="text-foreground">{curve.label}</span> · {curve.note}
              </p>
              <div
                className={`flex h-8 max-w-lg rounded-lg bg-muted p-1 ${flip ? 'justify-end' : 'justify-start'}`}
              >
                <m.span
                  layout
                  transition={curve.transition}
                  className="size-6 rounded-md bg-skylab-500"
                />
              </div>
            </div>
          ))}
        </div>
      </Example>
      <Example title="Süreler" align="start">
        <div className="grid gap-2 font-mono text-2xs sm:grid-cols-2">
          {Object.entries(motionTokens.duration).map(([name, seconds]) => (
            <p key={name} className="text-secondary-foreground">
              --motion-duration-{name}{' '}
              <span className="text-subtle-foreground">{seconds * 1000}ms</span>
            </p>
          ))}
          <p className="text-secondary-foreground">
            --motion-stagger{' '}
            <span className="text-subtle-foreground">{motionTokens.stagger * 1000}ms</span>
          </p>
          <p className="text-secondary-foreground">
            --motion-shift{' '}
            <span className="text-subtle-foreground">
              {motionTokens.shift}px / {motionTokens.shiftLarge}px
            </span>
          </p>
        </div>
      </Example>
    </>
  );
}

function Brand() {
  return (
    <>
      <Example title="İşaret" description="Metinsiz SKY LAB işareti, marka yerlerinde.">
        <SkylabMark size={20} className="text-foreground" />
        <SkylabMark size={32} className="text-foreground" />
        <SkylabMark size={56} className="text-skylab-300" />
      </Example>
      <Example title="Yükleyici" description="Butonlarda 16–24px, sayfa durumlarında 64–80px.">
        <SkylabLoader size={16} />
        <SkylabLoader size={24} />
        <SkylabLoader size={48} />
        <SkylabLoader size={80} />
        <p className="shimmer-text text-sm font-semibold text-muted-foreground">Yükleniyor…</p>
      </Example>
    </>
  );
}

export const FOUNDATION_EXAMPLES = {
  colors: Colors,
  typography: Typography,
  motion: Motion,
  brand: Brand,
};
