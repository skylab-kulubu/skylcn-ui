export type ThemePreference = 'dark' | 'light' | 'system';

export const THEME_STORAGE_KEY = 'skylcn:theme';
export const LIGHT_QUERY = '(prefers-color-scheme: light)';

const SCRIPT = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');var l=p==='light'||(p==='system'&&matchMedia('${LIGHT_QUERY}').matches);document.documentElement.dataset.theme=l?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;

/**
 * Sets the remembered theme on <html> before the page paints, so it never
 * opens in the wrong theme. Render it first in <head>, and give <html>
 * `suppressHydrationWarning` since the attribute is set outside React.
 */
export function ThemeScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
