import type { TArticle } from '@/pages/resources-page/entities/articles/models.ts';

const baseArticle = {
  title: 'Страх неизвестности или куда пойти после окончания университета?',
  description:
    'Не секрет, что каждому из нас хочется определённости и уверенности в завтрашнем дне. Многие знают, насколько волнительно, когда к концу подходит один этап и начинается другой. Но как справиться со страхом? Куда идти дальше? А главное, как это сделать и с чего же начать?',
  author: 'Сафронова Ольга',
  date: '11.09.25',
};

export const articleMocks: TArticle[] = [
  { id: '1', slug: 'strah-neizvestnosti-posle-universiteta', ...baseArticle },
  { id: '2', slug: 'strah-neizvestnosti-posle-universiteta-2', ...baseArticle },
  { id: '3', slug: 'strah-neizvestnosti-posle-universiteta-3', ...baseArticle },
  { id: '4', slug: 'strah-neizvestnosti-posle-universiteta-4', ...baseArticle },
  { id: '5', slug: 'strah-neizvestnosti-posle-universiteta-5', ...baseArticle },
  { id: '6', slug: 'strah-neizvestnosti-posle-universiteta-6', ...baseArticle },
  { id: '7', slug: 'strah-neizvestnosti-posle-universiteta-7', ...baseArticle },
  { id: '8', slug: 'strah-neizvestnosti-posle-universiteta-8', ...baseArticle },
  { id: '9', slug: 'strah-neizvestnosti-posle-universiteta-9', ...baseArticle },
];
