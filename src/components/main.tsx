'use client';

import { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';

type TPage = {
  children: ReactNode;
};

export default function Main({ children }: TPage) {
  return (
    <div className="flex flex-col min-h-[100dvh] min-w-full">
      <Navbar />

      <main className="px-6 lg:px-20 xl:px-32 flex flex-col gap-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}
