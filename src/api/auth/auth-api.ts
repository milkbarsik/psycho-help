import { AxiosResponse } from 'axios';
import { $serviceClient } from '../http';
import { user, regData, authRes } from '../types';

export default class AuthApi {
  static async login(email: string, password: string): Promise<AxiosResponse<authRes>> {
    return await $serviceClient.post<authRes>('/users/login', { email, password });
  }

  static async registration(data: regData): Promise<AxiosResponse<authRes>> {
    return await $serviceClient.post<authRes>('/users/register', { ...data });
  }

  static async getUser(): Promise<AxiosResponse<user>> {
    return await $serviceClient.get<user>('/users/user');
  }

  static async logOut(): Promise<AxiosResponse> {
    return await $serviceClient.post('/users/logout');
  }
}
