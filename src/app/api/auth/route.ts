import { TConnection } from '@/types';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { headers } = request;
  const user = headers.get('user');
  const password = headers.get('password');

  

  const prisma = new PrismaClient({
    datasourceUrl: `postgres://${user}:${password}@ep-divine-dew-61652658.us-east-2.aws.neon.tech/taste-horizon?sslmode=require`,
  });

  let connectionReturn: TConnection;

  try {
    await prisma.$connect();
    connectionReturn = { status: 200, message: 'Usuário validado com sucesso' };
  } catch (error) {
    connectionReturn = { status: 401, message: 'Usuário ou senha incorretas' };
  } finally {
    prisma.$disconnect();
  }

  return NextResponse.json(connectionReturn);
}
