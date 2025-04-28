import { create } from 'zustand';
import AuthApi from './auth-api';
import { AxiosResponse } from 'axios';
import { regData, authRes, User } from '../types';

type Tauth = {
  isAuth: boolean;
  user: User | null;
  setAuth: (value: boolean) => void;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<AxiosResponse<User>>;
  registration: (data: regData) => Promise<AxiosResponse<User>>;
  getUser: () => Promise<AxiosResponse<User>>;
  logOut: () => Promise<AxiosResponse>;

  returnUser: () => User | null;
};

export const useAuth = create<Tauth>((set, get) => ({
  isAuth: false,
  user: null,
  remember_me: false,

  setAuth: (value: boolean) => set((state) => ({ ...state, isAuth: value })),

  setUser: (user: User) => set((state) => ({ ...state, user: { ...user } })),

  async login(email: string, password: string): Promise<AxiosResponse<User>> {
    const res = await AuthApi.login(email, password);
    set((state) => ({ ...state, isAuth: true, user: { ...res.data } }));
    console.log(res);
    return res;
  },

  async registration(data: regData): Promise<AxiosResponse<User>> {
    const res = await AuthApi.registration(data);
    set((state) => ({ ...state, isAuth: true, user: { ...res.data } }));
    console.log(res);
    return res;
  },

  async getUser(): Promise<AxiosResponse<User>> {
    const res = await AuthApi.getUser();
    set((state) => ({ ...state, isAuth: true, user: { ...res.data } }));
    console.log(res);
    return res;
  },

  async logOut(): Promise<AxiosResponse> {
    const res = await AuthApi.logOut();
    set(() => ({ isAuth: false, user: null }));
    return res;
  },

  returnUser() {
    return get().user;
  },
}));
