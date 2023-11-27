import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const produto = await prisma.venda.findUnique({
    select: {
      idVenda: true,
      dtVenda: true,
      vlTotal: true,
      funcionario: true,
      item: {
        select: {
          idItem: true,
          produto: true,
          qtItem: true,
          vlParcial: true,
        },
      },
    },
    where: {
      idVenda: Number(params.id),
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
    const items = await prisma.item.deleteMany({
      where: { venda: { idVenda: Number(params.id) } },
    });

    const venda = await prisma.venda.delete({
      where: { idVenda: Number(params.id) },
    });
    prisma.$disconnect();

    return NextResponse.json({});
  } catch (e) {
    prisma.$disconnect();
    return NextResponse.json(e);
  }
}
