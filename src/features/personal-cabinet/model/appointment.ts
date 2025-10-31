import { create } from 'zustand';
import type { Appointment } from '@/entities/appointment/types';
import { EAppointmentType } from '@/entities/appointment/enums';

interface IAppointment {
  appointment: Appointment;
  setAppointment: (patch: Partial<Appointment>) => void;
}

export const useAppointment = create<IAppointment>((set) => ({
  appointment: {
    therapist_id: 'default',
    type: EAppointmentType.ONLINE,
    reason: '',
    date: '',
    remind_time: '',
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
