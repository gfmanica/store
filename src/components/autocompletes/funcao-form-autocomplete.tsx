import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TFornecedor } from '@/types';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/utils/cn';
import { HTMLProps, useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';

type TInputField<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues, unknown>;
  error?: FieldError;
  disabled?: boolean;
  className?: HTMLProps<HTMLElement>['className'];
};

type Funcao = {
  tpFuncao: string;
  dsFuncao: string;
};

const funcoes: Funcao[] = [
  { tpFuncao: 'admin', dsFuncao: 'Administrador' },
  { tpFuncao: 'auditor', dsFuncao: 'Auditor' },
  { tpFuncao: 'criador', dsFuncao: 'Criador' },
  { tpFuncao: 'vendedor', dsFuncao: 'Vendedor' },
];

export default function FuncaoFormAutocomplete<
  TFieldValues extends FieldValues
>({
  control,
  name,
  label,
  error,
  disabled,
  className,
}: TInputField<TFieldValues>) {
  const [selectedKey, setSelectedKey] = useState<string>('');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        if (!selectedKey && value) {
          setSelectedKey(value);
        }

        return (
          <Autocomplete
            defaultItems={funcoes}
            label={label}
            disabled={disabled}
            className={cn(className)}
            isInvalid={!!error}
            errorMessage={error ? error?.message : ''}
            selectedKey={selectedKey}
            onSelectionChange={(key: string) => {
              if (key) {
                onChange(key);
                setSelectedKey(key);
              } else {
                onChange(null);
                setSelectedKey('');
              }
            }}
          >
            {(fornecedor: Funcao) => (
              <AutocompleteItem key={fornecedor.tpFuncao}>
                {fornecedor.dsFuncao}
              </AutocompleteItem>
            )}
          </Autocomplete>
        );
      }}
    />
  );
}
