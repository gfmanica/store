import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const funcionario = await prisma.funcionario.findUnique({
    select: {
      idFuncionario: true,
      dsFuncionario: true,
      dsFuncao: true,
      nrCpf: true,
      dsSenha: true,
    },
    where: {
      idFuncionario: Number(params.id),
    },
  });

  prisma.$disconnect();

  return NextResponse.json(funcionario);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: Number(params.id) },
    });

    await prisma.$executeRawUnsafe(`DROP USER ${funcionario?.dsFuncionario}`);

    await prisma.funcionario.delete({
      where: { idFuncionario: Number(params.id) },
    });

    prisma.$disconnect();
    return NextResponse.json(funcionario);
  } catch (e) {
    prisma.$disconnect();
    return NextResponse.json(e);
  }
}
