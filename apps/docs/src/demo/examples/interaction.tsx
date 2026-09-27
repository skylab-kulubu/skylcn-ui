'use client';

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
  ConfirmDialog,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
  useToast,
} from '@skylab-kulubu/skylcn-ui';
import { BarChart3, Settings, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Example } from '../doc';

function DialogExamples() {
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const toast = useToast();
  return (
    <>
      <Example title="Form penceresi" description="Telefonda alttan açılan bir panele dönüşür.">
        <Dialog>
          <DialogTrigger render={<Button variant="primary" />}>Liste oluştur</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni posta listesi</DialogTitle>
              <DialogDescription>Listeye sonra üye ya da grup eklersin.</DialogDescription>
            </DialogHeader>
            <DialogBody className="flex flex-col gap-3">
              <Field label="Liste adı">
                <Input placeholder="WebLab duyuruları" />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button variant="primary">Oluştur</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Example>
      <Example
        title="Geri alınamaz eylem"
        description="Odak Vazgeç’te başlar; eylem ne olacağını söyler."
      >
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button variant="destructive">
              <Trash2 /> Formu sil
            </Button>
          }
          title="“Gece Kodu 2026 başvuru” silinsin mi?"
          description="412 yanıtıyla birlikte kalıcı olarak silinir; bu geri alınamaz."
          actionLabel="Formu sil"
          destructive
          pending={deleting}
          onAction={() => {
            setDeleting(true);
            window.setTimeout(() => {
              setDeleting(false);
              setOpen(false);
              toast.add({ title: 'Form silindi', type: 'success' });
            }, 900);
          }}
        />
      </Example>
    </>
  );
}

function ToastExamples() {
  const toast = useToast();
  return (
    <Example
      title="Bildirimler"
      description="Birkaç tane aç: yığılırlar, üzerine gelince açılırlar."
    >
      <Button
        onClick={() =>
          toast.add({ title: 'Kaydedildi', description: 'Ayarların güncellendi.', type: 'success' })
        }
      >
        Başarı
      </Button>
      <Button
        onClick={() =>
          toast.add({
            title: 'Gönderilemedi',
            description: 'Posta sunucusuna ulaşılamadı. Birazdan yeniden dene.',
            type: 'error',
            timeout: 0,
          })
        }
      >
        Hata (kalıcı)
      </Button>
      <Button
        onClick={() => {
          const id = toast.add({
            title: 'Üye listeden çıkarıldı',
            type: 'info',
            timeout: 0,
            actionProps: {
              children: 'Geri al',
              onClick: () => {
                toast.close(id);
                toast.add({ title: 'Geri alındı', type: 'success' });
              },
            },
          });
        }}
      >
        Geri almalı
      </Button>
    </Example>
  );
}

function TabsExamples() {
  return (
    <Example title="Üye sayfası" align="start">
      <Tabs defaultValue="overview">
        <TabsList>
          <Tab value="overview">
            <Users /> Genel
          </Tab>
          <Tab value="activity">
            <BarChart3 /> Etkinlikler
          </Tab>
          <Tab value="settings">
            <Settings /> Ayarlar
          </Tab>
        </TabsList>
        <TabsPanel value="overview" className="text-sm text-muted-foreground">
          WebLab ekibinde, 2024’ten beri üye.
        </TabsPanel>
        <TabsPanel value="activity" className="text-sm text-muted-foreground">
          Son dönemde 12 etkinliğe katıldı.
        </TabsPanel>
        <TabsPanel value="settings" className="text-sm text-muted-foreground">
          Bildirimler açık, haftalık özet kapalı.
        </TabsPanel>
      </Tabs>
    </Example>
  );
}

function AccordionExamples() {
  return (
    <Example title="Sık sorulan sorular" align="start">
      <Accordion className="max-w-lg" defaultValue={['q1']}>
        {[
          [
            'q1',
            'Kimler başvurabilir?',
            'Üniversitenin tüm öğrencileri; takımlar en fazla beş kişi.',
          ],
          [
            'q2',
            'Konaklama var mı?',
            'Etkinlik alanında gece boyunca açık bir dinlenme alanı var.',
          ],
          ['q3', 'Başvurumu nasıl geri çekerim?', 'Onay e-postasındaki bağlantıdan tek tıkla.'],
        ].map(([value, question, answer]) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionPanel>{answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Example>
  );
}

function RadioExamples() {
  return (
    <Example title="Gönderim zamanı" align="start">
      <RadioGroup aria-label="Gönderim zamanı" defaultValue="now">
        <Radio value="now" label="Hemen gönder" description="Onaylandığı anda kuyruğa girer." />
        <Radio value="later" label="Zamanla" description="Seçtiğin tarih ve saatte gönderilir." />
        <Radio value="draft" label="Taslak olarak sakla" disabled />
      </RadioGroup>
    </Example>
  );
}

export const INTERACTION_EXAMPLES = {
  dialog: DialogExamples,
  toast: ToastExamples,
  tabs: TabsExamples,
  accordion: AccordionExamples,
  'radio-group': RadioExamples,
};
