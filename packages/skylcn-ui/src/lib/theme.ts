'use client';

import { useCallback, useEffect, useState } from 'react';

export type ThemePreference = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'skylcn:theme';
const LIGHT_QUERY = '(prefers-color-scheme: light)';

function readPreference(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
  } catch {
    // Storage can be unavailable; fall back to the default.
  }
  return 'dark';
}

function apply(preference: ThemePreference) {
  const light =
    preference === 'light' || (preference === 'system' && window.matchMedia(LIGHT_QUERY).matches);
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
}

/**
 * The reader's theme choice: dark (the default), light, or following the
 * system. It is remembered and written to `data-theme` on <html>.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>('dark');

  useEffect(() => {
    const saved = readPreference();
    setThemeState(saved);
    apply(saved);
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const query = window.matchMedia(LIGHT_QUERY);
    const onChange = () => apply('system');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    apply(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not remembering is fine.
    }
  }, []);

  return { theme, setTheme };
}
