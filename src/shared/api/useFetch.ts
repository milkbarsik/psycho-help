import { AxiosError } from 'axios';
import { useState } from 'react';

interface FetchError { // Общепринятая конвенция, лучше писать с заглавной буквы
  message: string;
  status: number | undefined; // 
}

export type UseFetchReturn = {
  isLoading: boolean;
  error: FetchError;
  fetching: () => Promise<void>;
};

// Вместо "any" используем дженерик T
// Теперь можно строго типизировать возвращаемое значение функции
export function useFetch<T>(foo: () => Promise<T>): UseFetchReturn { 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetchError>({ message: '', status: undefined });

  const fetching = async () => {
    try {
      setIsLoading(true);
      await foo();
    } catch (e) {
      setError(
        e instanceof (AxiosError || Error)
          ? { message: e.message, status: e.response?.status }
          : { message: 'unknown error', status: undefined },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { fetching, isLoading, error };
}


