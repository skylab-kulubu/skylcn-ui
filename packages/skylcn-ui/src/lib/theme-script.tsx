export type ThemePreference = 'dark' | 'light' | 'system';
export type MotionPreference = 'system' | 'reduced';

export const THEME_STORAGE_KEY = 'skylcn:theme';
export const MOTION_STORAGE_KEY = 'skylcn:motion';
export const LIGHT_QUERY = '(prefers-color-scheme: light)';

const SCRIPT = `(function(){var d=document.documentElement;try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');var l=p==='light'||(p==='system'&&matchMedia('${LIGHT_QUERY}').matches);d.dataset.theme=l?'light':'dark';if(localStorage.getItem('${MOTION_STORAGE_KEY}')==='reduced')d.dataset.motion='reduced'}catch(e){d.dataset.theme='dark'}})()`;

/**
 * Sets the remembered theme and motion choice on <html> before the page
 * paints, so it never opens in the wrong theme. Render it first in <head>,
 * and give <html> `suppressHydrationWarning` since the attributes are set
 * outside React.
 */
export function ThemeScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
