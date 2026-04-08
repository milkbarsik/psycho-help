import { type QueryObserverOptions, queryOptions } from '@tanstack/react-query';
import { $api } from '@/shared/api/http.ts';
import type { ResponseError } from '@/shared/api';
import type { Appointment } from '@/entities/appointment/types';

export const appointmentQueryKey = {
  list: 'appointment.list',
  byId: 'appointment.byId',
};

export const appointmentQueries = {
  list: (options?: Partial<QueryObserverOptions<Appointment[], ResponseError>>) =>
    queryOptions<Appointment[], ResponseError>({
      queryKey: [appointmentQueryKey.list],
      queryFn: async () => (await $api.get('/appointments/')).data,
      ...options,
    }),
};

export const confirmAppointment = async (id: string): Promise<Appointment> => {
  const { data } = await $api.put(`/appointments/${id}/confirm`);
  return data;
};
