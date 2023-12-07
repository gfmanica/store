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
        idproduto: true,
        dsproduto: true,
        qtproduto: true,
        vlproduto: true,
        fornecedor: { select: { dsfornecedor: true } },
      },
      orderBy: {
        idproduto: 'asc',
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
        dsproduto: data.dsproduto,
        qtproduto: data.qtproduto,
        vlproduto: data.vlproduto,
        fornecedor: { connect: { idfornecedor: data.fornecedor.idfornecedor } },
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
      where: { idproduto: data.idproduto },
      data: {
        dsproduto: data.dsproduto,
        qtproduto: data.qtproduto,
        vlproduto: data.vlproduto,
        fornecedor: { connect: { idfornecedor: data.fornecedor.idfornecedor } },
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
