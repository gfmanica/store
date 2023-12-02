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
        idFuncionario: true,
        dsFuncionario: true,
        dsFuncao: true,
        nrCpf: true,
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
      `CREATE USER ${data.dsFuncionario} PASSWORD '${data.dsSenha}';`
    );

    await prisma.$executeRawUnsafe(
      `GRANT ${data.dsFuncao} TO ${data.dsFuncionario};`
    );

    const funcionarios = await prisma.funcionario.create({
      data: {
        dsFuncao: data.dsFuncao,
        dsFuncionario: data.dsFuncionario,
        dsSenha: data.dsSenha,
        nrCpf: data.nrCpf,
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
