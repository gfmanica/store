import ProdutoFormAutocomplete from '@/components/autocompletes/produto-form-autocomplete';
import NumberFormField from '@/components/fields/number-form-field';
import ConfirmModal from '@/components/modals/confirm-modal';
import DataTable from '@/components/table/data-table';
import { TItemZod, TVendaZod } from '@/types';
import { money } from '@/utils/format';
import { Tooltip, useDisclosure } from '@nextui-org/react';
import React, { ReactNode, useLayoutEffect, useMemo } from 'react';
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { MdOutlineDelete } from 'react-icons/md';

type TProdutoDataTable = {
  data: TItemZod[];
  isFetching: boolean;
  control: Control<TVendaZod, unknown>;
  errors: FieldErrors<TVendaZod>;
  setValue: UseFormSetValue<TVendaZod>;
  getValues: UseFormGetValues<TVendaZod>;
};

const getRows = (data: TItemZod[] | undefined) => {
  if (data) {
    return data.map((item) => ({
      id: item.idItem,
      qtItem: item.qtItem,
      vlParcial: item.vlParcial,
      produto: item.produto,
    }));
  }

  return [];
};

const columns = [
  {
    key: 'qtItem',
    label: 'Quantidade',
  },
  {
    key: 'vlParcial',
    label: 'Valor total',
  },
  {
    key: 'produto',
    label: 'Produto',
  },
  {
    key: 'delete',
    label: 'Excluir',
  },
];

export default function ProdutoDataTable({
  data,
  isFetching,
  control,
  errors,
  setValue,
  getValues,
}: TProdutoDataTable) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const updateTotalValue = () => {
    setValue(
      'vlTotal',
      Number(data.reduce((acc, cur) => acc + Number(cur.vlParcial), 0))
    );
  };

  const renderCell = (item: any, columnKey: any): ReactNode => {
    const index = data.findIndex((produto) => produto.idItem === item.id);
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'qtItem':
        return (
          <NumberFormField<TVendaZod>
            control={control}
            name={`item.${index}.qtItem`}
            size="sm"
            error={errors?.item && errors?.item[index]?.qtItem}
            onChangeCallback={(value) => {
              setValue(
                `item.${index}.vlParcial`,
                Number(
                  value * Number(getValues(`item.${index}.produto.vlProduto`))
                ) || 0
              );

              updateTotalValue();
            }}
          />
        );
      case 'vlParcial':
        return money(cellValue);

      case 'produto':
        return (
          <ProdutoFormAutocomplete<TVendaZod>
            control={control}
            label="Produto"
            name={`item.${index}.produto`}
            error={errors?.item && errors?.item[index]?.produto?.idProduto}
            onChangeCallback={(value) => {
              setValue(
                `item.${index}.vlParcial`,
                Number(value ? value?.vlProduto : 0) *
                  Number(getValues(`item.${index}.qtItem`))
              );

              updateTotalValue();
            }}
          />
        );

      case 'delete':
        return (
          <>
            <ConfirmModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              callbackConfirm={() => {}}
            />
            <div className="relative flex items-center gap-2">
              <Tooltip placement="right" color="danger" content="Excluir">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={onOpen}
                >
                  <MdOutlineDelete size={22} />
                </span>
              </Tooltip>
            </div>
          </>
        );

      default:
        return cellValue;
    }
  };

  return (
    <DataTable
      columns={columns}
      isFetching={isFetching}
      rows={getRows(data)}
      renderCell={renderCell}
      isStripped={false}
    />
  );
}
