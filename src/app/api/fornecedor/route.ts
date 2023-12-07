import { TFornecedorZod } from '@/types/index';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filterDsFornecedor = searchParams.get('dsFornecedor');
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const fornecedores = await prisma.fornecedor.findMany({
      select: { dsfornecedor: true, idfornecedor: true },
      where: {
        dsfornecedor: {
          contains: filterDsFornecedor || '',
        },
      },
      orderBy: {
        idfornecedor: 'asc',
      },
    });

    retorno = { status: 200, data: fornecedores };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}

export async function POST(request: NextRequest) {
  const data: TFornecedorZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const fornecedor = await prisma.fornecedor.create({
      data,
    });

    retorno = { status: 200, data: fornecedor };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}

export async function PUT(request: NextRequest) {
  const data: TFornecedorZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const fornecedor = await prisma.fornecedor.update({
      where: { idfornecedor: data.idfornecedor },
      data,
    });
    retorno = { status: 200, data: fornecedor };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}
