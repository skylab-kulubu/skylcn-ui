'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Whether to show a busy indicator for work that may finish at once: it
 * appears only after `delay` ms, and once shown stays for at least `minimum`
 * ms, so quick actions never flash a loader.
 */
export function usePendingIndicator(pending: boolean, delay = 150, minimum = 400) {
  const [shown, setShown] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (pending && !shown) {
      const timer = setTimeout(() => {
        shownAt.current = Date.now();
        setShown(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    if (!pending && shown) {
      const left = minimum - (Date.now() - shownAt.current);
      const timer = setTimeout(() => setShown(false), Math.max(0, left));
      return () => clearTimeout(timer);
    }
  }, [pending, shown, delay, minimum]);

  return shown;
}
