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
        try {
          const { data } = await $api.get<NewsDto[]>('/news/');
          return data;
        } catch (error) {
          console.warn('Backend /news/ failed, using MOCK_NEWS', error);
          return MOCK_NEWS;
        }
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
