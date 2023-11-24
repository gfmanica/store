import { TFornecedorZod } from '@/types/index';
import { Fornecedor, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const fornecedores = await prisma.fornecedor.findMany({
    select: { dsFornecedor: true, idFornecedor: true },
  });

  prisma.$disconnect();

  return NextResponse.json(fornecedores);
}

export async function POST(request: NextRequest) {
  const data: TFornecedorZod = await request.json();
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  console.log(data);
  const prisma = new PrismaClient({ datasourceUrl });

  const produtos = await prisma.fornecedor.upsert({
    where: { idFornecedor: data.idFornecedor || -1 },
    update: { dsFornecedor: data.dsFornecedor },
    create: data,
  });

  prisma.$disconnect();

  return NextResponse.json(produtos);
}
