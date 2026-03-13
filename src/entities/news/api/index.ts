import { $api } from '@/shared/api/http';
import type { NewsDto } from '../types';

const MOCK_NEWS: NewsDto[] = [
  {
    id: 1,
    category: 'Анонс мероприятия',
    date: '24.11.2025',
    title: 'Психологи университета приглашают на ПСИХОparty в честь Дня психолога',
  },
  {
    id: 2,
    category: 'Отчет о мероприятии',
    date: '25.11.2025',
    title: 'В университете успешно прошел праздник ПСИХОparty с арт-практиками и чаепитием',
  },
  {
    id: 3,
    category: 'Анонс мероприятия',
    date: '18.04.2025',
    title: 'Психолог Ольга Сафронова проведет мастерскую по профилактике выгорания',
  },
  {
    id: 4,
    category: 'Анонс мероприятия',
    date: '25.12.2025',
    title: 'В Московском Политехе пройдет круглый стол с экспертами',
  },
];

export const getNews = async (): Promise<NewsDto[]> => {
  try {
    const response = await $api.get<NewsDto[]>('/news');
    return response.data;
  } catch (error) {
    console.warn('Backend /news not found, returning MOCK_NEWS:', error);

    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_NEWS), 400);
    });
  }
};
