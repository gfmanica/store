'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { NextUIProvider } from '@nextui-org/react';
import { ReactNode } from 'react';

type TProviders = {
  children: ReactNode;
};

export default function Providers({ children }: TProviders) {
  return (
    <NextUIProvider>
      <AuthProvider>{children}</AuthProvider>
    </NextUIProvider>
  );
}
