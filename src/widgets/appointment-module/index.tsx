import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Personally from '@/features/home/ui/personally.svg?react';
import Online from '@/features/home/ui/online.svg?react';
import { useAuth } from '@/features/auth/api/useAuth';
import { useAppContext } from '@/app/context';
import styles from './styles/appointment-module.module.css';

type AppointmentType = 'personally' | 'online' | null;

interface AppointmentModuleProps {
  className?: string;
  redirectPath?: string;
  onTypeSelect?: (type: AppointmentType) => void;
}

const AppointmentModule = ({
  className = '',
  redirectPath = '/cabinet',
  onTypeSelect,
}: AppointmentModuleProps) => {
  const [selectedType, setSelectedType] = useState<AppointmentType>(null);
  
  const navigate = useNavigate();
  const isAuth = useAuth((state) => state.isAuth);
  const { setAppLoading, openAuthModal } = useAppContext();

  const handleTypeSelect = (type: 'personally' | 'online') => {
    setSelectedType(type);
    onTypeSelect?.(type);
  };

  const handleAppointment = async () => {
    if (!selectedType) {
      alert('Пожалуйста, выберите тип записи');
      return;
    }

    if (isAuth) {
      setAppLoading(true);
      try {
        navigate(redirectPath);
      } finally {
        setAppLoading(false);
      }
    } else {
      openAuthModal('reg', redirectPath, selectedType);
    }
  };

  return (
    <div className={`${styles.greeting__controls} ${className}`}>
      <div className={styles.greeting__options}>
        <button
          type="button"
          className={`${styles.greeting__option} ${
            selectedType === 'personally' ? styles.greeting__option_active : ''
          }`}
          onClick={() => handleTypeSelect('personally')}
          aria-pressed={selectedType === 'personally'}
        >
          <Personally className={styles.greeting__option_icon} />
          <span className={styles.greeting__option_text}>очно</span>
        </button>

        <button
          type="button"
          className={`${styles.greeting__option} ${
            selectedType === 'online' ? styles.greeting__option_active : ''
          }`}
          onClick={() => handleTypeSelect('online')}
          aria-pressed={selectedType === 'online'}
        >
          <Online className={styles.greeting__option_icon} />
          <span className={styles.greeting__option_text}>онлайн</span>
        </button>
      </div>

      <button
        type="button"
        className={`${styles.greeting__submit} ${
          !selectedType ? styles.greeting__submit_disabled : ''
        }`}
        onClick={handleAppointment}
        disabled={!selectedType}
      >
        Записаться
      </button>
    </div>
  );
};

export default AppointmentModule;