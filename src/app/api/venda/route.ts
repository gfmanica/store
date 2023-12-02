import { TConnection, TVendaZod } from '@/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const vendas = await prisma.venda.findMany({
      select: {
        idVenda: true,
        dtVenda: true,
        vlTotal: true,
        _count: {
          select: {
            item: true,
          },
        },
      },
    });

    retorno = { status: 200, data: vendas };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}

export async function POST(request: NextRequest) {
  const data: TVendaZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const venda = await prisma.venda.create({
      data: {
        dtVenda: data.dtVenda,
        funcionario: {
          connect: { dsFuncionario: data.funcionario.dsFuncionario },
        },
        vlTotal: data.vlTotal,
        item: {
          create: data.item.map((item) => {
            return {
              qtItem: item.qtItem,
              vlParcial: item.vlParcial,
              produto: {
                connect: { idProduto: item.produto?.idProduto },
              },
            };
          }),
        },
      },
    });

    retorno = { status: 200, data: venda };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}

export async function PUT(request: NextRequest) {
  const data: TVendaZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const venda = await prisma.venda.update({
      where: { idVenda: data.idVenda },
      data: {
        dtVenda: data.dtVenda,
        funcionario: {
          connect: { dsFuncionario: data.funcionario.dsFuncionario },
        },
        vlTotal: data.vlTotal,
        item: {
          upsert: data.item.map((item) => {
            return {
              where: { idItem: item.idItem },
              update: {
                qtItem: item.qtItem,
                vlParcial: item.vlParcial,
                produto: {
                  connect: { idProduto: item.produto?.idProduto },
                },
              },
              create: {
                qtItem: item.qtItem,
                vlParcial: item.vlParcial,
                produto: {
                  connect: { idProduto: item.produto?.idProduto },
                },
              },
            };
          }),
        },
      },
    });

    retorno = { status: 200, data: venda };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}
