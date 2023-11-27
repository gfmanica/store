'use client';

import { useAuthContext } from '@/contexts/auth-context';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalContent,
} from '@nextui-org/react';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

export default function LoginModal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    password,
    setPassword,
    setUser,
    user,
    validateDBConnection,
    isOpen,
    onClose,
  } = useAuthContext();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      isDismissable={false}
      className="items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <Card className="w-[80%] md:w-[600px]">
              <CardBody className="flex flex-col gap-4 p-6">
                <p className="font-semibold text-2xl mb-2">Login</p>

                <Input label="Usuário" value={user} onValueChange={setUser} />

                <Input
                  type="password"
                  label="Senha"
                  value={password}
                  onValueChange={setPassword}
                />

                <Button
                  color="primary"
                  variant="shadow"
                  className="mt-6 font-semibold"
                  isLoading={isLoading}
                  onClick={() => {
                    setIsLoading(true);

                    validateDBConnection()
                      .then(onClose)
                      .finally(() => setIsLoading(false));
                  }}
                >
                  Entrar
                </Button>
              </CardBody>
            </Card>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
