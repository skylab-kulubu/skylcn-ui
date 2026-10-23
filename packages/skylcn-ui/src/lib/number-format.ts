const formats = new Map<string, Intl.NumberFormat>();

/**
 * A shared Intl.NumberFormat per locale and options. Building one costs far
 * more than formatting with it, and `toLocaleString` builds one on every call:
 * lists format many figures a render and running numbers one every frame.
 */
export function numberFormat(tag: string, maximumFractionDigits = 3) {
  const key = `${tag}|${maximumFractionDigits}`;
  let format = formats.get(key);
  if (!format) {
    format = new Intl.NumberFormat(tag, { maximumFractionDigits });
    formats.set(key, format);
  }
  return format;
}
