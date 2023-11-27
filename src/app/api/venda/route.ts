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

  const connectOrCreateItem = data.item.map((item) => {
    return {
      where: { idItem: item.idItem },
      create: {
        idItem: item.idItem,
        qtItem: item.qtItem,
        vlParcial: item.vlParcial,
        idProduto: item.produto?.idProduto,
      },
    };
  });

  const venda = await prisma.venda.upsert({
    where: { idVenda: data.idVenda || -1 },
    update: {
      dtVenda: data.dtVenda,
      idFuncionario: data.funcionario.idFuncionario,
      vlTotal: data.vlTotal,
      item: {
        connectOrCreate: connectOrCreateItem,
      },
    },
    create: {
      dtVenda: data.dtVenda,
      idFuncionario: data.funcionario.idFuncionario,
      vlTotal: data.vlTotal,
      item: {
        connectOrCreate: connectOrCreateItem,
      },
    },
  });

  prisma.$disconnect();

  return NextResponse.json(venda);
}
