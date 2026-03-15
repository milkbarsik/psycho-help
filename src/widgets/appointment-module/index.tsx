import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Personally from '@/features/home/ui/personally.svg?react';
import Online from '@/features/home/ui/online.svg?react';
import { useAuth } from '@/features/auth/api/useAuth';
import { useAppContext } from '@/app/context';
import styles from './styles/appointment-module.module.css';
import ModalLogin from '@/features/auth/modal/modal-login';

type AppointmentType = 'personally' | 'online' | null;
type ModalWindow = 'log' | 'reg' | 'forgot' | 'change';

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
  const [modalWindow, setModalWindow] = useState<ModalWindow>('log');

  const navigate = useNavigate();
  const isAuth = useAuth((state) => state.isAuth);
  const { setAppLoading } = useAppContext();

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

  const handleModalClose = (isOpen: boolean) => {
    setModalOpen(isOpen);
    if (!isOpen) {
      setModalWindow('log');
    }
  };

  const handleModalWindowChange = (window: ModalWindow | string) => {
    if (window === 'log' || window === 'reg' || window === 'forgot' || window === 'change') {
      setModalWindow(window);
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

      {isModalOpen && (
        <ModalLogin
          setWindow={handleModalWindowChange}
          isOpen={isModalOpen}
          setModalOpen={handleModalClose}
        />
      )}
    </>
  );
};

export default AppointmentModule;
