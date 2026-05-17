import { createContext, useContext } from 'react';

export type ModalWindowType = 'log' | 'reg' | 'forgot' | 'change' | null;

interface IAuthModalState {
  type: ModalWindowType;
  redirectPath?: string;
  appointmentType?: string;
}

export interface IAppContext {
  isAppLoading: boolean;
  isError?: boolean;
  error?: string;
  setAppLoading: (val: boolean) => void;

  authModal: IAuthModalState;

  openAuthModal: (type: ModalWindowType, redirect?: string, appointment?: string) => void;
  closeAuthModal: () => void;
}

export const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext должен использоваться внутри AppContextProvider');
  }
  return context;
};
