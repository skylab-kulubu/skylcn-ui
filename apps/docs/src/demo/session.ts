'use client';

import { useEffect, useState } from 'react';
import { HOSTED_IN_ADMIN } from './hosting';

/** The admin panel's signed-in person, as its /api/auth/me returns them. */
export type HostUser = { name: string; email?: string; roleLabel?: string };

type MeResponse = {
  authenticated?: boolean;
  /** The team or role line the panel's own sidebar shows. */
  roleLabel?: string;
  user?: { firstName?: string; lastName?: string; username?: string; email?: string };
};

const titleCase = (text: string) =>
  text
    .toLocaleLowerCase('tr-TR')
    .split(/\s+/)
    .map((word) => word.replace(/^\p{L}/u, (ch) => ch.toLocaleUpperCase('tr-TR')))
    .join(' ');

/**
 * Inside the admin panel the playground shares its origin and session cookie,
 * so it asks the panel who is signed in. Elsewhere there is no session: null.
 */
export function useHostUser(): { user: HostUser | null; loading: boolean } {
  const [user, setUser] = useState<HostUser | null>(null);
  const [loading, setLoading] = useState(HOSTED_IN_ADMIN);

  useEffect(() => {
    if (!HOSTED_IN_ADMIN) return;
    let cancelled = false;
    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      .then((response) => (response.ok ? (response.json() as Promise<MeResponse>) : null))
      .then((body) => {
        if (cancelled || !body?.authenticated || !body.user) return;
        const { firstName, lastName, username, email } = body.user;
        const name =
          `${firstName ?? ''} ${lastName ?? ''}`.trim() || username?.trim() || email || 'Kullanıcı';
        setUser({ name: titleCase(name), email, roleLabel: body.roleLabel || undefined });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}

/** Ends the admin panel's session and returns to its sign-in page, even if the request fails. */
export async function signOutOfHost() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } finally {
    window.location.href = '/login?logout=1';
  }
}

export const ACCOUNT_URL = process.env.NEXT_PUBLIC_ACCOUNT_URL || 'https://my.yildizskylab.com';
