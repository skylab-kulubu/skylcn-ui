'use client';

import {
  Button,
  Kbd,
  Meter,
  Notice,
  Progress,
  SaveStatus,
  type SaveState,
  Separator,
  ToggleRow,
} from '@skylab-kulubu/skylcn-ui';
import { CalendarClock } from 'lucide-react';
import { useRef, useState } from 'react';
import { Example } from '../doc';

function FeedbackExamples() {
  const [shown, setShown] = useState(true);
  const [sent, setSent] = useState(38);
  return (
    <>
      <Example title="Uyarılar" align="start">
        {shown ? (
          <Notice tone="warning" title="SkyCloud bakımda" onDismiss={() => setShown(false)}>
            Dosyalara bu akşam 22.00’ye kadar erişilemeyebilir.
          </Notice>
        ) : (
          <Button size="sm" className="self-start" onClick={() => setShown(true)}>
            Uyarıyı geri getir
          </Button>
        )}
        <Notice
          tone="info"
          icon={CalendarClock}
          title="Başvurular yarın kapanıyor"
          action={<Button size="sm">Formu aç</Button>}
        />
        <Notice tone="danger" title="Gönderim durdu">
          Posta sunucusu yanıt vermiyor; kuyruk bekletiliyor.
        </Notice>
      </Example>
      <Example title="İlerleme ve düzey" align="start">
        <div className="flex max-w-md flex-col gap-4">
          <Progress label="Gönderiliyor" value={sent} />
          <Progress label="Liste hazırlanıyor" value={null} showValue={false} />
          <Meter label="Kontenjan" value={sent} />
          <Button
            size="sm"
            className="self-start"
            onClick={() => setSent((v) => (v >= 100 ? 10 : Math.min(100, v + 18)))}
          >
            İlerlet
          </Button>
        </div>
      </Example>
      <Example title="Kısayol ve ayraç">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          Ara <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
        <Separator orientation="vertical" className="h-5" />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          Kenar çubuğu <Kbd>Ctrl</Kbd>
          <Kbd>B</Kbd>
        </span>
      </Example>
    </>
  );
}

function AutosaveExample() {
  const [state, setState] = useState<SaveState>('idle');
  const saves = useRef(0);
  const save = () => {
    setState('saving');
    saves.current += 1;
    // Every fourth save fails here, to show the failure line
    const fails = saves.current % 4 === 0;
    window.setTimeout(() => setState(fails ? 'error' : 'saved'), 700);
  };
  return (
    <Example
      title="Kendiliğinden kaydeden ayarlar"
      description="Her değişiklik için toast yerine başlığın yanında tek satır. Dördüncü kayıt hata verir."
      align="start"
    >
      <div className="flex w-full max-w-md flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-foreground">Bildirimler</h3>
          <SaveStatus state={state} error="Kaydedilemedi, bağlantını kontrol et." />
        </div>
        <ToggleRow title="Etkinlik hatırlatmaları" defaultChecked onCheckedChange={save} />
        <ToggleRow title="Haftalık özet" onCheckedChange={save} />
        <ToggleRow title="Yeni üye bildirimi" onCheckedChange={save} />
      </div>
    </Example>
  );
}

function FeedbackPage() {
  return (
    <>
      <FeedbackExamples />
      <AutosaveExample />
    </>
  );
}

export const FEEDBACK_EXAMPLES = { feedback: FeedbackPage };
