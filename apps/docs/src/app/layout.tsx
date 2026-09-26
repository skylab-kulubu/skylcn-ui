import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${sans.variable} ${mono.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
