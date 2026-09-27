'use client';

import { Button, Kbd, Meter, Notice, Progress, Separator } from '@skylab-kulubu/skylcn-ui';
import { useState } from 'react';
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

export const FEEDBACK_EXAMPLES = { feedback: FeedbackExamples };
