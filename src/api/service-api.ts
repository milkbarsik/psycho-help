import { $serviceClient } from './http';
import { AxiosResponse } from 'axios';
import { therapist } from './types';

// export const serviceApi = {
//   getDoctors: async (params: Pagination): Promise<DoctorsList> => {
//     const { data } = await serviceClient.get('/doctors', { params });
//     return data;
//   },
// };

export default class ServiceApi {
  static async getTherapists(): Promise<AxiosResponse<Array<therapist>>> {
    return await $serviceClient.get<Array<therapist>>('/therapists/');
  }

  static async getTherapist(id: string): Promise<AxiosResponse<therapist>> {
    return await $serviceClient.get<therapist>(`/therapists/${id}`);
  }
}
