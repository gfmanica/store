'use client';

import { ReactNode, useLayoutEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { useDisclosure } from '@nextui-org/react';
import LoginModal from './modals/login-modal';

type TPage = {
  children: ReactNode;
};

export default function Main({ children }: TPage) {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultOpen: true });

  return (
    <div className="flex flex-col min-h-[100dvh] min-w-full">
      <Navbar />

      <LoginModal isOpen={isOpen} onClose={onClose} />

      <main className="px-6 lg:px-20 xl:px-32 flex flex-col gap-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}
