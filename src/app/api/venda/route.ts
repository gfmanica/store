import { TConnection } from '@/types';
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
