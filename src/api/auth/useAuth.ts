import { create } from 'zustand';
import AuthApi from './auth-api';
import { AxiosResponse } from 'axios';
import { regData, authRes, user } from '../types';

type Tauth = {
  isAuth: boolean;
  user: user | {};
  setAuth: (value: boolean) => void;
  setUser: (user: user) => void;
  login: (email: string, password: string) => Promise<AxiosResponse<authRes>>;
  registration: (data: regData) => Promise<AxiosResponse<authRes>>;
  getUser: () => Promise<AxiosResponse<user>>;
  logOut: () => Promise<AxiosResponse>;

  returnUser: () => user | {};
}

export const useAuth = create<Tauth>((set, get) => ({
  isAuth: false,
  user: {},
  remember_me: false,

  setAuth: (value: boolean) => set((state) => ({...state, isAuth: value})),

  setUser: (user: user) => set((state) => ({...state, user: {...user}})),

  async login (email: string, password: string): Promise<AxiosResponse<authRes>> {
    const res = await AuthApi.login(email, password);
    set((state) => ({...state, isAuth: true, user: {...res.data}}));
		console.log(res);
    return res;
  },

  async registration (data: regData): Promise<AxiosResponse<authRes>> {
    const res = await AuthApi.registration(data);
    set((state) => ({...state, isAuth: true, user: {...res.data}}));
		console.log(res);
    return res;
  },

  async getUser(): Promise<AxiosResponse<user>> {
    const res = await AuthApi.getUser();
    set((state) => ({...state, isAuth: true, user: {...res.data}}));
		console.log(res);
    return res;
  },

  async logOut():Promise<AxiosResponse> {
    const res = await AuthApi.logOut();
    set(() => ({isAuth: false, user: {} }));
    return res;
  },

  returnUser() {
    return get().user;
  }

}))