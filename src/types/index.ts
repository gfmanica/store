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

export type TFornecedor = {
  idFornecedor: number;
  dsFornecedor: string;
};

export type TProduto = {
  idProduto: number;
  dsProduto: string;
  qtProduto: number;
  vlProduto: string;
  fornecedor: {
    dsFornecedor: string;
  };
};
