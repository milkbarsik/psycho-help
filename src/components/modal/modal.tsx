import React, { FC } from 'react';
import ModalRegistration from './modal-registration';
import styles from './modal.module.css';
import ModalLogin from './modal-login';
import LoginIcon from '@/assets/images/login-icon.svg';
const ModalWindow: FC = () => {
  const [modalWindow, setModalWindow] = React.useState<string>('log');
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);

  /*Здесь идет чередование модальных окон регистрации и логина по клику в модалке,
   функция только в том случае, если модальное окно открыто */
  const render = (window: string) => {
    if (window === 'log') {
      return <ModalLogin setWindow={setModalWindow} isOpen setModalOpen={setModalOpen} />; // Здесь передаются функции двум модалкам, чтобы уже они "передавили" этому компоненту действия пользователя
    }
    if (window === 'reg') {
      return <ModalRegistration setWindow={setModalWindow} isOpen setModalOpen={setModalOpen} />;
    }
  };

  return (
    <div className={styles.buttonWrapper}>
      <button className={styles.button} onClick={() => setModalOpen(!isModalOpen)}>
        <img src={LoginIcon} alt="Иконка входа" />
      </button>
      {isModalOpen && render(modalWindow)}
    </div>
  );
};

export default ModalWindow;
