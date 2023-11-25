import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const produtos = await prisma.produto.findMany({
    select: {
      idProduto: true,
      dsProduto: true,
      qtProduto: true,
      vlProduto: true,
      fornecedor: { select: { dsFornecedor: true } },
    },
  });

  prisma.$disconnect();

  return NextResponse.json(produtos);
}

// export async function POST(request: NextRequest) {
//   const data:  = await request.json();
//   const searchParams = request.headers;
//   const datasourceUrl = searchParams.get('datasourceUrl') || '';

//   const prisma = new PrismaClient({ datasourceUrl });

//   const produtos = await prisma.fornecedor.upsert({
//     where: { idFornecedor: data.idFornecedor || -1 },
//     update: { dsFornecedor: data.dsFornecedor },
//     create: data,
//   });

//   prisma.$disconnect();

//   return NextResponse.json(produtos);
// }
