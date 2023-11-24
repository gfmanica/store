import { PrismaClient } from '@prisma/client';
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
