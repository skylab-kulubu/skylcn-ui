/**
 * The one enter and exit for floating popups (menus, tooltips, popovers).
 * Base UI sets the starting/ending style and side attributes; the popup grows
 * from its trigger and drifts in from the side it opens on. The distances are
 * motion tokens, so reduced motion leaves only the fade.
 */
function popupMotion(duration: 'fast' | 'base') {
  return [
    'origin-(--transform-origin) transition-[opacity,transform] ease-enter',
    duration === 'fast' ? 'duration-(--motion-duration-fast)' : 'duration-(--motion-duration-base)',
    'data-starting-style:scale-(--motion-scale-from) data-starting-style:opacity-0',
    'data-ending-style:scale-(--motion-scale-from) data-ending-style:opacity-0 data-ending-style:ease-exit',
    'data-[side=bottom]:data-starting-style:-translate-y-(--motion-shift) data-[side=top]:data-starting-style:translate-y-(--motion-shift)',
    'data-[side=left]:data-starting-style:translate-x-(--motion-shift) data-[side=right]:data-starting-style:-translate-x-(--motion-shift)',
  ].join(' ');
}

export const popupMotionFast = popupMotion('fast');
export const popupMotionBase = popupMotion('base');
