'use client';

import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import { TFornecedor, TFornecedorZod } from '@/types/index';
import { fornecedorZod } from '@/validators/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';

export default function FornecedorForm({
  params,
}: {
  params: { id: string[] };
}) {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();
  const idFornecedor = Boolean(params?.id?.[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFornecedorZod>({
    resolver: zodResolver(fornecedorZod),
  });

  const { data, isFetching } = useQuery<TFornecedor>({
    queryKey: ['getFornecedor'],
    queryFn: () => Api.get('/api/fornecedor').then((res) => res.data),
    retry: false,
    gcTime: 0,
    enabled: isAuthenticated && idFornecedor,
  });

  const { mutate } = useMutation<AxiosResponse, AxiosError, TFornecedorZod>({
    mutationFn: (data) => Api.post('/api/fornecedor', data),
  });

  return (
    <>
      <p className="text-2xl font-semibold">Fornecedor</p>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <Input
          label="Fornecedor"
          {...register('dsFornecedor')}
          isInvalid={errors.dsFornecedor}
          errorMessage={errors.dsFornecedor}
          defaultValue={null}
        />

        <div className="flex justify-end">
          <Button variant="shadow" color="primary" type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </>
  );
}
