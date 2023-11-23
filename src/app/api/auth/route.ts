import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get('user');
  const password = searchParams.get('password');

  const prisma = new PrismaClient({
    datasourceUrl: `postgres://${user}:${password}@ep-twilight-scene-54661059-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15`,
  });

  // const a = await prisma.$connect();

  return NextResponse.json('teste conexao');
}
