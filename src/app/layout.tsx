import type { Metadata } from 'next';
import '@/app/globals.css';
import { Onest, Young_Serif } from 'next/font/google';
import AppProviders from './app-providers';

const oneset = Onest({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-onest',
});
const young_serif = Young_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-yserif',
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_NAME,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oneset.variable} ${young_serif.variable} bg-background !pointer-events-auto`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
