import { type QueryObserverOptions, queryOptions } from '@tanstack/react-query';
import type { ResponseError } from '@/shared/api';
import type { User } from '../types';
import { authApi } from '@/entities/auth/api/api.ts';

export const authQueryKey = {
  user: 'auth.user',
  userById: 'auth.userById',
};

export const authQueries = {
  getUser: (options?: Partial<QueryObserverOptions<User, ResponseError>>) =>
    queryOptions<User, ResponseError>({
      queryKey: [authQueryKey.user],
      queryFn: authApi.getUser,
      ...options,
    }),

  getUserById: (id: string) =>
    queryOptions<User, ResponseError>({
      queryKey: [authQueryKey.userById, id],
      queryFn: () => authApi.getUserById(id),
      enabled: !!id,
    }),
};
