import type { FC } from 'react';
import { useAppContext } from '@/app/context';
import AuthIcon from './icons/Auth.svg?react';
import styles from './modal.module.css';

interface ModalWindowProps {
  onMenuClose?: () => void;
}

const ModalWindow: FC<ModalWindowProps> = ({ onMenuClose }) => {
  const { openAuthModal } = useAppContext();

  const handleButtonClick = () => {
    if (onMenuClose) {
      onMenuClose();
    }

    openAuthModal('log');
  };

  return (
    <div className={styles.buttonWrapper}>
      <button
        className={styles.button}
        onClick={handleButtonClick}
        aria-label="Открыть окно входа"
      >
        <AuthIcon />
        <span>Войти</span>
      </button>
    </div>
  );
};

export default ModalWindow;