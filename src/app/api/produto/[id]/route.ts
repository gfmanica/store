import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const produto = await prisma.produto.findUnique({
    select: {
      idProduto: true,
      dsProduto: true,
      qtProduto: true,
      vlProduto: true,
      fornecedor: { select: { dsFornecedor: true, idFornecedor: true } },
    },
    where: {
      idProduto: Number(params.id),
    },
  });

  prisma.$disconnect();

  return NextResponse.json(produto);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  try {
    const fornecedor = await prisma.produto.delete({
      where: { idProduto: Number(params.id) },
    });
    prisma.$disconnect();
    return NextResponse.json(fornecedor);
  } catch (e) {
    
    prisma.$disconnect();
    return NextResponse.json(e);
  }
}

