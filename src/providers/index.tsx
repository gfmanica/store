'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ReactNode } from 'react';

type TProviders = {
  children: ReactNode;
};

export default function Providers({ children }: TProviders) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
