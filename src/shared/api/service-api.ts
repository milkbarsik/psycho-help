import { $serviceClient } from './http';
import { AxiosResponse } from 'axios';
import { GetAppointment, therapist } from './types';

export default class ServiceApi {
  static async getTherapists(): Promise<AxiosResponse<Array<therapist>>> {
    const res = await $serviceClient.get<Array<therapist>>('/therapists/');
    return res;
  }

	static async getTherapist (id: string): Promise<AxiosResponse<therapist>> {
		const res = await $serviceClient.get<therapist>(`/therapists/${id}`);
		return res;
	}

	static async getAppointments (id?: string): Promise<AxiosResponse<GetAppointment[]>> {
		if (id) {
			const res = await $serviceClient.get<GetAppointment[]>('/appointments/', {params: {user_id: id}})
			return res;
		}

		const res = await $serviceClient.get<GetAppointment[]>('/appointments/')
		return res;
	}
}
