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
        idvenda: true,
        dtvenda: true,
        vltotal: true,
        _count: {
          select: {
            item: true,
          },
        },
      },
      orderBy: {
        idvenda: 'asc',
      },
    });

    retorno = { status: 200, data: vendas };
  } catch (e) {
    console.log(e);
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
        dtvenda: data.dtvenda,
        funcionario: {
          connect: { dsfuncionario: data.funcionario.dsfuncionario },
        },
        vltotal: data.vltotal,
        item: {
          create: data.item.map((item) => {
            return {
              qtitem: item.qtitem,
              vlparcial: item.vlparcial,
              produto: {
                connect: { idproduto: item.produto?.idproduto },
              },
            };
          }),
        },
      },
    });

    retorno = { status: 200, data: venda };
  } catch (e) {
    console.log(e);
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
      where: { idvenda: data.idvenda },
      data: {
        dtvenda: data.dtvenda,
        funcionario: {
          connect: { dsfuncionario: data.funcionario.dsfuncionario },
        },
        vltotal: data.vltotal,
        item: {
          upsert: data.item.map((item) => {
            return {
              where: { iditem: item.iditem },
              update: {
                qtitem: item.qtitem,
                vlparcial: item.vlparcial,
                produto: {
                  connect: { idproduto: item.produto?.idproduto },
                },
              },
              create: {
                qtitem: item.qtitem,
                vlparcial: item.vlparcial,
                produto: {
                  connect: { idproduto: item.produto?.idproduto },
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
