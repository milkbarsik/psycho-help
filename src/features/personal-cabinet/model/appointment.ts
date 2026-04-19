import { create } from 'zustand';
import type { Appointment } from '@/entities/appointment/types';

interface IAppointment {
  appointment: Partial<Appointment>;
  setAppointment: (patch: Partial<Appointment>) => void;
}

export const useAppointment = create<IAppointment>((set) => ({
  appointment: {
    psychologist_id: 'default',
    type: 'Online',
    reason: '',
    scheduled_time: '',
    remind_time: null,
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
