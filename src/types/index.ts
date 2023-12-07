import {
  fornecedorZod,
  funcionarioZod,
  itemZod,
  produtoZod,
  vendaZod,
} from '@/validators/index';
import z from 'zod';

export type TConnection = {
  status: number;
  message: string;
};

export type TVenda = {
  idvenda: number;
  dtvenda: string;
  vltotal: string;
  funcionario: {
    dsfuncionario: string;
  };
  _count: {
    item: number;
  };
};

export type TVendaZod = z.infer<typeof vendaZod>;

export type TFornecedor = {
  idfornecedor: number;
  dsfornecedor: string;
};

export type TFornecedorZod = z.infer<typeof fornecedorZod>;

export type TProduto = {
  idproduto?: number;
  dsproduto: string;
  qtproduto: number;
  vlproduto: string;
  fornecedor: TFornecedor;
};

export type TProdutoReturn = {
  idproduto?: number;
  dsproduto: string;
  qtproduto: number;
  vlproduto: string;
  idfornecedor: number;
};

export type TProdutoZod = z.infer<typeof produtoZod>;

export type TItemZod = z.infer<typeof itemZod>;

export type TFuncionarioZod = z.infer<typeof funcionarioZod>;

export type TFuncionario = {
  idfuncionario: number;
  dsfuncionario: string;
  dsfuncao: string;
  nrcpf: string;
};

export type TResponse<TData> = {
  data: TData
  status: number;
};
