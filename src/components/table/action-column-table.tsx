import { Spinner, Tooltip, useDisclosure } from '@nextui-org/react';
import React from 'react';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import ConfirmModal from '../modals/confirm-modal';
import Link from 'next/link';

type TActionColumnTable = {
  callbackConfirm: () => void;
  href: string;
};

export default function ActionColumnTable({
  callbackConfirm,
  href,
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
        <Link href={href}>
          <Tooltip placement="left" content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <MdOutlineEdit size={22} />
            </span>
          </Tooltip>
        </Link>

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
