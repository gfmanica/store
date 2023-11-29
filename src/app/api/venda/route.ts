import { TConnection, TVendaZod } from '@/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

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
      funcionario: {
        select: {
          dsFuncionario: true,
        },
      },
    },
  });

  prisma.$disconnect();

  return NextResponse.json(vendas);
}

export async function POST(request: NextRequest) {
  const data: TVendaZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const venda = await prisma.venda.upsert({
    where: { idVenda: data.idVenda || -1 },
    update: {
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
    create: {
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

  prisma.$disconnect();

  return NextResponse.json(venda);
}
