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
  const [authModalRedirectPath, setAuthModalRedirectPath] = useState<string>();
  const [authModalAppointmentType, setAuthModalAppointmentType] = useState<string>();
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

  const openAuthModal = (redirectPath?: string, appointmentType?: string) => {
    setAuthModalRedirectPath(redirectPath);
    setAuthModalAppointmentType(appointmentType);
    setModalWindow('log');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalRedirectPath(undefined);
    setAuthModalAppointmentType(undefined);
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
      authModalRedirectPath,
      authModalAppointmentType,
      modalWindow,
      setModalWindow,
    }),
    [
      error,
      isAppLoading,
      isError,
      isAuthModalOpen,
      authModalRedirectPath,
      authModalAppointmentType,
      modalWindow,
    ],
  );

  return <AppContext.Provider value={memoizedValues}>{children}</AppContext.Provider>;
};
