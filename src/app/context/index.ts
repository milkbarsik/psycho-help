import { createContext, useContext } from 'react';

export type ModalWindowType = 'log' | 'reg' | 'forgot' | 'change';

export interface IAppContext {
  isAppLoading: boolean;
  isError?: boolean;
  error?: string;
  setAppLoading: (val: boolean) => void;
  
  isAuthModalOpen: boolean;
  openAuthModal: (redirectPath?: string, appointmentType?: string) => void;
  closeAuthModal: () => void;
  authModalRedirectPath?: string;
  authModalAppointmentType?: string;
  modalWindow: ModalWindowType;
  setModalWindow: (window: ModalWindowType) => void;
}

export const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext должен использоваться внутри AppContextProvider');
  }
  return context;
};