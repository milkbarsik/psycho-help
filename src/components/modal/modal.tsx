import React, { FC } from 'react';
import ModalRegistration from './modal-registration';
import { Button } from 'antd';
import ModalLogin from './modal-login';

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
    <div>
      <Button type="primary" onClick={() => setModalOpen(!isModalOpen)}>
        Войти
      </Button>
      {isModalOpen && render(modalWindow)}
    </div>
  );
};

export default ModalWindow;
