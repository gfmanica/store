import { NextResponse } from 'next/server';
import { promisify } from 'util';
const { exec } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

export async function GET() {
  const executeAsync = promisify(exec);
  const date = new Date();
  const currentDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  const fileName = `backup-${currentDate}.sql`;
  const command = `pg_dump -v -d postgresql://postgres:12345678@localhost:5432/taste-horizon -f backups/${fileName}`;

  await executeAsync(command);

  return NextResponse.json({
    status: 200,
    data: `Backup do banco realizado com sucesso! Arquivo: ${fileName}`,
  });
}
