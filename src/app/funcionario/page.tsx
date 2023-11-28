'use client';

import ActionColumnTable from '@/components/table/action-column-table';
import DataTable from '@/components/table/data-table';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TFuncionario } from '@/types/index';
import { Button, Link } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { ReactNode } from 'react';

const getRows = (data: TFuncionario[] | undefined) => {
  if (data) {
    return data.map((item) => ({
      id: item.idFuncionario,
      dsFuncionario: item.dsFuncionario,
      nrCpf: item.nrCpf,
      dsFuncao: item.dsFuncao,
    }));
  }

  return [];
};

const columns = [
  {
    key: 'dsFuncionario',
    label: 'Funcionario',
  },
  {
    key: 'nrCpf',
    label: 'CPF',
  },
  {
    key: 'dsFuncao',
    label: 'Funcao',
  },
  {
    key: 'action',
    label: 'Ações',
  },
];

export default function Funcionario() {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();

  const { data, isFetching, refetch } = useQuery<TFuncionario[]>({
    queryKey: ['getFuncionarios'],
    queryFn: () => Api.get('/api/funcionario').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  const { mutate } = useMutation({
    mutationFn: (data: string) => Api.delete(`/api/funcionario/${data}`),
    onSuccess: (data) => {
      enqueueSnackbar('Funcionário excluído com sucesso!', {
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
            href={`/funcionario/form/${item.id}`}
          />
        );

      default:
        return cellValue;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <p className="text-2xl font-semibold">Funcionários</p>

        <Link href="/funcionario/form">
          <Button variant="shadow" color="primary" className="font-semibold">
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
