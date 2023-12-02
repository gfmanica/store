import { TProduto, TProdutoZod } from '@/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const produtos = await prisma.produto.findMany({
      select: {
        idProduto: true,
        dsProduto: true,
        qtProduto: true,
        vlProduto: true,
        fornecedor: { select: { dsFornecedor: true } },
      },
    });

    retorno = { status: 200, data: produtos };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}

export async function POST(request: NextRequest) {
  const data: TProdutoZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const produtos = await prisma.produto.create({
      data: {
        dsProduto: data.dsProduto,
        qtProduto: data.qtProduto,
        vlProduto: data.vlProduto,
        fornecedor: { connect: { idFornecedor: data.fornecedor.idFornecedor } },
      },
    });

    retorno = { status: 200, data: produtos };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}

export async function PUT(request: NextRequest) {
  const data: TProdutoZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const produtos = await prisma.produto.update({
      where: { idProduto: data.idProduto },
      data: {
        dsProduto: data.dsProduto,
        qtProduto: data.qtProduto,
        vlProduto: data.vlProduto,
        fornecedor: { connect: { idFornecedor: data.fornecedor.idFornecedor } },
      },
    });

    retorno = { status: 200, data: produtos };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}
