import { cn } from '@/utils/cn';
import { HTMLProps, ReactNode } from 'react';

type TPage = {
  children: ReactNode;
  className?: HTMLProps<HTMLElement>['className'];
};

export default function Page({ children, className }: TPage) {
  return (
    <main className={cn('flex flex-col min-h-[100dvh] min-w-full', className)}>
      {children}
    </main>
  );
}
