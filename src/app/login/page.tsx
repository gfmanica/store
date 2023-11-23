'use client';

import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { useRef, useState } from 'react';

export default function Login() {
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <Card className="w-[600px]">
      <CardBody className="flex flex-col gap-4 p-6">
        <p className="font-semibold text-2xl mb-2">Fazer login</p>

        <Input label="Usuário" value={user} onValueChange={setUser} />

        <Input
          type="password"
          label="Senha"
          value={password}
          onValueChange={setPassword}
        />

        <Button color="primary" variant="shadow" className="mt-6">
          Entrar
        </Button>
      </CardBody>
    </Card>
  );
}
