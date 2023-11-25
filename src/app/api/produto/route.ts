import { TProduto, TProdutoZod } from '@/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const produtos = await prisma.produto.findMany({
    select: {
      idProduto: true,
      dsProduto: true,
      qtProduto: true,
      vlProduto: true,
      fornecedor: { select: { dsFornecedor: true } },
    },
  });

  prisma.$disconnect();

  return NextResponse.json(produtos);
}

export async function POST(request: NextRequest) {
  const data: TProdutoZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const produtos = await prisma.produto.upsert({
    where: { idProduto: data.idProduto || -1 },
    update: {
      dsProduto: data.dsProduto,
      qtProduto: data.qtProduto,
      vlProduto: data.vlProduto,
      fornecedor: { connect: { idFornecedor: data.fornecedor.idFornecedor } },
    },
    create: {
      dsProduto: data.dsProduto,
      qtProduto: data.qtProduto,
      vlProduto: data.vlProduto,
      fornecedor: { connect: { idFornecedor: data.fornecedor.idFornecedor } },
    },
  });

  prisma.$disconnect();

  return NextResponse.json(produtos);
}
