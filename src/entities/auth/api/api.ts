import type { LoginData, RegistrationData, User } from '@/entities/auth';
import { $api } from '@/shared/api/http.ts';

export const authApi = {
  login: async (data: LoginData): Promise<User> => {
    return (await $api.post<User>('/users/login', data)).data;
  },

  registration: async (data: RegistrationData): Promise<User> => {
    return (await $api.post<User>('/users/register', data)).data;
  },

  logout: async (): Promise<void> => {
    return (await $api.post('/users/logout')).data;
  },

  getUser: async (): Promise<User> => {
    return (await $api.get('/users/user')).data;
  },
};
