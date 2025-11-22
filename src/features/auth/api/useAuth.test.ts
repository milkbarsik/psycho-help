import { useAuth } from "./useAuth";
import AuthApi from "./auth-api";
import { act } from '@testing-library/react'
import type { User } from "@/shared/api/types";
import {vi, describe, beforeEach, it, expect} from 'vitest';

vi.mock('./auth-api', () => ({
    default: {
        login: vi.fn(),
        registration: vi.fn(),
        getUser: vi.fn(),
        logOut: vi.fn(),
    }
}))

describe('useAuth Store', () => {
    const mockUser: User = {
        id: '1',
        first_name: 'Годжо',
        last_name: 'Сатору',
        phone_number: '+7 999 999 99 99',
        email: 'gojosatoru@juju.com',
        social_media: 'tg',
    }

    beforeEach(() => {
        const {setAuth, setUser} = useAuth.getState();
        setAuth(false);
        setUser(null);
        vi.clearAllMocks();
    })

    it('По умолчанию сбросанные данные', () => {
        const state = useAuth.getState();
        expect(state.isAuth === false);
        expect(state.user).toBeNull()
    });

    it('Исправная работа метода setAuth', () => {
        act(() => {
            useAuth.getState().setAuth(true)
        })

        expect(useAuth.getState().isAuth).toBe(true);
    })

    it('Исправная работа метода setUser', () => {
        act(() => {
            useAuth.getState().setUser(mockUser);
        })

        expect(useAuth.getState().user).toEqual(mockUser);
    })

    it('login() вызывает AuthApi.login и устанавливает пользователя', async () => {
        (AuthApi.login as any).mockResolvedValueOnce({ data: mockUser })
    
        await act(async () => {
          await useAuth.getState().login('darklord@example.com', '666')
        })
    
        const state = useAuth.getState()
        expect(AuthApi.login).toHaveBeenCalledWith('darklord@example.com', '666')
        expect(state.isAuth).toBe(true)
        expect(state.user).toEqual(mockUser)
      })

      it('registration() вызывает AuthApi.register и устанавливает пользователя', async () => {
        (AuthApi.registration as any).mockResolvedValueOnce({data: mockUser})
        
        await act(async () => {
            await useAuth.getState().registration({
                email: mockUser.email,
                role: 'student',
                first_name: mockUser.first_name,
                last_name: mockUser.last_name,
                phone_number: mockUser.last_name,
                password: 'tututututiti'
            })
        })

        const state = useAuth.getState();
        expect(AuthApi.registration).toHaveBeenCalledOnce();
        expect(state.isAuth).toBe(true);
        expect(state.user).toEqual(mockUser)
      })

      it('logout() вызывает AuthApi.logOut и очищает состояние', async () => {
        (AuthApi.logOut as any).mockResolvedValueOnce({data: {}});

        await act(async () => {
            await useAuth.getState().logOut();
        })

        const state = useAuth.getState();
        expect(AuthApi.logOut).toHaveBeenCalledOnce();
        expect(state.isAuth).toBe(false);
        expect(state.user).toBeNull();
      })
})