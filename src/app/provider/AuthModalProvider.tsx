import { useAppContext } from '@/app/context';
import ModalLogin from '@/features/auth/modal/modal-login';

export const AuthModalProvider = () => {
  const { isAuthModalOpen, closeAuthModal, setModalWindow } = useAppContext();

  if (!isAuthModalOpen) return null;

  return (
    <ModalLogin setWindow={setModalWindow} isOpen={isAuthModalOpen} setModalOpen={closeAuthModal} />
  );
};
