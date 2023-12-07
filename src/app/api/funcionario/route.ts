import { TFuncionarioZod, TProduto, TProdutoZod } from '@/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    const funcionarios = await prisma.funcionario.findMany({
      select: {
        idfuncionario: true,
        dsfuncionario: true,
        dsfuncao: true,
        nrcpf: true,
      },
      orderBy: {
        idfuncionario: 'asc',
      },
    });

    retorno = { status: 200, data: funcionarios };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}

export async function POST(request: NextRequest) {
  const data: TFuncionarioZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  let retorno;

  try {
    await prisma.$executeRawUnsafe(
      `CREATE USER ${data.dsfuncionario} PASSWORD '${data.dssenha}';`
    );

    await prisma.$executeRawUnsafe(
      `GRANT ${data.dsfuncao} TO ${data.dsfuncionario};`
    );

    const funcionarios = await prisma.funcionario.create({
      data: {
        dsfuncao: data.dsfuncao,
        dsfuncionario: data.dsfuncionario,
        dssenha: data.dssenha,
        nrcpf: data.nrcpf,
      },
    });

    retorno = { status: 200, data: funcionarios };
  } catch (e) {
    retorno = { status: 400, data: null };
  } finally {
    prisma.$disconnect();

    return NextResponse.json(retorno);
  }
}
