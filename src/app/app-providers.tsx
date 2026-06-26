'use client';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/theme-provider';
import TokenRefresher from '@/context/tokenRefresher';
import ReduxStoreProvider from '@/lib/ReduxStoreProvider';
import NextTopLoader from 'nextjs-toploader';
import React, { Suspense } from 'react';
import ReactQueryProvider from './ReactQueryProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader color="#3880b7" showSpinner={true} />
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
