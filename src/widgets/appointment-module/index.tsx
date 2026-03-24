import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Personally from '@/features/home/ui/personally.svg?react';
import Online from '@/features/home/ui/online.svg?react';
import { useAuth } from '@/features/auth/api/useAuth';
import { useAppContext } from '@/app/context';
import styles from './styles/appointment-module.module.css';

import ModalLogin from '@/features/auth/modal/modal-login';
import ModalRegistration from '@/features/auth/modal/modal-registration';
import ModalForgotPassword from '@/features/auth/modal/modal-forgot-password';
import ModalChangePassword from '@/features/auth/modal/modal-change-password';

type AppointmentType = 'personally' | 'online' | null;

interface AppointmentModuleProps {
  pageType?: 'main' | 'service' | 'contact';
  className?: string;
  redirectPath?: string;
  onTypeSelect?: (type: AppointmentType) => void;
}

const AppointmentModule = ({
  pageType = 'main',
  className = '',
  redirectPath = '/cabinet',
  onTypeSelect,
}: AppointmentModuleProps) => {
  const [selectedType, setSelectedType] = useState<AppointmentType>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalWindow, setModalWindow] = useState<string>('log');

  const navigate = useNavigate();
  const isAuth = useAuth((state) => state.isAuth);
  const { setAppLoading } = useAppContext();

  // Логика отрисовки конкретного окна (как в ModalWindow)
  const renderModal = (window: string) => {
    const props = {
      setWindow: setModalWindow,
      isOpen: isModalOpen,
      setModalOpen: setModalOpen,
    };

    switch (window) {
      case 'log':
        return <ModalLogin {...props} />;
      case 'reg':
        return <ModalRegistration {...props} />;
      case 'forgot':
        return <ModalForgotPassword {...props} />;
      case 'change':
        return <ModalChangePassword {...props} />;
      default:
        return null;
    }
  };

  const handleTypeSelect = (type: 'personally' | 'online') => {
    setSelectedType(type);
    onTypeSelect?.(type);
  };

  const handleAppointment = async () => {
    if (!selectedType) {
      alert('Пожалуйста, выберите тип записи');
      return;
    }

    sessionStorage.setItem('appointmentType', selectedType);
    sessionStorage.setItem('redirectAfterAuth', redirectPath);

    if (isAuth) {
      setAppLoading(true);
      try {
        navigate(redirectPath);
      } finally {
        setAppLoading(false);
      }
    } else {
      setModalWindow('log');
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className={`${styles.greeting__controls} ${styles[`page-${pageType}`]} ${className}`}>
        <div className={styles.greeting__options}>
          <button
            className={`${styles.greeting__option} ${selectedType === 'personally' ? styles.greeting__option_active : ''}`}
            onClick={() => handleTypeSelect('personally')}
            aria-pressed={selectedType === 'personally'}
          >
            <Personally className={styles.greeting__option_icon} />
            <span className={styles.greeting__option_text}>очно</span>
          </button>
          <button
            className={`${styles.greeting__option} ${selectedType === 'online' ? styles.greeting__option_active : ''}`}
            onClick={() => handleTypeSelect('online')}
            aria-pressed={selectedType === 'online'}
          >
            <Online className={styles.greeting__option_icon} />
            <span className={styles.greeting__option_text}>онлайн</span>
          </button>
        </div>
        <button
          className={`${styles.greeting__submit} ${!selectedType ? styles.greeting__submit_disabled : ''}`}
          onClick={handleAppointment}
          disabled={!selectedType}
        >
          Записаться
        </button>
      </div>

      {isModalOpen ? createPortal(renderModal(modalWindow), document.body) : null}
    </>
  );
};

export default AppointmentModule;