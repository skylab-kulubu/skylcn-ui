'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Measures an element's height as its content changes, so a wrapper can ease to it.
 * Undefined until the first measure, so a part opens at its height without moving.
 */
export function useAutoHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number>();
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry!.borderBoxSize?.[0]?.blockSize ?? element.offsetHeight);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, height] as const;
}
