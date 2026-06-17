import type { TTest } from '@/pages/resources-page/entities/tests/models.ts';

const baseTest = {
  title: 'Какие чувства вы подавляете?',
  description:
    'Этот тест поможет понять, какие эмоции вы чаще всего скрываете от себя и окружающих. Узнайте, что таится в глубине вашего подсознания.',
  questionsCount: 10,
  durationMinutes: 5,
  // imageSrc намеренно не задан — имитируем ответ бэка без обложки (фронт подставит заглушку)
};

// questionsCount/durationMinutes намеренно разные — проверяем склонения (1 вопрос, 2 вопроса, 21 вопрос)
export const testMocks: TTest[] = [
  { id: '1', slug: 'kakie-chuvstva-vy-podavlyaete', ...baseTest },
  {
    id: '2',
    slug: 'kakie-chuvstva-vy-podavlyaete-2',
    ...baseTest,
    questionsCount: 1,
    durationMinutes: 1,
  },
  {
    id: '3',
    slug: 'kakie-chuvstva-vy-podavlyaete-3',
    ...baseTest,
    questionsCount: 2,
    durationMinutes: 2,
  },
  {
    id: '4',
    slug: 'kakie-chuvstva-vy-podavlyaete-4',
    ...baseTest,
    questionsCount: 4,
    durationMinutes: 3,
  },
  {
    id: '5',
    slug: 'kakie-chuvstva-vy-podavlyaete-5',
    ...baseTest,
    questionsCount: 21,
    durationMinutes: 15,
  },
  {
    id: '6',
    slug: 'kakie-chuvstva-vy-podavlyaete-6',
    ...baseTest,
    questionsCount: 13,
    durationMinutes: 11,
  },
  {
    id: '7',
    slug: 'kakie-chuvstva-vy-podavlyaete-7',
    ...baseTest,
    questionsCount: 7,
    durationMinutes: 6,
  },
  {
    id: '8',
    slug: 'kakie-chuvstva-vy-podavlyaete-8',
    ...baseTest,
    questionsCount: 8,
    durationMinutes: 4,
  },
  {
    id: '9',
    slug: 'kakie-chuvstva-vy-podavlyaete-9',
    ...baseTest,
    questionsCount: 12,
    durationMinutes: 22,
  },
];
