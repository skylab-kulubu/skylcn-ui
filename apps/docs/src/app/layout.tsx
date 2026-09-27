import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { ThemeScript } from '@skylab-kulubu/skylcn-ui';
import { HOSTED_IN_ADMIN } from '../demo/hosting';
import { Providers } from './providers';
import './globals.css';

const sans = Space_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--skylcn-font-sans' });
const mono = Space_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--skylcn-font-mono',
});

export const metadata: Metadata = {
  title: 'skylcn-ui',
  description: 'SKY LAB ortak tasarım sistemi',
  // A temporary preview inside the admin panel stays out of search engines
  robots: HOSTED_IN_ADMIN ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
