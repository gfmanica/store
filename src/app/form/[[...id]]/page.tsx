'use client';

import FornecedorFormAutocomplete from '@/components/autocompletes/fornecedor-form-autocomplete';
import NumberFormField from '@/components/fields/number-form-field';
import TextFormField from '@/components/fields/text-form-field';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TItemZod, TVendaZod } from '@/types/index';
import { produtoZod } from '@/validators/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ProdutoDataTable from './components/produto-data-table';

export default function VendaForm({ params }: { params: { id: string[] } }) {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();
  const idVenda = params?.id?.[0];
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TVendaZod>({
    resolver: zodResolver(produtoZod),
  });

  const { data, isFetching } = useQuery<TVendaZod>({
    queryKey: ['getVenda'],
    queryFn: () => Api.get(`/api/venda/${idVenda}`).then((res) => res.data),
    retry: false,
    gcTime: 0,
    enabled: isAuthenticated && !!idVenda,
  });

  useEffect(() => (data ? reset(data) : undefined), [data]);

  const { mutate, isPending } = useMutation<
    AxiosResponse<any>,
    AxiosError,
    TVendaZod
  >({
    mutationFn: (data) => Api.post('/api/venda', data),
    onSuccess: (data) => {
      let message = 'Venda salva com sucesso!';

      if (!idVenda) {
        push(`/form/${data.data.idVenda}`);

        message = 'Venda criado com sucesso!';
      }

      enqueueSnackbar(message, { variant: 'success' });
    },
  });

  const addProduto = () => {
    const items = getValues('item') || [];

    let newItem: TItemZod = {
      idItem: items.at(-1)
        ? Number(items.at(-1)?.idItem) < 0
          ? Number(items.at(-1)?.idItem) - 1
          : -1
        : -1,
      idProduto: -1,
      qtItem: 0,
      vlParcial: 0,
      produto: null,
    };

    setValue('item', [...items, newItem]);
  };

  return (
    <>
      <p className="text-2xl font-semibold">
        {idVenda ? 'Editar' : 'Cadastrar'} venda
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <div className="flex gap-4">
          <TextFormField<TVendaZod>
            control={control}
            label="Data da venda"
            name="dtVenda"
            error={errors.dtVenda}
          />

          <NumberFormField<TVendaZod>
            control={control}
            label="Valor total"
            name="vlTotal"
            disabled
            prefix="R$ "
            decimalScale={2}
            error={errors.vlTotal}
          />
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Produtos</p>

          <Button
            variant="shadow"
            color="primary"
            size="sm"
            onClick={addProduto}
            className='font-semibold'
          >
            Incluir
          </Button>
        </div>

        <ProdutoDataTable
          data={watch('item')}
          control={control}
          errors={errors}
          isFetching={isFetching}
          setValue={setValue}
          getValues={getValues}
        />

        <div className="flex justify-end">
          <Button
            variant="shadow"
            color="primary"
            type="submit"
            isLoading={isPending}
            className='font-semibold'
          >
            Salvar
          </Button>
        </div>
      </form>
    </>
  );
}
