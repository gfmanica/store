import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.headers;
  const datasourceUrl = searchParams.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
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

    retorno = { status: 200, data: funcionario };
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
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: Number(params.id) },
    });

    await prisma.$executeRawUnsafe(`DROP USER ${funcionario?.dsFuncionario}`);

    await prisma.funcionario.delete({
      where: { idFuncionario: Number(params.id) },
    });

    retorno = { status: 200, data: funcionario };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}
