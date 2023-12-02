'use client';

import ActionColumnTable from '@/components/table/action-column-table';
import DataTable from '@/components/table/data-table';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TFuncionario, TResponse } from '@/types/index';
import { Button, Link } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { ReactNode, useEffect } from 'react';

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
  const { push } = useRouter();

  const { data, isFetching, refetch, error } = useQuery<
    TResponse<TFuncionario[]>
  >({
    queryKey: ['getFuncionarios'],
    queryFn: () => Api.get('/api/funcionario').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data?.status === 400) {
      enqueueSnackbar(
        'Você não possui permissão para visualizar os funcionários',
        {
          variant: 'error',
        }
      );
    }
  }, [data]);

  const { mutate } = useMutation<
    AxiosResponse<TResponse<TFuncionario[]>>,
    AxiosError,
    string
  >({
    mutationFn: (data: string) => Api.delete(`/api/funcionario/${data}`),
    onSuccess: (data) => {
      if (data.data.status === 400) {
        enqueueSnackbar(
          'Você não possui permissão para excluir o funcionário',
          {
            variant: 'error',
          }
        );
      } else {
        enqueueSnackbar('Funcionario excluído com sucesso!', {
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

        <Button
          variant="shadow"
          color="primary"
          className="font-semibold"
          onClick={() => push('/funcionario/form')}
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
