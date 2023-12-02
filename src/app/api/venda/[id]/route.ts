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
    const venda = await prisma.venda.findUnique({
      select: {
        idVenda: true,
        dtVenda: true,
        vlTotal: true,
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

    retorno = { status: 200, data: venda };
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
    await prisma.item.deleteMany({
      where: { venda: { idVenda: Number(params.id) } },
    });

    await prisma.venda.delete({
      where: { idVenda: Number(params.id) },
    });
    prisma.$disconnect();

    retorno = { status: 200, data: {} };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}
