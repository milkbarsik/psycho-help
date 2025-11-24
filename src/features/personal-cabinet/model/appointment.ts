import { create } from 'zustand';

export type Appointment = {
  therapist_id: string;
  type: 'Online' | 'Offline';
  reason: string;
  date: string;
  time: string;
  venue: string;
};

interface IAppointment {
  appointment: Appointment;
  setAppointment: (patch: Partial<Appointment>) => void;
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
