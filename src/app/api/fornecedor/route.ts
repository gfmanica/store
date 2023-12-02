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
      select: { dsFornecedor: true, idFornecedor: true },
      where: {
        dsFornecedor: {
          contains: filterDsFornecedor || '',
        },
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
      where: { idFornecedor: data.idFornecedor },
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
