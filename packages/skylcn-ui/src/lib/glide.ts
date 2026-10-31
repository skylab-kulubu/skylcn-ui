/**
 * One background that slides onto whichever row is lit, by pointer or keys, instead of each
 * row lighting up on its own. Call the returned function with the row, or null to fade it out.
 * The first row it lands on takes it in place; only later moves slide. It sets its own
 * position through the CSS object model, which a strict Content-Security-Policy allows.
 */
export function createGlide(glide: HTMLElement) {
  let shown = false;
  return (row: HTMLElement | null, tone = '') => {
    const frame = glide.offsetParent as HTMLElement | null;
    if (!row || !frame) {
      glide.style.opacity = '0';
      shown = false;
      return;
    }
    const box = row.getBoundingClientRect();
    const outer = frame.getBoundingClientRect();
    const x = box.left - outer.left - frame.clientLeft + frame.scrollLeft;
    const y = box.top - outer.top - frame.clientTop + frame.scrollTop;
    if (!shown) glide.style.transition = 'none';
    glide.style.transform = `translate(${x}px, ${y}px)`;
    glide.style.width = `${box.width}px`;
    glide.style.height = `${box.height}px`;
    glide.dataset.tone = tone;
    glide.style.opacity = '1';
    if (!shown) {
      glide.getBoundingClientRect();
      glide.style.transition = '';
    }
    shown = true;
  };
}

export const glideClass =
  'pointer-events-none absolute top-0 left-0 rounded-md opacity-0 transition-[transform,width,height,opacity] duration-(--motion-duration-fast) ease-enter motion-reduce:transition-none';
