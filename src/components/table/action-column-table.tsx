import { Tooltip, useDisclosure } from '@nextui-org/react';
import React from 'react';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import ConfirmModal from '../modals/confirm-modal';

type TActionColumnTable = {
  callbackConfirm: () => void;
};

export default function ActionColumnTable({
  callbackConfirm,
}: TActionColumnTable) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <ConfirmModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        callbackConfirm={callbackConfirm}
      />

      <div className="relative flex items-center gap-2">
        <Tooltip placement="left" content="Edit user">
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <MdOutlineEdit size={22} />
          </span>
        </Tooltip>

        <Tooltip placement="right" color="danger" content="Delete user">
          <span
            className="text-lg text-danger cursor-pointer active:opacity-50"
            onClick={onOpen}
          >
            <MdOutlineDelete size={22} />
          </span>
        </Tooltip>
      </div>
    </>
  );
}
