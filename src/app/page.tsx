'use client';
import { useCallback } from 'react';
import Image from 'next/image';
import { MdEdit, MdDelete } from 'react-icons/md';
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

const prisma = new PrismaClient();

const rows = [
  {
    key: '1',
    name: 'Tony Reichert',
    role: 'CEO',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    role: 'Technical Lead',
    status: 'Paused',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    role: 'Senior Developer',
    status: 'Active',
  },
  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },
];

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'role',
    label: 'ROLE',
  },
  {
    key: 'status',
    label: 'STATUS',
  },
];

export default function Home() {
  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'status':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip placement="left" content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <MdEdit size={22} />
              </span>
            </Tooltip>
            <Tooltip placement="right" color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <MdDelete size={22} />
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
