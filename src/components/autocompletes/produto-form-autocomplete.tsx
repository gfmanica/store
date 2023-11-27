import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TProduto } from '@/types';
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
  label?: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues, unknown>;
  error?: FieldError;
  disabled?: boolean;
  className?: HTMLProps<HTMLElement>['className'];
  size?: 'sm' | 'md' | 'lg';
  onChangeCallback?: (value: TProduto | null) => void;
};

export default function ProdutoFormAutocomplete<
  TFieldValues extends FieldValues
>({
  control,
  size = 'sm',
  name,
  label,
  error,
  disabled,
  className,
  onChangeCallback,
}: TInputField<TFieldValues>) {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();
  const [selectedKey, setSelectedKey] = useState<string>('');

  const { data, isFetching } = useQuery<TProduto[]>({
    queryKey: ['getProdutos'],
    queryFn: () => Api.get('/api/produto').then((res) => res.data),
    retry: false,
    enabled: isAuthenticated,
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        if (data && !selectedKey && value) {
          setSelectedKey(value.idProduto.toString());
        }

        return (
          <Autocomplete
            defaultItems={data || []}
            label={label}
            disabled={disabled}
            isLoading={isFetching}
            className={cn(className)}
            size={size}
            isInvalid={!!error}
            errorMessage={error ? error?.message : ''}
            selectedKey={selectedKey}
            onSelectionChange={(key: string) => {
              const fornecedor = data?.find(
                (item) => item.idProduto === Number(key)
              );

              if (fornecedor) {
                onChange(fornecedor);
                setSelectedKey(key);
              } else {
                onChange(null);
                setSelectedKey('');
              }

              if (onChangeCallback) {
                onChangeCallback(fornecedor || null);
              }
            }}
          >
            {(fornecedor: TProduto) => (
              <AutocompleteItem key={fornecedor.idProduto}>
                {fornecedor.dsProduto}
              </AutocompleteItem>
            )}
          </Autocomplete>
        );
      }}
    />
  );
}
