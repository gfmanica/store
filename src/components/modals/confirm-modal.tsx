import React, { ReactNode } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

type TConfirmModal = {
  isOpen: boolean;
  onOpenChange: () => void;
  callbackConfirm: () => void;
  bodyContent?: string | ReactNode;
  labelConfirm?: string;
  labelTitle?: string;
};

export default function ConfirmModal({
  isOpen,
  onOpenChange,
  callbackConfirm,
  bodyContent,
  labelConfirm,
  labelTitle,
}: TConfirmModal) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {labelTitle || 'Confirmação'}
            </ModalHeader>

            <ModalBody>
              {bodyContent || 'Tem certeza que deseja excluir o registro?'}
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="font-semibold"
              >
                Fechar
              </Button>

              <Button
                color="primary"
                onPress={() => {
                  onClose();

                  callbackConfirm();
                }}
                className="font-semibold"
              >
                {labelConfirm || 'Excluir'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
