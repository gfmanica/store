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
  idFornecedor: z.number(),
});
