'use client';

import { useAuthContext } from '@/contexts/auth-context';
import Link from 'next/link';

export default function Navbar() {
  const { logout } = useAuthContext();

  return (
    <header className="bg-gradient-to-r from-sky-100 to-indigo-200 gap-2 flex flex-col items-center rounded-2xl mt-2 mb-4 md:mb-8 mx-2 md:px-12 p-3  shadow-md">
      <div className="w-full flex items-center justify-between">
        <Link href="/">
          <p className="font-semibold text-lg hover:scale-125 transition duration-500">
            TasteHorizon
          </p>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/fornecedor">
            <p className="hover:font-semibold transition-all">Fornecedores</p>
          </Link>
          <Link href="/produto">
            <p className="hover:font-semibold transition-all">Produtos</p>
          </Link>
          <Link href="/">
            <p className="hover:font-semibold transition-all">Vendas</p>
          </Link>

          <Link href="/funcionario">
            <p className="hover:font-semibold transition-all">Funcionários</p>
          </Link>

          <p className="hover:font-semibold transition-all hover:cursor-pointer" onClick={logout}>
            Sair
          </p>
        </div>
      </div>
    </header>
  );
}
