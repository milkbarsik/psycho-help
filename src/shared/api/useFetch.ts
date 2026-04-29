import { AxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';
import type { ResponseError } from '@/entities/auth';

export type UseFetchReturn = {
  isLoading: boolean;
  error: ResponseError;
  fetching: () => Promise<void>;
};

// Вместо "any" используем дженерик T
// Теперь можно строго типизировать возвращаемое значение функции
export function useFetch<T>(foo: () => Promise<T>): UseFetchReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ResponseError>({ message: '', status: undefined });

  const fooRef = useRef(foo);
  fooRef.current = foo;

  const fetching = useCallback(async () => {
    try {
      setIsLoading(true);
      await fooRef.current();
      setError({ message: '', status: undefined });
    } catch (e) {
      if (e instanceof AxiosError) {
        setError({ message: e.message, status: e.response?.status });
      } else if (e instanceof Error) {
        setError({ message: e.message, status: undefined });
      } else {
        setError({ message: 'unknown error', status: undefined });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetching, isLoading, error };
}
