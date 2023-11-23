'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { queryClient } from '@/lib/query-client';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

type TProviders = {
  children: ReactNode;
};

export default function Providers({ children }: TProviders) {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
