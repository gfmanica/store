'use client';

import ActionColumnTable from '@/components/table/action-column-table';
import DataTable from '@/components/table/data-table';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TProduto } from '@/types/index';
import { money } from '@/utils/format';
import { Button, Tooltip } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';

const getRows = (data: TProduto[] | undefined) => {
  if (data) {
    return data.map((item) => ({
      id: item.idProduto,
      dsProduto: item.dsProduto,
      vlProduto: money(item.vlProduto),
      qtProduto: item.qtProduto,
      dsFornecedor: item.fornecedor.dsFornecedor,
    }));
  }

  return [];
};

const columns = [
  {
    key: 'dsProduto',
    label: 'Produto',
  },
  {
    key: 'vlProduto',
    label: 'Valor',
  },
  {
    key: 'qtProduto',
    label: 'Quantidade de estoque',
  },
  {
    key: 'dsFornecedor',
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

  const { data, isFetching, refetch } = useQuery<TProduto[]>({
    queryKey: ['getTProduto'],
    queryFn: () => Api.get('/api/produto').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  const { mutate } = useMutation({
    mutationFn: (data: string) => Api.delete(`/api/produto/${data}`),
    onSuccess: (data) => {
      enqueueSnackbar('Produto excluído com sucesso!', {
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

        <Link href="/produto/form">
          <Button variant="shadow" color="primary">
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
