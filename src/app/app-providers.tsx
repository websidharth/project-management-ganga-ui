'use client';
import React, { Suspense } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from '@/context/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxStoreProvider from '@/lib/ReduxStoreProvider';
import AuthProvider from '@/context/AuthProvider';
import TokenRefresher from '@/context/tokenRefresher';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader color="#67be8c" showSpinner={false} />
      <ReactQueryProvider>
        <ReduxStoreProvider>
          <AuthProvider>
            <TokenRefresher />
            <ThemeProvider defaultTheme="system" storageKey="tci-ui-theme">
              <Suspense>{children}</Suspense>
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </ReduxStoreProvider>
      </ReactQueryProvider>
    </>
  );
}
