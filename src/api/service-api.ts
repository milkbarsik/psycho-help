import { $serviceClient } from './service-client';
import { AxiosResponse } from 'axios';
// import { DoctorsList, Pagination } from './types';

// export const serviceApi = {
//   getDoctors: async (params: Pagination): Promise<DoctorsList> => {
//     const { data } = await serviceClient.get('/doctors', { params });
//     return data;
//   },
// };

export default class ServiceApi {
	static async getTherapists (): Promise<AxiosResponse<any>> {
		const res = await $serviceClient.get<any>('/therapists');
		return res;
	}

	static async getTherapist (id: string): Promise<AxiosResponse<any>> {
		const res = await $serviceClient.get(`/therapists/${id}`);
		return res;
	}
}