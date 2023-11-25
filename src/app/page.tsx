'use client';
import { useCallback } from 'react';
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import { Tooltip } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TVenda } from '@/types';
import { localeDate, money } from '@/utils/format';
import DataTable from '@/components/table/data-table';

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

  const { data = [], isFetching } = useQuery<TVenda[]>({
    queryKey: ['geTVenda'],
    queryFn: () => Api.get('/api/venda').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  const renderCell = useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'action':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip placement="left" content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <MdOutlineEdit size={22} />
              </span>
            </Tooltip>
            <Tooltip placement="right" color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <MdOutlineDelete size={22} />
              </span>
            </Tooltip>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <p className="text-2xl font-semibold">Vendas</p>

      <DataTable
        columns={columns}
        isFetching={isFetching}
        rows={getRows(data)}
        renderCell={renderCell}
      />
    </>
  );
}
