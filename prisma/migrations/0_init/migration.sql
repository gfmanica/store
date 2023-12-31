-- CreateTable
CREATE TABLE "Fornecedor" (
    "idFornecedor" SERIAL NOT NULL,
    "dsFornecedor" VARCHAR(45),

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("idFornecedor")
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "idFuncionario" SERIAL NOT NULL,
    "dsFuncionario" VARCHAR(45),
    "nrCpf" VARCHAR(45),
    "dsSenha" VARCHAR(50),
    "dsFuncao" VARCHAR(50),

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("idFuncionario")
);

-- CreateTable
CREATE TABLE "Item" (
    "idItem" SERIAL NOT NULL,
    "qtItem" INTEGER,
    "vlParcial" DECIMAL(7,2),
    "idProduto" INTEGER,
    "idVenda" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("idItem")
);

-- CreateTable
CREATE TABLE "Produto" (
    "idProduto" SERIAL NOT NULL,
    "dsProduto" VARCHAR(45),
    "vlProduto" DECIMAL(7,2),
    "qtProduto" INTEGER,
    "idFornecedor" INTEGER,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("idProduto")
);

-- CreateTable
CREATE TABLE "Venda" (
    "idVenda" SERIAL NOT NULL,
    "dtVenda" TIMESTAMP(6),
    "vlTotal" DECIMAL(7,2),
    "idFuncionario" INTEGER,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("idVenda")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "Produto"("idProduto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_idVenda_fkey" FOREIGN KEY ("idVenda") REFERENCES "Venda"("idVenda") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_idFornecedor_fkey" FOREIGN KEY ("idFornecedor") REFERENCES "Fornecedor"("idFornecedor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_idFuncionario_fkey" FOREIGN KEY ("idFuncionario") REFERENCES "Funcionario"("idFuncionario") ON DELETE NO ACTION ON UPDATE NO ACTION;

