import { useQuery } from '@tanstack/react-query';
import { getNews } from './index';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: getNews,
    retry: 1, 
  });
};
