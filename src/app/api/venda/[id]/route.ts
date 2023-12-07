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
        idvenda: true,
        dtvenda: true,
        vltotal: true,
        item: {
          select: {
            iditem: true,
            produto: true,
            qtitem: true,
            vlparcial: true,
          },
        },
      },
      where: {
        idvenda: Number(params.id),
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
      where: { venda: { idvenda: Number(params.id) } },
    });

    await prisma.venda.delete({
      where: { idvenda: Number(params.id) },
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
