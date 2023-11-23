export function money(value: string) {
  return Number(value).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function localeDate(value: string) {
  return new Date(value).toLocaleString('pt-Br');
}
