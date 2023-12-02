'use client';

import FornecedorFormAutocomplete from '@/components/autocompletes/fornecedor-form-autocomplete';
import NumberFormField from '@/components/fields/number-form-field';
import PatternFormField from '@/components/fields/pattern-form-field';
import TextFormField from '@/components/fields/text-form-field';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TItemZod, TResponse, TVenda, TVendaZod } from '@/types/index';
import { produtoZod, vendaZod } from '@/validators/index';
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
  const { user } = useAuthContext();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TVendaZod>({
    resolver: zodResolver(vendaZod),
    defaultValues: {
      funcionario: { dsFuncionario: user },
    },
  });

  const { data, isFetching, error } = useQuery<TResponse<TVendaZod>>({
    queryKey: ['getVenda'],
    queryFn: () => Api.get(`/api/venda/${idVenda}`).then((res) => res.data),
    retry: false,
    gcTime: 0,
    enabled: isAuthenticated && !!idVenda,
  });

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Você não possui permissão para editar a venda', {
        variant: 'error',
      });
    }
  }, [error]);

  console.log(errors);

  useEffect(() => {
    debugger;
    if (data?.data) {
      data.data.item.forEach((item) => {
        item.vlParcial = Number(item.vlParcial);
      });

      data.data.dtVenda = new Date(data.data.dtVenda).toLocaleDateString();
      data.data.funcionario = { dsFuncionario: user };

      reset(data?.data);
    }
  }, [data]);

  const { mutate, isPending } = useMutation<
    AxiosResponse<TResponse<TVenda>>,
    AxiosError,
    TVendaZod
  >({
    mutationFn: (data) =>
      idVenda
        ? Api.put('/api/venda', {
            ...data,
            funcionario: { dsFuncionario: user },
          })
        : Api.post('/api/venda', {
            ...data,
            funcionario: { dsFuncionario: user },
          }),
    onSuccess: (data) => {
      if (data.data.status === 400) {
        enqueueSnackbar('Você não possui permissão para editar a venda', {
          variant: 'error',
        });
      } else {
        let message = 'Venda salva com sucesso!';

        if (!idVenda) {
          push(`/form/${data.data.data.idVenda}`);

          message = 'Venda criado com sucesso!';
        }

        enqueueSnackbar(message, { variant: 'success' });
      }
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
      qtItem: 0,
      vlParcial: 0,
      produto: null,
    };

    setValue('item', [...items, newItem]);
  };

  const formatData = (data: TVendaZod) => {
    const newData = { ...data };
    const [day, month, year] = newData.dtVenda.split('/');

    newData.dtVenda = new Date(`${year}-${month}-${day}`).toISOString();

    mutate(newData);
  };

  return (
    <>
      <p className="text-2xl font-semibold">
        {idVenda ? 'Editar' : 'Cadastrar'} venda
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(formatData)}>
        <div className="flex gap-4">
          <PatternFormField<TVendaZod>
            control={control}
            label="Data da venda"
            name="dtVenda"
            mask="_"
            format="##/##/####"
            allowEmptyFormatting
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
            className="font-semibold"
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
            className="font-semibold"
          >
            Salvar
          </Button>
        </div>
      </form>
    </>
  );
}
