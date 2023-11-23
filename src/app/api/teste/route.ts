import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient({
    datasourceUrl:
      'postgres://default:TlsU2k9IQRfu@ep-twilight-scene-54661059-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15',
  });

  const a = await prisma.fornecedor.findMany();

  return NextResponse.json(a);
}

export async function POST() {
  const prisma = new PrismaClient({
    datasourceUrl:
      'postgres://default:TlsU2k9IQRfu@ep-twilight-scene-54661059-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15',
  });

  const a = await prisma.fornecedor.create({
    data: { dsFornecedor: 'Magazine Luiza' },
  });

  const b = await prisma.fornecedor.findMany();

  return NextResponse.json(b);
}
