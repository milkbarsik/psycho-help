import { type QueryObserverOptions, queryOptions } from '@tanstack/react-query';
import { $api } from '@/shared/api/http.ts';
import type { ResponseError, Therapist } from '@/shared/api';

export const therapistQueryKey = {
  list: 'therapist.list',
  byId: 'therapist.byId',
};

export const therapistQueries = {
  list: (options?: Partial<QueryObserverOptions<Therapist[], ResponseError>>) =>
    queryOptions<Therapist[], ResponseError>({
      queryKey: [therapistQueryKey.list],
      queryFn: () => $api.get('/therapists/'),
      ...options,
    }),

  byId: (id: string, options?: Partial<QueryObserverOptions<Therapist, ResponseError>>) =>
    queryOptions<Therapist, ResponseError>({
      queryKey: [therapistQueryKey.byId],
      queryFn: () => $api.get(`/therapists/${id}`),
      enabled: !!id,
      ...options,
    }),
};
