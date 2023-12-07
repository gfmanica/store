'use client';

import FornecedorFormAutocomplete from '@/components/autocompletes/fornecedor-form-autocomplete';
import NumberFormField from '@/components/fields/number-form-field';
import TextFormField from '@/components/fields/text-form-field';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import {
  TFornecedor,
  TProduto,
  TProdutoReturn,
  TProdutoZod,
  TResponse,
} from '@/types/index';
import { produtoZod } from '@/validators/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function ProdutoForm({ params }: { params: { id: string[] } }) {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();
  const idproduto = params?.id?.[0];
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TProdutoZod>({
    resolver: zodResolver(produtoZod),
  });

  const { data, isFetching } = useQuery<TResponse<TProduto>>({
    queryKey: ['getProduto'],
    queryFn: () => Api.get(`/api/produto/${idproduto}`).then((res) => res.data),
    retry: false,
    gcTime: 0,
    enabled: isAuthenticated && !!idproduto,
  });

  useEffect(() => {
    if (data?.status === 400) {
      enqueueSnackbar('Você não possui permissão para editar o produto', {
        variant: 'error',
      });
    }

    data ? reset(data?.data) : undefined;
  }, [data]);

  const { mutate, isPending } = useMutation<
    AxiosResponse<TResponse<TProdutoReturn>>,
    AxiosError,
    TProdutoZod
  >({
    mutationFn: (data) =>
      idproduto
        ? Api.put('/api/produto', data)
        : Api.post('/api/produto', data),
    onSuccess: (data) => {
      if (data.data.status === 400) {
        enqueueSnackbar('Você não possui permissão para editar o produto', {
          variant: 'error',
        });
      } else {
        let message = 'Produto salvo com sucesso!';

        if (!idproduto) {
          push(`/produto/form/${data.data.data.idproduto}`);

          message = 'Produto criado com sucesso!';
        }

        enqueueSnackbar(message, { variant: 'success' });
      }
    },
  });

  return (
    <>
      <p className="text-2xl font-semibold">
        {idproduto ? 'Editar' : 'Cadastrar'} produto
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <div className="flex gap-4">
          <TextFormField<TProdutoZod>
            control={control}
            label="Produto"
            name="dsproduto"
            error={errors.dsproduto}
          />

          <NumberFormField<TProdutoZod>
            control={control}
            label="Quantidade de estoque"
            name="qtproduto"
            error={errors.qtproduto}
          />
        </div>

        <div className="flex gap-4">
          <NumberFormField<TProdutoZod>
            control={control}
            label="Valor"
            name="vlproduto"
            prefix="R$ "
            decimalScale={2}
            valueFormat="value"
            error={errors.vlproduto}
          />

          <FornecedorFormAutocomplete<TProdutoZod>
            control={control}
            label="Fornecedor"
            name="fornecedor"
            error={errors.fornecedor?.idfornecedor}
          />
        </div>

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
