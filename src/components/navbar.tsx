'use client';

import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TResponse } from '@/types';
import { Button, Divider } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

export default function Navbar() {
  const { logout, user } = useAuthContext();
  const Api = useApiContext();

  const { refetch, isFetching, data } = useQuery<TResponse<string>>({
    queryKey: ['getBackup'],
    queryFn: () => Api.get('/api/backup').then((res) => res.data),
    enabled: false,

  });

  useEffect(() => {
    if (data) {
      enqueueSnackbar(data.data, { variant: 'success' });
    }
  }, [data]);

  return (
    <header className="bg-gradient-to-r from-sky-100 to-indigo-200 gap-2 flex flex-col items-center rounded-2xl mt-2 mb-4 md:mb-8 mx-2 md:px-12 p-3  shadow-md">
      <div className="w-full flex items-center justify-between">
        <Link href="/">
          <p className="font-semibold text-lg hover:scale-125 transition duration-500">
            TasteHorizon
          </p>
        </Link>

        <div className="flex items-center gap-6">
          <Button variant="shadow" color="secondary" onClick={() => refetch()}>
            Backup
          </Button>

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

          <Divider orientation="vertical" className="h-4" />

          <p>
            Funcionário: <strong>{user}</strong>
          </p>

          <p
            className="hover:font-semibold transition-all hover:cursor-pointer"
            onClick={logout}
          >
            Sair
          </p>
        </div>
      </div>
    </header>
  );
}
