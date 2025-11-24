import { $serviceClient } from './http';
import type { AxiosResponse } from 'axios';
import type { GetAppointment, Therapist } from './types';

export default class ServiceApi {
  static async getTherapists(): Promise<AxiosResponse<Array<Therapist>>> {
    const res = await $serviceClient.get<Array<Therapist>>('/therapists/');
    return res;
  }

  static async getTherapist(id: string): Promise<AxiosResponse<Therapist>> {
    const res = await $serviceClient.get<Therapist>(`/therapists/${id}`);
    return res;
  }

  static async getAppointments(id?: string): Promise<AxiosResponse<GetAppointment[]>> {
    if (id) {
      const res = await $serviceClient.get<GetAppointment[]>('/appointments/', {
        params: { user_id: id },
      });
      return res;
    }

    const res = await $serviceClient.get<GetAppointment[]>('/appointments/');
    return res;
  }
}
