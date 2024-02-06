import { useState } from "react";

interface RegisterModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useLoginModal = (): RegisterModalStore => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return { isOpen, onOpen, onClose };
};
