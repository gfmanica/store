'use client';

import TextFormField from '@/components/fields/text-form-field';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TFornecedor, TFornecedorZod } from '@/types/index';
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
  const idFornecedor = params?.id?.[0];
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFornecedorZod>({
    resolver: zodResolver(fornecedorZod),
  });

  const { data, isFetching } = useQuery<TFornecedor>({
    queryKey: ['getFornecedor'],
    queryFn: () =>
      Api.get(`/api/fornecedor/${idFornecedor}`).then((res) => res.data),
    retry: false,
    gcTime: 0,
    enabled: isAuthenticated && !!idFornecedor,
  });

  useEffect(() => (data ? reset(data) : undefined), [data]);

  const { mutate, isPending } = useMutation<
    AxiosResponse<TFornecedorZod>,
    AxiosError,
    TFornecedorZod
  >({
    mutationFn: (data) => Api.post('/api/fornecedor', data),
    onSuccess: (data) => {
      let message = 'Fornecedor salvo com sucesso!';

      if (!idFornecedor) {
        push(`/fornecedor/form/${data.data.idFornecedor}`);

        message = 'Fornecedor criado com sucesso!';
      }

      enqueueSnackbar(message, { variant: 'success' });
    },
  });

  return (
    <>
      <p className="text-2xl font-semibold">Fornecedor</p>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <TextFormField<TFornecedorZod>
          control={control}
          label="Fornecedor"
          name="dsFornecedor"
          error={errors.dsFornecedor}
        />

        <div className="flex justify-end">
          <Button
            variant="shadow"
            color="primary"
            type="submit"
            isLoading={isPending}
          >
            Salvar
          </Button>
        </div>
      </form>
    </>
  );
}
