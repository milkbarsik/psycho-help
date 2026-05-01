import { type QueryObserverOptions, queryOptions } from '@tanstack/react-query';
import { $api } from '@/shared/api/http.ts';
import type { ResponseError } from '@/entities/auth';
import type { News } from '@/entities/news/types';

export const newsItemQueryKey = {
  list: 'newsItem.list',
  bySlug: 'newsItem.bySlug',
};

export const newsItemQueries = {
  list: (options?: Partial<QueryObserverOptions<News[], ResponseError>>) =>
    queryOptions<News[], ResponseError>({
      queryKey: [newsItemQueryKey.list],
      queryFn: async () => (await $api.get('/news')).data,
      ...options,
    }),

  bySlug: (slug: string, options?: Partial<QueryObserverOptions<News, ResponseError>>) =>
    queryOptions<News, ResponseError>({
      queryKey: [newsItemQueryKey.bySlug, slug],
      queryFn: async () => (await $api.get(`/news/${slug}`)).data,
      enabled: !!slug,
      ...options,
    }),
};
