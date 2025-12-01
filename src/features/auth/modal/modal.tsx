import React from 'react';
import type { FC } from 'react';
import ModalRegistration from './modal-registration';
import styles from './modal.module.css';
import ModalLogin from './modal-login';
import ModalForgotPassword from './modal-forgot-password';
import ModalChangePassword from './modal-change-password';
import Auth from './icons/Auth.svg?react';
const ModalWindow: FC = () => {
  const [modalWindow, setModalWindow] = React.useState<string>('log');
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);

  /*Здесь идет чередование модальных окон регистрации и логина по клику в модалке,
   функция только в том случае, если модальное окно открыто */
  const render = (window: string) => {
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

  return (
    <div className={styles.buttonWrapper}>
      <button
        className={styles.button}
        onClick={() => setModalOpen(!isModalOpen)}
        aria-label="Открыть окно входа"
      >
        <Auth />
        <span>Войти</span>
      </button>
      {isModalOpen && render(modalWindow)}
    </div>
  );
};

export default ModalWindow;
