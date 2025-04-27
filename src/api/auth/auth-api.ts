import { AxiosResponse } from "axios";
import { $serviceClient } from "../http";
import { User, regData, authRes } from "../types";


export default class AuthApi {
	static async login (email: string, password: string): Promise<AxiosResponse<authRes>> {
		const res = await $serviceClient.post<authRes>('/users/login', {email, password});
		return res;
	}

	static async registration (data: regData): Promise<AxiosResponse<authRes>> {
		const res = await $serviceClient.post<authRes>('/users/register', {...data});
		return res;
	}

	static async getUser (): Promise<AxiosResponse<User>> {
		const res = await $serviceClient.get<User>('/users/user');
		return res;
	}

	static async logOut (): Promise<AxiosResponse> {
		const res = await $serviceClient.post('/users/logout');
		return res;
	}
}