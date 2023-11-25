import { TConnection } from '@/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { headers } = request;
  const user = headers.get('user');
  const password = headers.get('password');

  const prisma = new PrismaClient({
    datasourceUrl: `postgres://${user}:${password}@ep-twilight-scene-54661059-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15`,
  });

  let connectionReturn: TConnection;

  try {
    await prisma.$connect();
    connectionReturn = { status: 200, message: 'Usuário validado com sucesso' };
  } catch (error) {
    console.log(error);
    connectionReturn = { status: 401, message: 'Usuário ou senha incorretas' };
  } finally {
    prisma.$disconnect();
  }

  return NextResponse.json(connectionReturn);
}
