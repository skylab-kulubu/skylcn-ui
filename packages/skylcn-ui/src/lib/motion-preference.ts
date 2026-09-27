'use client';

import { useCallback, useEffect, useState } from 'react';
import { MOTION_STORAGE_KEY, type MotionPreference } from './theme-script.js';

function apply(preference: MotionPreference) {
  const root = document.documentElement;
  if (preference === 'reduced') root.dataset.motion = 'reduced';
  else delete root.dataset.motion;
}

/**
 * The reader's own motion setting on top of the system one: `reduced` keeps
 * short fades and drops travel and scaling everywhere, as the system setting
 * does. It is remembered and written to `data-motion` on <html>.
 */
export function useMotionPreference() {
  const [motion, setMotionState] = useState<MotionPreference>('system');

  useEffect(() => {
    let saved: MotionPreference = 'system';
    try {
      if (window.localStorage.getItem(MOTION_STORAGE_KEY) === 'reduced') saved = 'reduced';
    } catch {
      // Storage can be unavailable; follow the system.
    }
    setMotionState(saved);
    apply(saved);
  }, []);

  const setMotion = useCallback((next: MotionPreference) => {
    setMotionState(next);
    apply(next);
    try {
      window.localStorage.setItem(MOTION_STORAGE_KEY, next);
    } catch {
      // Not remembering is fine.
    }
  }, []);

  return { motion, setMotion };
}
