import { AxiosError } from 'axios';
import { useState } from 'react';

interface error {
	message: string;
	status: number | undefined;
}

export type UseFetchReturn = {
  isLoading: boolean;
  error: error;
  fetching: () => Promise<void>;
};

export function useFetch(foo: () => Promise<any>): UseFetchReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<error>({message: '', status: undefined});

  const fetching = async () => {
    try {
      setIsLoading(true);
      await foo();
    } catch (e) {
			console.log(e);
      setError(e instanceof (AxiosError || Error)
				?
					{message: e.message, status: e.response?.status}
				:
					{message: 'unknown error', status: undefined});
    } finally {
      setIsLoading(false);
    }
  };

  return { fetching, isLoading, error };
}
