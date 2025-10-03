import { create } from 'zustand';

export type TAppointment = {
  therapist_id: string;
  type: 'Online' | 'Offline';
  reason: string;
  date: string;
  time: string;
  venue: string;
};

interface IAppointment {
  appointment: TAppointment;
  setAppointment: (patch: Partial<TAppointment>) => void;
}

export const useAppointment = create<IAppointment>((set) => ({
  appointment: {
    therapist_id: 'default',
    type: 'Online',
    reason: '',
    date: '',
    time: '10:30',
    venue: '',
  },
  setAppointment: (patch) =>
    set((state) => ({
      appointment: {
        ...state.appointment,
        ...patch,
      },
    })),
}));
