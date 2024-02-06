import { useContext } from "react";
import Modal from "./Modal";
import { AppContext } from "../../context/AppContext";

const LoginModal = () => {
  const { isOpenLoginModal, onCloseLoginModal } = useContext(AppContext);

  return <Modal isOpen={isOpenLoginModal} onClose={onCloseLoginModal} />;
};

export default LoginModal;
