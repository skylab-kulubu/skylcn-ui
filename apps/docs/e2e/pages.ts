import { ENTRIES, entryHref } from '../src/demo/catalog';

export const SCENARIOS = [
  '/playground',
  '/playground/members',
  '/playground/members/1',
  '/playground/table',
  '/playground/analytics',
  '/playground/mail',
  '/playground/calendar',
  '/playground/board',
  '/playground/settings',
  '/playground/states',
  '/playground/status',
  '/site',
  '/forms',
];

export const LIBRARY = ENTRIES.map((entry) => entryHref(entry.slug));
