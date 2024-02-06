import { useState } from "react";

interface LoginModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useLoginModal = (): LoginModalStore => {
  const [isOpen, setIsOpen] = useState(false);
  
  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return { isOpen, onOpen, onClose };
};
