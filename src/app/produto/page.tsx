'use client';

import ActionColumnTable from '@/components/table/action-column-table';
import DataTable from '@/components/table/data-table';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TProduto, TResponse } from '@/types/index';
import { money } from '@/utils/format';
import { Button, Tooltip } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { ReactNode, useEffect } from 'react';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';

const getRows = (data: TProduto[] | undefined) => {
  if (data) {
    return data.map((item) => ({
      id: item.idproduto,
      dsproduto: item.dsproduto,
      vlproduto: money(item.vlproduto),
      qtproduto: item.qtproduto,
      dsfornecedor: item.fornecedor.dsfornecedor,
    }));
  }

  return [];
};

const columns = [
  {
    key: 'dsproduto',
    label: 'Produto',
  },
  {
    key: 'vlproduto',
    label: 'Valor',
  },
  {
    key: 'qtproduto',
    label: 'Quantidade de estoque',
  },
  {
    key: 'dsfornecedor',
    label: 'Fornecedor',
  },
  {
    key: 'action',
    label: 'Ações',
  },
];

export default function Produto() {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();
  const { push } = useRouter();

  const { data, isFetching, refetch } = useQuery<TResponse<TProduto[]>>({
    queryKey: ['getTProduto'],
    queryFn: () => Api.get('/api/produto').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data?.status === 400) {
      enqueueSnackbar('Você não possui permissão para visualizar o produto', {
        variant: 'error',
      });
    }
  }, [data]);

  const { mutate } = useMutation<
    AxiosResponse<TResponse<TProduto[]>>,
    AxiosError,
    string
  >({
    mutationFn: (data) => Api.delete(`/api/produto/${data}`),
    onSuccess: (data) => {
      if (data.data.status === 400) {
        enqueueSnackbar('Você não possui permissão para excluir o produto', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Produto excluído com sucesso!', {
          variant: 'success',
        });

        refetch();
      }
    },
  });

  const renderCell = (item: any, columnKey: any): ReactNode => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'action':
        return (
          <ActionColumnTable
            callbackConfirm={() => mutate(item.id)}
            href={`/produto/form/${item.id}`}
          />
        );

      default:
        return cellValue;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">Produtos</p>

        <Button
          variant="shadow"
          color="primary"
          className="font-semibold"
          onClick={() => push('/produto/form')}
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
