import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useAuth } from '@/features/auth/api/useAuth';
import { useFetch } from '@/shared/api/useFetch';
import { AppContext } from './';
import type { ModalWindowType } from './';

interface IProps {
  children: ReactElement;
}

export const AppContextProvider = ({ children }: IProps) => {
  const [isAppLoading, setAppLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [modalWindow, setModalWindow] = useState<ModalWindowType>('log');

  const { getUser } = useAuth();

  const { fetching, error } = useFetch(async () => {
    try {
      setAppLoading(true);
      await getUser();
      setIsError(true);
    } finally {
      setAppLoading(false);
    }
  });

  useEffect(() => {
    fetching();
  }, []);

  const openAuthModal = () => {
    setModalWindow('log');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setModalWindow('log');
  };

  const memoizedValues = useMemo(
    () => ({
      isError,
      isAppLoading,
      error: error?.message,
      setAppLoading,

      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      modalWindow,
      setModalWindow,
    }),
    [error, isAppLoading, isError, isAuthModalOpen, modalWindow],
  );

  return <AppContext.Provider value={memoizedValues}>{children}</AppContext.Provider>;
};