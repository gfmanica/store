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
    select: { dsFornecedor: true, idFornecedor: true },
    where: {
      idFornecedor: Number(params.id),
    },
  });

  prisma.$disconnect();

  return NextResponse.json(fornecedor);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  try {
    const fornecedor = await prisma.fornecedor.delete({
      where: { idFornecedor: Number(params.id) },
    });
    prisma.$disconnect();
    return NextResponse.json(fornecedor);
  } catch (e) {
    
    prisma.$disconnect();
    return NextResponse.json(e);
  }
}
