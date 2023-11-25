'use client';

import DataTable from '@/components/table/data-table';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TProduto } from '@/types/index';
import { money } from '@/utils/format';
import { Tooltip } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
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
    label: 'Quantidade no estoque',
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

const renderCell = (user: any, columnKey: any): ReactNode => {
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
};

export default function Produto() {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();

  const { data, isFetching } = useQuery<TProduto[]>({
    queryKey: ['getTProduto'],
    queryFn: () => Api.get('/api/produto').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  return (
    <>
      <p className="text-2xl font-semibold">Produtos</p>

      <DataTable
        columns={columns}
        isFetching={isFetching}
        rows={getRows(data)}
        renderCell={renderCell}
      />
    </>
  );
}
