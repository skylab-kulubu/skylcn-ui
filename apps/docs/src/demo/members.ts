/** Made-up club members for the playground: the same list on every load, no real people. */

export type MemberStatus = 'active' | 'inactive' | 'alumni';
export type MemberRole = 'member' | 'lead' | 'board';

export type Member = {
  id: string;
  name: string;
  email: string;
  team: string;
  role: MemberRole;
  status: MemberStatus;
  joined: string;
  events: number;
};

const FIRST = [
  'Ada',
  'Berk',
  'Cansu',
  'Deniz',
  'Ece',
  'Emir',
  'Irmak',
  'Kerem',
  'Lale',
  'Mert',
  'Nehir',
  'Onur',
  'Pelin',
  'Rüzgar',
  'Selin',
  'Tuna',
  'Umut',
  'Yağmur',
  'Zeynep',
  'Arda',
];
const LAST = [
  'Aksoy',
  'Balcı',
  'Çelik',
  'Demirtaş',
  'Erdem',
  'Gündoğdu',
  'Işık',
  'Kaya',
  'Özkan',
  'Polat',
  'Sarı',
  'Şahin',
  'Tekin',
  'Uysal',
  'Yalçın',
  'Yıldırım',
  'Zengin',
  'Acar',
];
export const TEAMS = ['WebLab', 'SkySec', 'Oyun', 'Yapay zekâ', 'Tasarım', 'Etkinlik'];

// mulberry32: a tiny seeded generator, so the list is the same on every render and build.
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ascii(text: string) {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u');
}

export const MEMBERS: Member[] = (() => {
  const random = seeded(2026);
  const pick = <T>(list: readonly T[]) => list[Math.floor(random() * list.length)]!;
  return Array.from({ length: 124 }, (_, i) => {
    const first = pick(FIRST);
    const last = pick(LAST);
    const roll = random();
    const status: MemberStatus = roll < 0.68 ? 'active' : roll < 0.86 ? 'inactive' : 'alumni';
    const role: MemberRole = i % 23 === 0 ? 'board' : i % 7 === 0 ? 'lead' : 'member';
    // Joined some day in the five years before the demo's "today", 20 September 2026
    const joined = new Date(Date.UTC(2026, 8, 20) - Math.floor(random() * 5 * 365) * 86_400_000);
    return {
      id: String(i + 1),
      name: `${first} ${last}`,
      email: `${ascii(first)}.${ascii(last)}${i}@example.com`,
      team: pick(TEAMS),
      role,
      status,
      joined: joined.toISOString().slice(0, 10),
      events: Math.floor(random() * 40),
    };
  });
})();

export const STATUS_LABEL: Record<MemberStatus, string> = {
  active: 'Aktif',
  inactive: 'Pasif',
  alumni: 'Mezun',
};

export const ROLE_LABEL: Record<MemberRole, string> = {
  member: 'Üye',
  lead: 'Ekip lideri',
  board: 'Yönetim',
};
