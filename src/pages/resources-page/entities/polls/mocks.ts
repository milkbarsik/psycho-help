import type { TPoll } from '@/pages/resources-page/entities/polls/models.ts';

const basePoll = {
  title: 'Уровень стресса и тревожности',
  description:
    'Этот опрос направлен на изучение того, как люди справляются со стрессом в современном мире. Ваши ответы помогут лучше понять природу стресса и разработать более эффективные методы помощи. Все ответы анонимны и конфиденциальны',
  questionsCount: 10,
  durationMinutes: 5,
  passedCount: 146,
  recommendPercent: 86,
  rating: 4.7,
  // imageSrc намеренно не задан — имитируем ответ бэка без обложки (фронт подставит заглушку)
};

export const pollMocks: TPoll[] = [
  { id: '1', slug: 'uroven-stressa-i-trevozhnosti', ...basePoll },
  {
    id: '2',
    slug: 'uroven-stressa-i-trevozhnosti-2',
    ...basePoll,
    questionsCount: 1,
    durationMinutes: 1,
  },
  {
    id: '3',
    slug: 'uroven-stressa-i-trevozhnosti-3',
    ...basePoll,
    questionsCount: 3,
    durationMinutes: 2,
  },
  {
    id: '4',
    slug: 'uroven-stressa-i-trevozhnosti-4',
    ...basePoll,
    questionsCount: 21,
    durationMinutes: 14,
  },
  // опрос без статистики — её ещё никто не оставил (бэк не присылает stats)
  {
    id: '5',
    slug: 'uroven-stressa-i-trevozhnosti-5',
    ...basePoll,
    passedCount: undefined,
    recommendPercent: undefined,
    rating: undefined,
  },
  {
    id: '6',
    slug: 'uroven-stressa-i-trevozhnosti-6',
    ...basePoll,
    questionsCount: 12,
    durationMinutes: 11,
  },
  {
    id: '7',
    slug: 'uroven-stressa-i-trevozhnosti-7',
    ...basePoll,
    questionsCount: 7,
    durationMinutes: 8,
  },
  {
    id: '8',
    slug: 'uroven-stressa-i-trevozhnosti-8',
    ...basePoll,
    questionsCount: 5,
    durationMinutes: 4,
  },
];
