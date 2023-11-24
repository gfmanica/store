import z from 'zod';

export const fornecedorZod = z.object({
  idFornecedor: z.number().optional(),
  dsFornecedor: z.string(),
});
