'use client';
import { ReactNode, useCallback } from 'react';
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import { Button, Tooltip } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TVenda } from '@/types';
import { localeDate, money } from '@/utils/format';
import DataTable from '@/components/table/data-table';
import { enqueueSnackbar } from 'notistack';
import ActionColumnTable from '@/components/table/action-column-table';
import Link from 'next/link';

const getRows = (data: TVenda[] | undefined) => {
  if (data) {
    return data.map((item) => ({
      id: item.idVenda,
      dtVenda: localeDate(item.dtVenda),
      vlTotal: money(item.vlTotal),
      dsFuncionario: item.funcionario.dsFuncionario,
      qtTotalItens: item._count.item,
    }));
  }

  return [];
};

const columns = [
  {
    key: 'dtVenda',
    label: 'Data da venda',
  },
  {
    key: 'vlTotal',
    label: 'Valor total',
  },
  {
    key: 'dsFuncionario',
    label: 'Funcionário',
  },
  {
    key: 'qtTotalItens',
    label: 'Quantidade de itens',
  },
  {
    key: 'action',
    label: 'Ações',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();

  const { data = [], isFetching, refetch } = useQuery<TVenda[]>({
    queryKey: ['geTVenda'],
    queryFn: () => Api.get('/api/venda').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  const { mutate } = useMutation({
    mutationFn: (data: string) => Api.delete(`/api/venda/${data}`),
    onSuccess: () => {
      enqueueSnackbar('Venda excluída com sucesso!', {
        variant: 'success',
      });

      refetch();
    },
  });

  const renderCell = (item: any, columnKey: any): ReactNode => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'action':
        return (
          <ActionColumnTable
            callbackConfirm={() => mutate(item.id)}
            href={`/form/${item.id}`}
          />
        );

      default:
        return cellValue;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">Vendas</p>

        <Link href="/form">
          <Button variant="shadow" color="primary" className='font-semibold'>
            Inserir
          </Button>
        </Link>
      </div>


      <DataTable
        columns={columns}
        isFetching={isFetching}
        rows={getRows(data)}
        renderCell={renderCell}
      />
    </>
  );
}
