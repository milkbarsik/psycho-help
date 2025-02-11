import { AxiosResponse } from "axios";
import { $serviceClient } from "../service-client";
import { user, regData, authRes } from "../types";


export default class AuthApi {
	static async login (email: string, password: string): Promise<AxiosResponse<authRes>> {
		const res = await $serviceClient.post<authRes>('/users/login', {email, password});
		return res;
	}

	static async registration (data: regData): Promise<AxiosResponse<authRes>> {
		const res = await $serviceClient.post<authRes>('/users/registr', {...data});
		return res;
	}

	static async getUser (): Promise<AxiosResponse<user>> {
		const res = await $serviceClient.get<user>('/users/user');
		return res;
	}
}