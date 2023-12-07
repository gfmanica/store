'use client';
import { ReactNode, useCallback, useEffect } from 'react';
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import { Button, Tooltip } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TResponse, TVenda } from '@/types';
import { localeDate, money } from '@/utils/format';
import DataTable from '@/components/table/data-table';
import { enqueueSnackbar } from 'notistack';
import ActionColumnTable from '@/components/table/action-column-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AxiosError, AxiosResponse } from 'axios';

const getRows = (data: TVenda[] | undefined) => {
  if (data) {
    return data.map((item) => ({
      id: item.idvenda,
      dtVenda: localeDate(item.dtvenda),
      vlTotal: money(item.vltotal),
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
  const { push } = useRouter();

  const {
    data,
    isFetching,
    refetch,
    error,
  } = useQuery<TResponse<TVenda[]>>({
    queryKey: ['geTVenda'],
    queryFn: () => Api.get('/api/venda').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  const { mutate } = useMutation<
    AxiosResponse<TResponse<TVenda[]>>,
    AxiosError,
    string
  >({
    mutationFn: (data: string) => Api.delete(`/api/venda/${data}`),
    onSuccess: (data) => {
      if (data.data.status === 400) {
        enqueueSnackbar('Você não possui permissão para excluir a venda', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Venda excluída com sucesso!', {
          variant: 'success',
        });

        refetch();
      }
    },
  });

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Você não possui permissão para visualizar as vendas', {
        variant: 'error',
      });
    }
  }, [error]);

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

        <Button
          variant="shadow"
          color="primary"
          className="font-semibold"
          onClick={() => push('/form')}
        >
          Inserir
        </Button>
      </div>

      <DataTable
        columns={columns}
        isFetching={isFetching}
        rows={getRows(data?.data)}
        renderCell={renderCell}
      />
    </>
  );
}
