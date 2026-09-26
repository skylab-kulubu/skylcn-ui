/**
 * The one enter and exit for floating popups (menus, tooltips, popovers).
 * Base UI sets the starting/ending style and side attributes; the popup grows
 * from its trigger and drifts in from the side it opens on.
 */
function popupMotion(duration: 'fast' | 'base') {
  return [
    'origin-(--transform-origin) transition-[opacity,transform] ease-enter',
    duration === 'fast' ? 'duration-(--motion-duration-fast)' : 'duration-(--motion-duration-base)',
    'data-starting-style:scale-98 data-starting-style:opacity-0',
    'data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:ease-exit',
    'data-[side=bottom]:data-starting-style:-translate-y-1 data-[side=top]:data-starting-style:translate-y-1',
    'data-[side=left]:data-starting-style:translate-x-1 data-[side=right]:data-starting-style:-translate-x-1',
  ].join(' ');
}

export const popupMotionFast = popupMotion('fast');
export const popupMotionBase = popupMotion('base');
