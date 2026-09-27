'use client';

import { useCallback, useEffect, useState } from 'react';
import { LIGHT_QUERY, THEME_STORAGE_KEY, type ThemePreference } from './theme-script.js';

export type { ThemePreference };

function readPreference(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
  } catch {
    // Storage can be unavailable; fall back to the default.
  }
  return 'dark';
}

function resolve(preference: ThemePreference) {
  return preference === 'light' ||
    (preference === 'system' && window.matchMedia(LIGHT_QUERY).matches)
    ? 'light'
    : 'dark';
}

/**
 * Writes the theme to <html>. With `animate`, the page cross-fades through a
 * view transition where the browser has one and motion is welcome; otherwise
 * the colours switch at once. Colour transitions are held off either way.
 */
function apply(preference: ThemePreference, animate: boolean) {
  const root = document.documentElement;
  const next = resolve(preference);
  if (root.dataset.theme === next) return;

  const swap = () => {
    root.dataset.theme = next;
  };
  const settle = () => root.classList.remove('skylcn-theme-switching');
  root.classList.add('skylcn-theme-switching');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (animate && !reduce && typeof document.startViewTransition === 'function') {
    document.startViewTransition(swap).finished.finally(settle);
    return;
  }
  swap();
  requestAnimationFrame(() => requestAnimationFrame(settle));
}

/**
 * The reader's theme choice: dark (the default), light, or following the
 * system. It is remembered, written to `data-theme` on <html>, and changed
 * with a short cross-fade. Pair it with <ThemeScript /> so pages open in the
 * right theme without a flash.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>('dark');

  useEffect(() => {
    const saved = readPreference();
    setThemeState(saved);
    apply(saved, false);
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const query = window.matchMedia(LIGHT_QUERY);
    const onChange = () => apply('system', true);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    apply(next, true);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Not remembering is fine.
    }
  }, []);

  return { theme, setTheme };
}
