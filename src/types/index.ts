import { fornecedorZod, itemZod, produtoZod, vendaZod } from '@/validators/index';
import { Fornecedor } from '@prisma/client';
import z from 'zod';

export type TConnection = {
  status: number;
  message: string;
};

export type TVenda = {
  idVenda: number;
  dtVenda: string;
  vlTotal: string;
  funcionario: {
    dsFuncionario: string;
  };
  _count: {
    item: number;
  };
};

export type TVendaZod = z.infer<typeof vendaZod>;

export type TFornecedor = {
  idFornecedor: number;
  dsFornecedor: string;
};

export type TFornecedorZod = z.infer<typeof fornecedorZod>;

export type TProduto = {
  idProduto?: number;
  dsProduto: string;
  qtProduto: number;
  vlProduto: string;
  fornecedor: TFornecedor;
};

export type TProdutoReturn = {
  idProduto?: number;
  dsProduto: string;
  qtProduto: number;
  vlProduto: string;
  idFornecedor: number;
};

export type TProdutoZod = z.infer<typeof produtoZod>;

export type TItemZod = z.infer<typeof itemZod>;
