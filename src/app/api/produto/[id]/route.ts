import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
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

    retorno = { status: 200, data: produto };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const fornecedor = await prisma.produto.delete({
      where: { idProduto: Number(params.id) },
    });

    retorno = { status: 200, data: fornecedor };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}
