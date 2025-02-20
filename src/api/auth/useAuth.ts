import { create } from 'zustand';
import AuthApi from './auth-api';
import { AxiosResponse } from 'axios';
import { regData, authRes, user } from '../types';

type Tauth = {
	isAuth: boolean;
	email: string;
	setAuth: (value: boolean) => void;
	setUser: (username: string) => void;
	login: (email: string, password: string) => Promise<AxiosResponse<authRes>>;
	registration: (data: regData) => Promise<AxiosResponse<authRes>>;
	getUser: () => Promise<AxiosResponse<user>>;
	logOut: () => void;
}

export const useAuth = create<Tauth>((set) => ({
	isAuth: false,
	email: '',

	setAuth: (value: boolean) => set((state) => ({...state, isAuth: value})),

	setUser: (email: string) => set((state) => ({...state, email: email})),

	async login (email: string, password: string): Promise<AxiosResponse<authRes>> {
		const res = await AuthApi.login(email, password);
		try {
			localStorage.setItem('token', res.data.token);
			set((state) => ({...state, isAuth: true, email: email}));
		} catch(e) {
			console.log(e);
		}
		return res;
	},

	async registration (data: regData): Promise<AxiosResponse<authRes>> {
		const res = await AuthApi.registration(data);
		try {
			localStorage.setItem('token', res.data.token);
			set((state) => ({...state, isAuth: true, email: data.email}));
		} catch (e) {
			console.log(e);
		}
		return res;
	},

	async getUser(): Promise<AxiosResponse<user>> {
		const res = await AuthApi.getUser();
		return res;
  },

  logOut() {
    set((state) => ({ ...state, isAuth: false }));
    localStorage.removeItem('token');
  },

}))