import { create } from 'zustand';
import AuthApi from './auth-api';
import { AxiosResponse } from 'axios';
import { regData, authRes, User } from '../types';

type Tauth = {
	isAuth: boolean;
	email: string;
	setAuth: (value: boolean) => void;
	setUser: (username: string) => void;
	login: (email: string, password: string) => Promise<AxiosResponse<authRes>>;
	registration: (data: regData) => Promise<AxiosResponse<authRes>>;
	getUser: () => Promise<AxiosResponse<User>>;
	logOut: () => Promise<AxiosResponse>;
}

export const useAuth = create<Tauth>((set) => ({
	isAuth: false,
	email: '',
	remember_me: false,

	setAuth: (value: boolean) => set((state) => ({...state, isAuth: value})),

	setUser: (email: string) => set((state) => ({...state, email: email})),

	async login (email: string, password: string): Promise<AxiosResponse<authRes>> {
		const res = await AuthApi.login(email, password);
		set((state) => ({...state, isAuth: true, email: email}));
		return res;
	},

	async registration (data: regData): Promise<AxiosResponse<authRes>> {
		const res = await AuthApi.registration(data);
		set((state) => ({...state, isAuth: true, email: data.email}));
		return res;
	},

	async getUser(): Promise<AxiosResponse<User>> {
		const res = await AuthApi.getUser();
		set((state) => ({...state, isAuth: true, email: res.data.email}));
		return res;
  },

  async logOut():Promise<AxiosResponse> {
		const res = await AuthApi.logOut();
		set(() => ({isAuth: false, email: '' }));
		return res;
  },

}))