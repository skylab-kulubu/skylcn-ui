/** Made-up sends for the mail scenario: skymail's outbound operations, not an inbox. */

export type SendState = 'queued' | 'sent' | 'failed' | 'pending' | 'returned' | 'rejected';

export type Send = {
  id: string;
  subject: string;
  audience: string;
  author: string;
  when: string;
  state: SendState;
  sent: number;
  failed: number;
  preview: string;
};

export const SENDS: Send[] = [
  {
    id: 's1',
    subject: 'Gece Kodu 2026 başvuruları açıldı',
    audience: 'Tüm üyeler',
    author: 'Deniz Aydın',
    when: '10.42',
    state: 'pending',
    sent: 0,
    failed: 0,
    preview: 'Merhaba! 4–5 Ekim’de Davutpaşa’da 24 saatlik kodlama gecesi için başvurular açıldı…',
  },
  {
    id: 's2',
    subject: 'Web atölyesinin salonu değişti',
    audience: 'WebLab listesi',
    author: 'Mira Tunç',
    when: 'Dün',
    state: 'sent',
    sent: 118,
    failed: 2,
    preview: 'Cumartesi günkü atölye B blok 204 yerine Kongre Merkezi’nde yapılacak…',
  },
  {
    id: 's3',
    subject: 'SkySec CTF hazırlık oturumu',
    audience: 'SkySec listesi',
    author: 'Arda Tunç',
    when: 'Dün',
    state: 'returned',
    sent: 0,
    failed: 0,
    preview: 'Hazırlık oturumu için konu satırı kısaltıldı; onaylarsan gönderilir…',
  },
  {
    id: 's4',
    subject: 'Stant haftası gönüllü çağrısı',
    audience: '42 kişi',
    author: 'Deniz Aydın',
    when: 'Pzt',
    state: 'sent',
    sent: 42,
    failed: 0,
    preview: 'Stant haftasında kulübü tanıtmak için gönüllü arıyoruz…',
  },
  {
    id: 's5',
    subject: 'Mezunlar buluşması',
    audience: 'Mezunlar listesi',
    author: 'Ece Kaya',
    when: 'Pzt',
    state: 'queued',
    sent: 23,
    failed: 0,
    preview: 'Bu yılki mezunlar buluşması 18 Ekim’de…',
  },
  {
    id: 's6',
    subject: 'Üyelik aidatı hatırlatması',
    audience: 'Tüm üyeler',
    author: 'Mert Işık',
    when: '19 Eyl',
    state: 'failed',
    sent: 301,
    failed: 97,
    preview: 'Posta sunucusu yanıt vermediği için gönderim yarıda kaldı…',
  },
  {
    id: 's7',
    subject: 'Kulüp tişörtü siparişi',
    audience: 'Tüm üyeler',
    author: 'Ece Kaya',
    when: '15 Eyl',
    state: 'rejected',
    sent: 0,
    failed: 0,
    preview: 'Sipariş formu henüz hazır olmadığı için reddedildi…',
  },
];

export const FOLDERS = [
  { id: 'all', label: 'Tüm gönderimler', group: 'Gönderimler' },
  { id: 'queued', label: 'Kuyrukta', group: 'Gönderimler' },
  { id: 'sent', label: 'Gönderildi', group: 'Gönderimler' },
  { id: 'failed', label: 'Başarısız', group: 'Gönderimler' },
  { id: 'pending', label: 'Beni bekleyen', group: 'Onaylar' },
  { id: 'returned', label: 'Geri dönen', group: 'Onaylar' },
  { id: 'rejected', label: 'Reddedilen', group: 'Onaylar' },
] as const;

export const LISTS = [
  { id: 'l1', label: 'Tüm üyeler', count: 124 },
  { id: 'l2', label: 'WebLab', count: 19 },
  { id: 'l3', label: 'SkySec', count: 13 },
  { id: 'l4', label: 'Mezunlar', count: 19 },
];

export const STATE_LABEL: Record<SendState, string> = {
  queued: 'Kuyrukta',
  sent: 'Gönderildi',
  failed: 'Başarısız',
  pending: 'Onay bekliyor',
  returned: 'Geri döndü',
  rejected: 'Reddedildi',
};

export const STATE_TONE = {
  queued: 'info',
  sent: 'success',
  failed: 'danger',
  pending: 'warning',
  returned: 'brand',
  rejected: 'neutral',
} as const;
