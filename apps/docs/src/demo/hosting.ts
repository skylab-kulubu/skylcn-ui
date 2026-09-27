/**
 * True when the playground is built into the admin panel
 * (NEXT_PUBLIC_DOCS_HOST=admin): only /playground ships there, and the console
 * switcher leads to that environment's real consoles.
 */
export const HOSTED_IN_ADMIN = process.env.NEXT_PUBLIC_DOCS_HOST === 'admin';
