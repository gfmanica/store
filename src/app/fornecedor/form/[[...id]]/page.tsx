'use client';

import TextFormField from '@/components/fields/text-form-field';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TFornecedor, TFornecedorZod, TResponse } from '@/types/index';
import { fornecedorZod } from '@/validators/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function FornecedorForm({
  params,
}: {
  params: { id: string[] };
}) {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();
  const idfornecedor = params?.id?.[0];
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFornecedorZod>({
    resolver: zodResolver(fornecedorZod),
  });

  const { data, isFetching, error } = useQuery<TResponse<TFornecedor>>({
    queryKey: ['getFornecedor'],
    queryFn: () =>
      Api.get(`/api/fornecedor/${idfornecedor}`).then((res) => res.data),
    retry: false,
    gcTime: 0,
    enabled: isAuthenticated && !!idfornecedor,
  });

  useEffect(() => {
    if (data?.status === 400) {
      enqueueSnackbar('Você não possui permissão para editar o fornecedor', {
        variant: 'error',
      });
    }

    data?.data ? reset(data?.data) : undefined;
  }, [data]);

  const { mutate, isPending } = useMutation<
    AxiosResponse<TResponse<TFornecedorZod>>,
    AxiosError,
    TFornecedorZod
  >({
    mutationFn: (data) =>
      idfornecedor
        ? Api.put('/api/fornecedor', data)
        : Api.post('/api/fornecedor', data),
    onSuccess: (data) => {
      if (data.data.status === 400) {
        enqueueSnackbar('Você não possui permissão para editar o fornecedor', {
          variant: 'error',
        });
      } else {
        let message = 'Fornecedor salvo com sucesso!';

        if (!idfornecedor) {
          push(`/fornecedor/form/${data.data.data.idfornecedor}`);

          message = 'Fornecedor criado com sucesso!';
        }

        enqueueSnackbar(message, { variant: 'success' });
      }
    },
  });

  return (
    <>
      <p className="text-2xl font-semibold">
        {idfornecedor ? 'Editar' : 'Cadastrar'} fornecedor
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <TextFormField<TFornecedorZod>
          control={control}
          label="Fornecedor"
          name="dsfornecedor"
          error={errors.dsfornecedor}
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
