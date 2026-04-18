import { queryOptions } from '@tanstack/react-query';
import { $api } from '@/shared/api/http';
import type { Appointment } from '@/entities/appointment/types';

export const appointmentQueryKey = {
  list: 'appointment.list',
  byId: 'appointment.byId',
};

export const appointmentQueries = {
  list: (params?: { user_id?: string }) =>
    queryOptions<Appointment[]>({
      queryKey: [appointmentQueryKey.list, params],
      queryFn: async () => (await $api.get('/appointments/', { params })).data,
    }),

  byId: (id: string) =>
    queryOptions<Appointment>({
      queryKey:[appointmentQueryKey.byId, id],
      queryFn: async () => (await $api.get(`/appointments/${id}`)).data,
      enabled: !!id,
    }),
};

export const cancelAppointment = async (id: string, cancelReason: string): Promise<void> => {
  await $api.put(`/appointments/${id}/cancel`, { cancel_reason: cancelReason });
};

export const completeAppointment = async (id: string, comment: string): Promise<Appointment> => {
  const { data } = await $api.put(`/appointments/${id}/complete`, { comment });
  return data;
};

export const createAppointment = async (body: {
  application_id?: string;
  patient_id: string;
  psychologist_id: string;
  type: 'Offline' | 'Online';
  scheduled_time: string;
  reason?: string;
  remind_time?: string;
  venue?: string;
  comment?: string;
}): Promise<Appointment> => {
  const { data } = await $api.post<Appointment>('/appointments/create', body);
  return data;
};