'use client';
import { Key, useCallback } from 'react';
import Image from 'next/image';
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import { PrismaClient } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  getKeyValue,
} from '@nextui-org/react';
import type { Venda } from '@prisma/client';

const rows = [
  {
    key: 1,
    vlTotal: 'Tony Reichert',
    dtVenda: 'CEO',
    dsFuncionario: 'Active',
    qtTotalProdutos: 'Active',
    qtTotalItens: 'Active',
  },
];

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
    key: 'qtTotalProdutos',
    label: 'Quantidade de produtos',
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

      <Table isStriped>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
