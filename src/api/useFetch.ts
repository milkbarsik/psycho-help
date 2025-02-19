import { useState } from 'react';

export type UseFetchReturn = {
  isLoading: boolean;
  error: string | null;
  fetching: () => Promise<void>;
};

export function useFetch(foo: () => Promise<any>): UseFetchReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetching = async () => {
    try {
      setIsLoading(true);
      await foo();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return { fetching, isLoading, error };
}
