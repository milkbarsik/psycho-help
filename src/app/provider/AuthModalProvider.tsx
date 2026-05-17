import { createPortal } from 'react-dom';
import { useAppContext } from '@/app/context';
import ModalLogin from '@/features/auth/modal/modal-login';
import ModalRegistration from '@/features/auth/modal/modal-registration';
import ModalForgotPassword from '@/features/auth/modal/modal-forgot-password';
import ModalChangePassword from '@/features/auth/modal/modal-change-password';

export const AuthModalProvider = () => {
  const { authModal, closeAuthModal, openAuthModal } = useAppContext();

  if (!authModal.type) return null;

  const commonProps = {
    isOpen: true,
    setModalOpen: closeAuthModal,
    setWindow: (type: 'log' | 'reg' | 'forgot' | 'change') => openAuthModal(type),
    redirectPath: authModal.redirectPath,
    appointmentType: authModal.appointmentType,
  };

  const renderModalContent = () => {
    switch (authModal.type) {
      case 'log':
        return <ModalLogin {...commonProps} />;
      case 'reg':
        return <ModalRegistration {...commonProps} />;
      case 'forgot':
        return <ModalForgotPassword {...commonProps} />;
      case 'change':
        return <ModalChangePassword {...commonProps} />;
      default:
        return null;
    }
  };

  return createPortal(renderModalContent(), document.body);
};