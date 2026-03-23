import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Navbar } from '@/components/features/page/Navbar';
import Footer from '@/components/features/page/Footer';
import StoreProvider from './providers/StoreProvider';
import { ClientAuthInitializer } from '@/components/features/auth/ClientAuthInitializer';
config.autoAddCss = false;

import { TooltipProvider } from '@repo/ui/tooltip';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shottrace',
  description:
    'Discover, track, and review films with friends. Build your personal movie diary and explore what others are watching.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <StoreProvider>
            <ClientAuthInitializer />
            <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
            <Footer />
          </StoreProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
