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
      id: item.iditem,
      qtitem: item.qtitem,
      vlparcial: item.vlparcial,
      produto: item.produto,
    }));
  }

  return [];
};

const columns = [
  {
    key: 'qtitem',
    label: 'Quantidade',
  },
  {
    key: 'vlparcial',
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
      'vltotal',
      Number(data.reduce((acc, cur) => acc + Number(cur.vlparcial), 0))
    );
  };

  const renderCell = (item: any, columnKey: any): ReactNode => {
    const index = data.findIndex((produto) => produto.iditem === item.id);
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'qtitem':
        return (
          <NumberFormField<TVendaZod>
            control={control}
            name={`item.${index}.qtitem`}
            size="sm"
            error={errors?.item && errors?.item[index]?.qtitem}
            onChangeCallback={(value) => {
              setValue(
                `item.${index}.vlparcial`,
                Number(
                  value * Number(getValues(`item.${index}.produto.vlproduto`))
                ) || 0
              );

              updateTotalValue();
            }}
          />
        );
      case 'vlparcial':
        return money(cellValue);

      case 'produto':
        return (
          <ProdutoFormAutocomplete<TVendaZod>
            control={control}
            label="Produto"
            name={`item.${index}.produto`}
            error={errors?.item && errors?.item[index]?.produto?.idproduto}
            onChangeCallback={(value) => {
              setValue(
                `item.${index}.vlparcial`,
                Number(value ? value?.vlproduto : 0) *
                  Number(getValues(`item.${index}.qtitem`))
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
