import { TFuncionarioZod, TProduto, TProdutoZod } from '@/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  const funcionarios = await prisma.funcionario.findMany({
    select: {
      idFuncionario: true,
      dsFuncionario: true,
      dsFuncao: true,
      nrCpf: true,
    },
  });

  prisma.$disconnect();

  return NextResponse.json(funcionarios);
}

export async function POST(request: NextRequest) {
  const data: TFuncionarioZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  try {
    console.log(
      `CREATE USER ${data.dsFuncionario} PASSWORD '${data.dsSenha}'; `
    );

    await prisma.$executeRawUnsafe(
      `CREATE USER ${data.dsFuncionario} PASSWORD '${data.dsSenha}';`
    );

    await prisma.$executeRawUnsafe(
      `GRANT ${data.dsFuncao} TO ${data.dsFuncionario};`
    );

    const produtos = await prisma.funcionario.create({
      data: {
        dsFuncao: data.dsFuncao,
        dsFuncionario: data.dsFuncionario,
        dsSenha: data.dsSenha,
        nrCpf: data.nrCpf,
      },
    });

    console.log(produtos);

    prisma.$disconnect();

    return NextResponse.json(produtos);
  } catch (e) {
    prisma.$disconnect();

    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest) {
  const data: TFuncionarioZod = await request.json();
  const { headers } = request;
  const datasourceUrl = headers.get('datasourceUrl') || '';

  const prisma = new PrismaClient({ datasourceUrl });

  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { idFuncionario: data.idFuncionario },
    });

    // await prisma.$executeRawUnsafe(
    //   `ALTER USER ${data.dsFuncionario} WITH PASSWORD '${data.dsSenha}'; `
    // );

    // console.log(`REVOKE ${funcionario?.dsFuncao} FROM ${data.dsFuncionario};`);

    // await prisma.$executeRawUnsafe(
    //   `REVOKE ${funcionario?.dsFuncao} FROM ${data.dsFuncionario};`
    // );

    // await prisma.$executeRawUnsafe(
    //   `GRANT ${data.dsFuncao} TO ${data.dsFuncionario}; `
    // );

    const produtos = await prisma.funcionario.update({
      where: { idFuncionario: data.idFuncionario },
      data: {
        dsFuncao: data.dsFuncao,
        dsFuncionario: data.dsFuncionario,
        dsSenha: data.dsSenha,
        nrCpf: data.nrCpf,
      },
    });

    prisma.$disconnect();

    return NextResponse.json(produtos);
  } catch (e) {
    prisma.$disconnect();

    return NextResponse.json({});
  }
}
