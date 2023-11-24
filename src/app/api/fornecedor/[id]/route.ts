import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const fornecedor = await prisma.fornecedor.findUnique({
    select: { dsFornecedor: true },
    where: {
      idFornecedor: Number(params.id),
    },
  });

  prisma.$disconnect();

  return NextResponse.json(fornecedor);
}
