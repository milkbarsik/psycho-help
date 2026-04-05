import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useAuth } from '@/features/auth/api/useAuth';
import { useFetch } from '@/shared/api/useFetch';
import { AppContext } from './';
import type { ModalWindowType } from './';

interface IProps {
  children: ReactElement;
}

interface IAuthModalState {
  type: ModalWindowType;
  redirectPath?: string;
  appointmentType?: string;
}

export const AppContextProvider = ({ children }: IProps) => {
  const [isAppLoading, setAppLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [authModal, setAuthModal] = useState<IAuthModalState>({
    type: null,
  });

  const { getUser } = useAuth();

  const { fetching, error } = useFetch(async () => {
    try {
      setAppLoading(true);
      await getUser();
    } catch (error) {
      setIsError(true);
    } finally {
      setAppLoading(false);
    }
  });

  useEffect(() => {
    fetching();
  }, []);

  const openAuthModal = (
    type: ModalWindowType,
    redirectPath?: string,
    appointmentType?: string
  ) => {
    setAuthModal({ type, redirectPath, appointmentType });
  };

  const closeAuthModal = () => {
    setAuthModal({ type: null });
  };

  const memoizedValues = useMemo(
    () => ({
      isError,
      isAppLoading,
      error: error?.message,
      setAppLoading,

      authModal,
      openAuthModal,
      closeAuthModal,
    }),
    [error, isAppLoading, isError, authModal]
  );

  return <AppContext.Provider value={memoizedValues}>{children}</AppContext.Provider>;
};