import { BLOCK_BY_TYPE } from './blocks';
import { block, section, type Block, type BlockProps, type LayoutKey, type Page } from './model';

const b = (type: string, props: BlockProps = {}): Block =>
  block(type, { ...(BLOCK_BY_TYPE.get(type)?.defaults ?? {}), ...props });
const s = (layout: LayoutKey, ...columns: Block[][]) => section(layout, columns);

export type Preset = { id: string; label: string; description: string; build: () => Page };

/** Ready pages to start from; each call builds fresh ids. */
export const PRESETS: Preset[] = [
  {
    id: 'dashboard',
    label: 'Pano',
    description: 'Sayılar, eğilim ve son olaylar',
    build: () => ({
      sections: [
        s('1', [
          b('page-header', { title: 'Genel bakış', description: 'Kulübün bu dönemki durumu.' }),
        ]),
        s(
          '4',
          [b('stat')],
          [
            b('stat', {
              label: 'Etkinlik',
              value: 18,
              icon: 'CalendarDays',
              delta: '+3',
              hint: 'Bu dönem',
              trend: false,
            }),
          ],
          [
            b('stat', {
              label: 'Başvuru',
              value: 1240,
              icon: 'FileText',
              delta: '+212',
              hint: 'Son 30 gün',
              trend: false,
            }),
          ],
          [
            b('stat', {
              label: 'Doluluk',
              value: 87,
              icon: 'Gauge',
              delta: '-4',
              tone: 'negative',
              hint: 'Yüzde',
              trend: false,
            }),
          ],
        ),
        s('2-1', [b('area-chart')], [b('donut-chart')]),
        s('2', [b('bar-chart')], [b('timeline', { count: 4 })]),
      ],
    }),
  },
  {
    id: 'list',
    label: 'Liste sayfası',
    description: 'Başlık, arama, liste ve yan bilgi',
    build: () => ({
      sections: [
        s('1', [
          b('page-header', {
            title: 'Üyeler',
            description: 'Kulübün üyeleri ve ekipleri.',
            action: 'Üye ekle',
          }),
        ]),
        s('1', [b('search'), b('segmented', { label: 'Durum', options: 'Tümü, Aktif, Mezun' })]),
        s('2-1', [b('member-list', { count: 6 })], [b('bar-list'), b('avatars')]),
      ],
    }),
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    description: 'Form alanları, anahtarlar ve kayıt',
    build: () => ({
      sections: [
        s('1', [
          b('page-header', {
            title: 'Etkinlik ayarları',
            description: 'Başvuru ve bildirim tercihleri.',
            action: '',
          }),
        ]),
        s(
          '2',
          [
            b('text-field'),
            b('text-field', {
              label: 'Açıklama',
              placeholder: 'Kısa bir tanıtım',
              multiline: true,
            }),
            b('select-field'),
          ],
          [
            b('toggle'),
            b('toggle', {
              title: 'Misafir başvurusu',
              description: 'Hesabı olmayanlar form ile başvurabilir.',
              checked: false,
            }),
            b('notice', {
              tone: 'warning',
              title: 'Kontenjan dolmak üzere',
              body: 'Yüzde 90 dolu; bekleme listesini açabilirsin.',
            }),
          ],
        ),
        s('1', [b('buttons')]),
      ],
    }),
  },
  {
    id: 'blank',
    label: 'Boş sayfa',
    description: 'Tek bir boş bölüm',
    build: () => ({ sections: [s('1', [])] }),
  },
];
