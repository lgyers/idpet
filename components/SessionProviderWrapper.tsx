'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

interface SessionProviderWrapperProps {
  children: ReactNode;
}

export function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
