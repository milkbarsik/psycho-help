import { type QueryObserverOptions, queryOptions } from '@tanstack/react-query';
import { $api } from '@/shared/api/http';
import type { ResponseError } from '@/shared/api';
import type { NewsDto } from '../types';
import { MOCK_NEWS } from '../constants/mock-news';

export const newsQueryKey = {
  list: 'news.list',
  byId: 'news.byId',
};

export const newsQueries = {
  list: (options?: Partial<QueryObserverOptions<NewsDto[], ResponseError>>) =>
    queryOptions<NewsDto[], ResponseError>({
      queryKey: [newsQueryKey.list],
      queryFn: async () => {
        // const { data } = await $api.get<NewsDto[]>('/news/');
        // return data;
        return MOCK_NEWS; 
      },
      ...options,
    }),

  byId: (id: string, options?: Partial<QueryObserverOptions<NewsDto, ResponseError>>) =>
    queryOptions<NewsDto, ResponseError>({
      queryKey: [newsQueryKey.byId, id],
      queryFn: async () => (await $api.get(`/news/${id}/`)).data,
      enabled: !!id,
      ...options,
    }),
};

export const newsApi = {
  create: async (newNews: Omit<NewsDto, 'id'>): Promise<NewsDto> => {
    const { data } = await $api.post<NewsDto>('/news/', newNews);
    return data;
  },

  delete: async (id: number | string): Promise<void> => {
    await $api.delete(`/news/${id}/`);
  },
};
