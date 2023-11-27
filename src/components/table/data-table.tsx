import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Key, ReactNode } from 'react';

type TDataTable<TRow> = {
  rows: TRow[];
  columns: { key: string; label: string }[];
  renderCell: (item: TRow, columnKey: Key) => ReactNode;
  isFetching: boolean;
  isStripped?: boolean;
};

export default function DataTable<TRow extends { id: number }>({
  rows,
  columns,
  renderCell,
  isFetching,
  isStripped = true,
}: TDataTable<TRow>) {
  return (
    <Table isStriped={isStripped}>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>

      <TableBody
        items={rows}
        isLoading={isFetching}
        emptyContent={'Sem dados'}
        loadingContent={<Spinner />}
      >
        {(item: TRow) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
