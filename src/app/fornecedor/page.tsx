'use client';

import ActionColumnTable from '@/components/table/action-column-table';
import DataTable from '@/components/table/data-table';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TFornecedor } from '@/types/index';
import { Button, Link, Tooltip } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { ReactNode } from 'react';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';

const getRows = (data: TFornecedor[] | undefined) => {
  if (data) {
    return data.map((item) => ({
      id: item.idFornecedor,
      dsFornecedor: item.dsFornecedor,
    }));
  }

  return [];
};

const columns = [
  {
    key: 'dsFornecedor',
    label: 'Fornecedor',
  },
  {
    key: 'action',
    label: 'Ações',
  },
];

export default function Fornecedor() {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();

  const { data, isFetching, refetch } = useQuery<TFornecedor[]>({
    queryKey: ['getFornecedores'],
    queryFn: () => Api.get('/api/fornecedor').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  const { mutate } = useMutation({
    mutationFn: (data: string) => Api.delete(`/api/fornecedor/${data}`),
    onSuccess: (data) => {
      enqueueSnackbar('Fornecedor excluído com sucesso!', {
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
            href={`/fornecedor/form/${item.id}`}
          />
        );

      default:
        return cellValue;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">Fornecedores</p>

        <Link href="/fornecedor/form">
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
