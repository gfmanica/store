'use client';

import FornecedorFormAutocomplete from '@/components/autocompletes/fornecedor-form-autocomplete';
import FuncaoFormAutocomplete from '@/components/autocompletes/funcao-form-autocomplete';
import NumberFormField from '@/components/fields/number-form-field';
import PatternFormField from '@/components/fields/pattern-form-field';
import TextFormField from '@/components/fields/text-form-field';
import { useApiContext } from '@/contexts/api-context';
import { useAuthContext } from '@/contexts/auth-context';
import {
  TFornecedor,
  TProduto,
  TProdutoReturn,
  TFuncionarioZod,
  TResponse,
  TFuncionario,
} from '@/types/index';
import { funcionarioZod, produtoZod } from '@/validators/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function FuncionarioForm({
  params,
}: {
  params: { id: string[] };
}) {
  const { isAuthenticated } = useAuthContext();
  const Api = useApiContext();
  const idFuncionario = params?.id?.[0];
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFuncionarioZod>({
    resolver: zodResolver(funcionarioZod),
  });

  const { data, isFetching, error } = useQuery<TResponse<TFuncionarioZod>>({
    queryKey: ['getFuncionario'],
    queryFn: () =>
      Api.get(`/api/funcionario/${idFuncionario}`).then((res) => res.data),
    retry: false,
    gcTime: 0,
    enabled: isAuthenticated && !!idFuncionario,
  });

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Você não possui permissão para editar o produto', {
        variant: 'error',
      });
    }
  }, [error]);

  useEffect(() => (data ? reset(data?.data) : undefined), [data]);

  const { mutate, isPending } = useMutation<
    AxiosResponse<TResponse<TFuncionario>>,
    AxiosError,
    TFuncionarioZod
  >({
    mutationFn: (data) =>
      idFuncionario
        ? Api.put('/api/funcionario', data)
        : Api.post('/api/funcionario', data),
    onSuccess: (data) => {
      if (data.data.status === 400) {
        enqueueSnackbar('Você não possui permissão para editar o produto', {
          variant: 'error',
        });
      } else {
        let message = 'Funcionário salvo com sucesso!';

        if (!idFuncionario) {
          push(`/funcionario/form/${data.data.data.idFuncionario}`);

          message = 'Funcionário criado com sucesso!';
        }

        enqueueSnackbar(message, { variant: 'success' });
      }
    },
  });

  return (
    <>
      <p className="text-2xl font-semibold">
        {idFuncionario ? 'Editar' : 'Cadastrar'} funcionario
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <div className="flex gap-4">
          <TextFormField<TFuncionarioZod>
            control={control}
            label="Funcionário"
            name="dsFuncionario"
            error={errors.dsFuncionario}
            disabled={Boolean(idFuncionario)}
          />

          <PatternFormField<TFuncionarioZod>
            control={control}
            format="###.###.###-##"
            label="CPF"
            name="nrCpf"
            error={errors.nrCpf}
          />
        </div>

        <div className="flex gap-4">
          <TextFormField<TFuncionarioZod>
            control={control}
            label="Senha"
            name="dsSenha"
            error={errors.dsSenha}
          />

          <FuncaoFormAutocomplete<TFuncionarioZod>
            control={control}
            label="Funcao"
            name="dsFuncao"
            error={errors.dsFuncao}
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
