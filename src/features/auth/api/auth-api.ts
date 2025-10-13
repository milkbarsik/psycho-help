import type { AxiosResponse } from 'axios';
import { $serviceClient } from '@/shared/api/http';
import type { User, regData } from '@/shared/api/types';

export default class AuthApi {
  static async login(email: string, password: string): Promise<AxiosResponse<User>> {
    const res = await $serviceClient.post<User>('/users/login', { email, password });
    return res;
  }

  static async registration(data: regData): Promise<AxiosResponse<User>> {
    const res = await $serviceClient.post<User>('/users/register', { ...data });
    return res;
  }

  static async getUser(): Promise<AxiosResponse<User>> {
    const res = await $serviceClient.get<User>('/users/user');
    return res;
  }

  static async logOut(): Promise<AxiosResponse> {
    const res = await $serviceClient.post('/users/logout');
    return res;
  }
}
