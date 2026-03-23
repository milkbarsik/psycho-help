import React from 'react';
import type { FC } from 'react';
import { createPortal } from 'react-dom';
import ModalRegistration from './modal-registration';
import ModalLogin from './modal-login';
import ModalForgotPassword from './modal-forgot-password';
import ModalChangePassword from './modal-change-password';

interface ModalWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalWindow: FC<ModalWindowProps> = ({ isOpen, onClose }) => {
  const [modalWindow, setModalWindow] = React.useState<string>('log');

  React.useEffect(() => {
    if (isOpen) {
      setModalWindow('log');
    }
  }, [isOpen]);

  const handleSetModalOpen = (open: boolean) => {
    if (!open) onClose();
  };

  const renderContent = () => {
    if (modalWindow === 'log') {
      return (
        <ModalLogin setWindow={setModalWindow} isOpen={isOpen} setModalOpen={handleSetModalOpen} />
      );
    }
    if (modalWindow === 'reg') {
      return (
        <ModalRegistration
          setWindow={setModalWindow}
          isOpen={isOpen}
          setModalOpen={handleSetModalOpen}
        />
      );
    }
    if (modalWindow === 'forgot') {
      return (
        <ModalForgotPassword
          setWindow={setModalWindow}
          isOpen={isOpen}
          setModalOpen={handleSetModalOpen}
        />
      );
    }
    if (modalWindow === 'change') {
      return (
        <ModalChangePassword
          setWindow={setModalWindow}
          isOpen={isOpen}
          setModalOpen={handleSetModalOpen}
        />
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return createPortal(renderContent(), document.body);
};

export default ModalWindow;
