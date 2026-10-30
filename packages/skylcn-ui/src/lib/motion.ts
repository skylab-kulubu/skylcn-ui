import { useEffect, useState } from 'react';

/**
 * The one enter and exit for floating popups (menus, tooltips, popovers).
 * Base UI sets the starting/ending style and side attributes; the popup grows
 * from its trigger and drifts in from the side it opens on. The distances are
 * motion tokens, so reduced motion leaves only the fade.
 */
function popupMotion(duration: 'fast' | 'base') {
  return [
    // Tailwind 4's scale and translate utilities set the scale and translate properties, not transform
    'origin-(--transform-origin) transition-[opacity,scale,translate] ease-enter',
    duration === 'fast' ? 'duration-(--motion-duration-fast)' : 'duration-(--motion-duration-base)',
    'data-starting-style:scale-(--motion-scale-from) data-starting-style:opacity-0',
    'data-ending-style:scale-(--motion-scale-from) data-ending-style:opacity-0 data-ending-style:ease-exit',
    'data-[side=bottom]:data-starting-style:-translate-y-(--motion-shift) data-[side=top]:data-starting-style:translate-y-(--motion-shift)',
    'data-[side=left]:data-starting-style:translate-x-(--motion-shift) data-[side=right]:data-starting-style:-translate-x-(--motion-shift)',
  ].join(' ');
}

export const popupMotionFast = popupMotion('fast');
export const popupMotionBase = popupMotion('base');

// Outlasts a list's opening cascade: six half stagger steps (180ms) plus a row's fade (150ms)
const ROWS_SETTLE_MS = 400;

/**
 * False while a list popup that just mounted plays its opening, true after. Put it on the list
 * as `data-settled` with the `list-rows` utility: rows rise in order on opening, and rows that
 * join later, as a search narrows the list, only fade in.
 */
export function useSettled() {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(true), ROWS_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, []);
  return settled;
}
