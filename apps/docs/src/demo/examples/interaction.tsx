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
  RadioCard,
  RadioGroup,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
  Textarea,
  useToast,
} from '@skylab-kulubu/skylcn-ui';
import { Archive, BarChart3, Settings, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Example } from '../doc';

function StepDialogExample() {
  const [step, setStep] = useState(0);
  return (
    <Example
      title="Adımlı pencere"
      description="animateHeight ile içerik değişince pencere yeni boyuna yumuşakça geçer."
    >
      <Dialog onOpenChange={(open) => open && setStep(0)}>
        <DialogTrigger render={<Button />}>Etkinlik oluştur</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni etkinlik</DialogTitle>
            <DialogDescription>
              {step === 0 ? '1. adım: ad' : '2. adım: ayrıntılar'}
            </DialogDescription>
          </DialogHeader>
          <DialogBody animateHeight className="flex flex-col gap-3">
            {step === 0 ? (
              <Field label="Etkinlik adı">
                <Input placeholder="Gece Kodu 2026" />
              </Field>
            ) : (
              <>
                <Field label="Yer">
                  <Input placeholder="Davutpaşa B-201" />
                </Field>
                <Field label="Kontenjan">
                  <Input type="number" placeholder="40" />
                </Field>
                <Field label="Açıklama">
                  <Textarea rows={4} placeholder="Katılımcılar ne yapacak?" />
                </Field>
              </>
            )}
          </DialogBody>
          <DialogFooter>
            {step === 1 ? (
              <Button variant="ghost" onClick={() => setStep(0)}>
                Geri
              </Button>
            ) : null}
            <Button variant="primary" onClick={() => setStep(1)} disabled={step === 1}>
              {step === 0 ? 'İleri' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  );
}

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
      <StepDialogExample />
      <Example
        title="Hata olunca"
        description="Eylem başarısız olunca hata metni gelir; pencere boyu sıçramadan uzar."
      >
        <ConfirmDialog
          trigger={<Button>Davetleri yeniden gönder</Button>}
          title="Davetler yeniden gönderilsin mi?"
          description="Yanıt vermeyen 23 kişiye e-posta gider."
          actionLabel="Gönder"
          failureMessage="Posta sunucusuna ulaşılamadı. Biraz sonra yeniden dene."
          onAction={() =>
            new Promise<void>((_, reject) => window.setTimeout(() => reject(new Error()), 700))
          }
        />
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
      <Example
        title="Ne olacağını sayan onay"
        description="Neyin gideceğini ve neyin kalacağını yan yana yazar; silmek için ekibin adını yazdırır."
      >
        <ConfirmDialog
          trigger={
            <Button variant="destructive">
              <Trash2 /> Ekibi sil
            </Button>
          }
          icon={Trash2}
          title="WebLab silinsin mi?"
          consequences={['18 üyenin ekip bağı kalkar', '4 taslak etkinlik silinir']}
          unaffected={['Geçmiş etkinlikler ve sertifikalar', 'Üyelerin hesapları']}
          confirmText="WebLab"
          actionLabel="Ekibi sil"
          destructive
          onAction={() => new Promise<void>((resolve) => window.setTimeout(resolve, 900))}
        />
        <ConfirmDialog
          trigger={
            <Button>
              <Archive /> Arşivle
            </Button>
          }
          icon={Archive}
          title="Gece Kodu 2026 arşivlensin mi?"
          description="Etkinlik listelerden kalkar, istediğinde geri alabilirsin."
          actionLabel="Arşivle"
          delay={3}
          onAction={() => {}}
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
    <>
      <RadioListExample />
      <RadioCardExample />
    </>
  );
}

function RadioListExample() {
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

function RadioCardExample() {
  return (
    <Example
      title="Kart olarak"
      description="Satırın tamamı tıklanır; seçilen kart lilayla dolar."
      align="start"
    >
      <RadioGroup aria-label="Katılım şekli" defaultValue="hall" className="w-full max-w-md">
        <RadioCard value="hall" label="Salonda" description="Kampüste, Davutpaşa B-201" />
        <RadioCard value="online" label="Çevrim içi" description="Bağlantı bir gün önce gelir" />
      </RadioGroup>
    </Example>
  );
}

function CommandExamples() {
  return (
    <Example
      title="Bu sayfanın araması"
      description="Başlıktaki Ara düğmesine bas ya da Ctrl/⌘+K: senaryolar ve bileşenler arasında ara, “uyeler” gibi aksansız yaz."
    >
      <p className="text-xs text-muted-foreground">Palet playground’un her sayfasında açık.</p>
    </Example>
  );
}

export const INTERACTION_EXAMPLES = {
  command: CommandExamples,
  dialog: DialogExamples,
  toast: ToastExamples,
  tabs: TabsExamples,
  accordion: AccordionExamples,
  'radio-group': RadioExamples,
};
