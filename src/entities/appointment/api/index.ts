import { queryOptions } from '@tanstack/react-query';
import { $api } from '@/shared/api/http.ts';
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
      queryKey: [appointmentQueryKey.byId, id],
      queryFn: async () => (await $api.get(`/appointments/${id}`)).data,
      enabled: !!id,
    }),
};

export const cancelAppointment = async (id: string): Promise<void> => {
  await $api.put(`/appointments/${id}/cancel`);
};

export const completeAppointment = async (id: string, comment: string): Promise<Appointment> => {
  const { data } = await $api.put(`/appointments/${id}/complete`, { comment });
  return data;
};
