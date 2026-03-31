import React from 'react';
import type { FC } from 'react';
import { createPortal } from 'react-dom';
import ModalRegistration from './modal-registration';
import styles from './modal.module.css';
import ModalLogin from './modal-login';
import ModalForgotPassword from './modal-forgot-password';
import ModalChangePassword from './modal-change-password';
import Auth from './icons/Auth.svg?react';

type ModalWindowType = 'log' | 'reg' | 'forgot' | 'change';

interface ModalWindowProps {
  onMenuClose?: () => void;
  redirectPath?: string;
  appointmentType?: string;
}

const ModalWindow: FC<ModalWindowProps> = ({ onMenuClose, redirectPath, appointmentType }) => {
  const [modalWindow, setModalWindow] = React.useState<ModalWindowType>('log');
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);

  const openAuthModal = () => {
    setModalWindow('log');
    setModalOpen(true);
  };

  const closeAuthModal = () => {
    setModalOpen(false);
    setModalWindow('log');
  };

  /*Здесь идет чередование модальных окон регистрации и логина по клику в модалке,
   функция только в том случае, если модальное окно открыто */
  const render = (window: ModalWindowType) => {
    if (window === 'log') {
      return (
        <ModalLogin setWindow={setModalWindow} isOpen={isModalOpen} setModalOpen={setModalOpen} />
      );
    }
    if (window === 'reg') {
      return (
        <ModalRegistration
          setWindow={setModalWindow}
          isOpen={isModalOpen}
          setModalOpen={setModalOpen}
        />
      );
    }
    if (window === 'forgot') {
      return (
        <ModalForgotPassword
          setWindow={setModalWindow}
          isOpen={isModalOpen}
          setModalOpen={setModalOpen}
        />
      );
    }
    if (window === 'change') {
      return (
        <ModalChangePassword
          setWindow={setModalWindow}
          isOpen={isModalOpen}
          setModalOpen={setModalOpen}
        />
      );
    }
    return null;
  };

  // Закрываем бургер-меню при открытии модалки
  const handleButtonClick = () => {
    if (onMenuClose) {
      onMenuClose();
    }
    if (isModalOpen) {
      closeAuthModal();
    } else {
      openAuthModal();
    }
  };

  return (
    <div className={styles.buttonWrapper}>
      <button
        className={styles.button}
        onClick={handleButtonClick}
        aria-label="Открыть окно входа"
      >
        <Auth />
        <span>Войти</span>
      </button>
      {isModalOpen ? createPortal(render(modalWindow), document.body) : null}
    </div>
  );
};

export default ModalWindow;