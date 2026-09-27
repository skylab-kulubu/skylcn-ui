/** Made-up club figures for the playground dashboard; stable between renders. */

const MONTHS = ['Eki', 'Kas', 'Ara', 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl'];

export type Range = '3m' | '6m' | '12m';
export const RANGE_MONTHS: Record<Range, number> = { '3m': 3, '6m': 6, '12m': 12 };

const attendance = [212, 348, 290, 164, 188, 402, 377, 455, 198, 96, 120, 431];
const workshops = [4, 6, 5, 2, 3, 7, 6, 8, 3, 1, 1, 7];
const talks = [2, 3, 2, 1, 2, 3, 4, 3, 2, 0, 1, 3];
const contests = [0, 1, 0, 0, 1, 1, 0, 2, 1, 0, 0, 1];
const geceKodu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 38, 164, 412];
const yildizJam = [0, 0, 22, 96, 131, 20, 0, 0, 0, 0, 0, 0];
const artlab = [0, 0, 0, 0, 0, 14, 29, 38, 0, 0, 0, 0];

export function monthly(range: Range) {
  const n = RANGE_MONTHS[range];
  return MONTHS.map((month, i) => ({
    month,
    attendance: attendance[i]!,
    workshops: workshops[i]!,
    talks: talks[i]!,
    contests: contests[i]!,
    geceKodu: geceKodu[i]!,
    yildizJam: yildizJam[i]!,
    artlab: artlab[i]!,
  })).slice(12 - n);
}

export function sum(range: Range, key: 'attendance' | 'workshops' | 'talks' | 'contests') {
  return monthly(range).reduce((total, row) => total + row[key], 0);
}
