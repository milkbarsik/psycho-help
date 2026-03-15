import { useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from './index';
import { newsQueryKey } from './index';

export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: newsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [newsQueryKey.list] });
    },
  });
};
