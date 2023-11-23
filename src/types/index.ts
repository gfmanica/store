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
