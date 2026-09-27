/** A made-up form's replies for the analytics scenario. */

export type Question = {
  id: string;
  text: string;
  kind: 'choice' | 'multi' | 'number' | 'toggle';
  answered: number;
  distribution: { key: string; label: string; value: number }[];
  numeric?: { average: number; median: number; min: number; max: number };
};

export const TOTAL_RESPONSES = 412;

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Hangi bölümde okuyorsun?',
    kind: 'choice',
    answered: 409,
    distribution: [
      { key: 'bm', label: 'Bilgisayar Mühendisliği', value: 198 },
      { key: 'em', label: 'Elektronik ve Haberleşme', value: 74 },
      { key: 'mt', label: 'Matematik Mühendisliği', value: 51 },
      { key: 'ek', label: 'Endüstri Mühendisliği', value: 38 },
      { key: 'ot', label: 'Diğer bölümler', value: 48 },
    ],
  },
  {
    id: 'q2',
    text: 'Daha önce bir hackathona katıldın mı?',
    kind: 'toggle',
    answered: 405,
    distribution: [
      { key: 'yes', label: 'Evet', value: 163 },
      { key: 'no', label: 'Hayır', value: 242 },
    ],
  },
  {
    id: 'q3',
    text: 'Hangi alanlarda çalışmak istersin?',
    kind: 'multi',
    answered: 398,
    distribution: [
      { key: 'web', label: 'Web', value: 231 },
      { key: 'ai', label: 'Yapay zekâ', value: 204 },
      { key: 'game', label: 'Oyun', value: 118 },
      { key: 'sec', label: 'Güvenlik', value: 96 },
      { key: 'mobile', label: 'Mobil', value: 88 },
    ],
  },
  {
    id: 'q4',
    text: 'Takımın kaç kişi?',
    kind: 'number',
    answered: 352,
    numeric: { average: 3.4, median: 4, min: 1, max: 5 },
    distribution: [
      { key: '1', label: '1 kişi', value: 41 },
      { key: '2', label: '2 kişi', value: 36 },
      { key: '3', label: '3 kişi', value: 88 },
      { key: '4', label: '4 kişi', value: 142 },
      { key: '5', label: '5 kişi', value: 45 },
    ],
  },
  {
    id: 'q5',
    text: 'Konaklama gerekiyor mu?',
    kind: 'toggle',
    answered: 188,
    distribution: [
      { key: 'yes', label: 'Evet', value: 61 },
      { key: 'no', label: 'Hayır', value: 127 },
    ],
  },
];

export const DAILY = [
  { label: '20 Eyl', count: 12 },
  { label: '21 Eyl', count: 31 },
  { label: '22 Eyl', count: 58 },
  { label: '23 Eyl', count: 44 },
  { label: '24 Eyl', count: 72 },
  { label: '25 Eyl', count: 96 },
  { label: '26 Eyl', count: 99 },
];

export const HOURLY = Array.from({ length: 12 }, (_, i) => ({
  label: `${String(i * 2).padStart(2, '0')}:00`,
  count: [2, 1, 0, 0, 1, 4, 9, 14, 11, 16, 21, 17][i]!,
}));
