import z from 'zod';

export const fornecedorZod = z.object({
  idfornecedor: z.number().optional(),
  dsfornecedor: z.string(),
});

export const produtoZod = z.object({
  idproduto: z.number().optional(),
  dsproduto: z.string(),
  vlproduto: z.string(),
  qtproduto: z.number(),
  fornecedor: z.object({
    idfornecedor: z.number(),
    dsfornecedor: z.string(),
  }),
});

export const itemZod = z.object({
  iditem: z.number(),
  qtitem: z.number().default(0),
  vlparcial: z.number().default(0),
  produto: z
    .object({
      idproduto: z.number(),
      dsproduto: z.string().nullish(),
      vlproduto: z.string().nullish(),
      qtproduto: z.number().nullish(),
    })
    .nullable(),
});

export const vendaZod = z.object({
  idvenda: z.number().optional(),
  dtvenda: z.string().min(9),
  vltotal: z.number().default(0),
  funcionario: z.object({
    dsfuncionario: z.string(),
  }),
  item: z.array(itemZod).min(1).default([]),
});

export const funcionarioZod = z.object({
  idfuncionario: z.number().optional(),
  dsfuncionario: z.string(),
  nrcpf: z.string(),
  dsfuncao: z.string(),
  dssenha: z.string(),
});
