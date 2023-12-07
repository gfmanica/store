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
        idfuncionario: true,
        dsfuncionario: true,
        dsfuncao: true,
        nrcpf: true,
        dssenha: true,
      },
      where: {
        idfuncionario: Number(params.id),
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
      where: { idfuncionario: Number(params.id) },
    });

    await prisma.$executeRawUnsafe(`DROP USER ${funcionario?.dsfuncionario}`);

    await prisma.funcionario.delete({
      where: { idfuncionario: Number(params.id) },
    });

    retorno = { status: 200, data: funcionario };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}
