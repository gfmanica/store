import { TFornecedorZod } from '@/types/index';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filterDsFornecedor = searchParams.get('dsFornecedor');
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const fornecedores = await prisma.fornecedor.findMany({
    select: { dsFornecedor: true, idFornecedor: true },
    where: {
      dsFornecedor: {
        contains: filterDsFornecedor || '',
      },
    },
  });

  prisma.$disconnect();

  return NextResponse.json(fornecedores);
}

export async function POST(request: NextRequest) {
  const data: TFornecedorZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const fornecedor = await prisma.fornecedor.upsert({
    where: { idFornecedor: data.idFornecedor || -1 },
    update: { dsFornecedor: data.dsFornecedor },
    create: data,
  });

  prisma.$disconnect();

  return NextResponse.json(fornecedor);
}
