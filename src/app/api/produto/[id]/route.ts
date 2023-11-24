import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const produto = await prisma.produto.findUnique({
    select: {
      idProduto: true,
      dsProduto: true,
      qtProduto: true,
      vlProduto: true,
      fornecedor: { select: { dsFornecedor: true } },
    },
    where: {
      idProduto: Number(params.id),
    },
  });

  prisma.$disconnect();

  return NextResponse.json(produto);
}
