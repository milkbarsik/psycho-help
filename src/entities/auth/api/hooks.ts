import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ResponseError } from '@/shared/api';
import type { User, RegistrationData, LoginData } from '../types';
import { authApi } from './queries';

export const useLoginMutation = (
  options?: Partial<UseMutationOptions<User, ResponseError, LoginData>>,
) => {
  return useMutation<User, ResponseError, LoginData>({
    mutationFn: authApi.login,
    ...options,
  });
};

export const useRegistrationMutation = (
  options?: Partial<UseMutationOptions<User, ResponseError, RegistrationData>>,
) => {
  return useMutation<User, ResponseError, RegistrationData>({
    mutationFn: authApi.registration,
    ...options,
  });
};

export const useLogoutMutation = (
  options?: Partial<UseMutationOptions<void, ResponseError, void>>,
) => {
  return useMutation<void, ResponseError, void>({
    mutationFn: authApi.logout,
    ...options,
  });
};
