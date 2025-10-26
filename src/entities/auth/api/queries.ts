import { type QueryObserverOptions, queryOptions } from '@tanstack/react-query';
import { $serviceClient } from '@/shared/api/http';
import type { ResponseError } from '@/shared/api';
import type { User, RegistrationData, LoginData } from '../types';

export const authQueryKey = {
  user: 'auth.user',
};

export const authQueries = {
  getUser: (options?: Partial<QueryObserverOptions<User, ResponseError>>) =>
    queryOptions<User, ResponseError>({
      queryKey: [authQueryKey.user],
      queryFn: async () => {
        const res = await $serviceClient.get<User>('/users/user');
        return res.data;
      },
      ...options,
    }),
};

export const authApi = {
  login: async (data: LoginData): Promise<User> => {
    const res = await $serviceClient.post<User>('/users/login', data);
    return res.data;
  },

  registration: async (data: RegistrationData): Promise<User> => {
    const res = await $serviceClient.post<User>('/users/register', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await $serviceClient.post('/users/logout');
  },
};
