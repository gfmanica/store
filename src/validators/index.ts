import z from 'zod';

export const fornecedorZod = z.object({
  idFornecedor: z.number().optional(),
  dsFornecedor: z.string(),
});

export const produtoZod = z.object({
  idProduto: z.number().optional(),
  dsProduto: z.string(),
  vlProduto: z.string(),
  qtProduto: z.number(),
  fornecedor: z.object({
    idFornecedor: z.number(),
    dsFornecedor: z.string(),
  }),
});

export const itemZod = z.object({
  idItem: z.number(),
  idProduto: z.number(),
  qtItem: z.number().default(0),
  vlParcial: z.number().default(0),
  produto: produtoZod.optional(),
});

export const vendaZod = z.object({
  idVenda: z.number().optional(),
  dtVenda: z.string().datetime(),
  vlTotal: z.number().default(0),
  funcionario: z.object({
    idFuncionario: z.number(),
  }),
  item: z.array(itemZod).default([]),
});
