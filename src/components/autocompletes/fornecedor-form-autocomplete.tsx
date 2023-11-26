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

export default function FornecedorFormAutocomplete<
  TFieldValues extends FieldValues
>({
  control,
  name,
  label,
  error,
  disabled,
  className,
}: TInputField<TFieldValues>) {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [fornecedores, setFornecedores] = useState<TFornecedor[]>([]);

  const { data, isFetching } = useQuery<TFornecedor[]>({
    queryKey: ['getFornecedores'],
    queryFn: () => Api.get('/api/fornecedor').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        if (data && !selectedKey && value) {
          setSelectedKey(value.idFornecedor.toString());
        }
        
        return (
          <Autocomplete
            defaultItems={data || []}
            label={label}
            disabled={disabled}
            isLoading={isFetching}
            className={cn(className)}
            isInvalid={!!error}
            errorMessage={error ? error?.message : ''}
            selectedKey={selectedKey}
            onSelectionChange={(key: string) => {
              const fornecedor = data?.find(
                (item) => item.idFornecedor === Number(key)
              );

              if (fornecedor) {
                onChange(fornecedor);
                setSelectedKey(key);
              } else {
                onChange(null);
                setSelectedKey('');
              }
            }}
          >
            {(fornecedor: TFornecedor) => (
              <AutocompleteItem key={fornecedor.idFornecedor}>
                {fornecedor.dsFornecedor}
              </AutocompleteItem>
            )}
          </Autocomplete>
        );
      }}
    />
  );
}
