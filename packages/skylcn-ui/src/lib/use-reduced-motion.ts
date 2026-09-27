'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-motion'],
  });
  return () => {
    query.removeEventListener('change', onChange);
    observer.disconnect();
  };
}

function read() {
  return document.documentElement.dataset.motion === 'reduced' || window.matchMedia(QUERY).matches;
}

/**
 * Whether motion should be reduced, from the system setting or the in-product
 * one (`data-motion="reduced"`). For motion driven from script, such as chart
 * drawing; CSS motion follows the tokens on its own.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, read, () => false);
}
