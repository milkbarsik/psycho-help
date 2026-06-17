import type { TPollData, TPollOption } from './models';

const baseOptions: TPollOption[] = [
  { id: 'never', label: 'Никогда' },
  { id: 'rarely', label: 'Редко' },
  { id: 'sometimes', label: 'Иногда' },
  { id: 'often', label: 'Часто' },
  { id: 'always', label: 'Почти всегда' },
];

export const mockPollData: TPollData = {
  id: '1',
  slug: 'uroven-stressa-i-trevozhnosti',
  title: 'Уровень стресса и тревожности',
  questions: [
    {
      id: '1',
      title: 'Как часто вы чувствуете напряжение в течение дня?',
      options: baseOptions,
    },
    {
      id: '2',
      title: 'Часто ли вам трудно расслабиться после учёбы или работы?',
      options: baseOptions,
    },
    {
      id: '3',
      title: 'Бывает ли, что стресс мешает вам уснуть?',
      options: baseOptions,
    },
    {
      id: '4',
      title: 'Как часто вы откладываете дела из-за усталости?',
      options: baseOptions,
    },
    {
      id: '5',
      title: 'Часто ли вы испытываете раздражительность без видимой причины?',
      options: baseOptions,
    },
    {
      id: '6',
      title: 'Бывает ли, что вы пропускаете приёмы пищи из-за загруженности?',
      options: baseOptions,
    },
    {
      id: '7',
      title: 'Как часто вы находите время на отдых и хобби?',
      options: baseOptions,
    },
    {
      id: '8',
      title: 'Часто ли вы делитесь своими переживаниями с близкими?',
      options: baseOptions,
    },
    {
      id: '9',
      title: 'Бывает ли, что тревожные мысли мешают сосредоточиться?',
      options: baseOptions,
    },
    {
      id: '10',
      title: 'Как часто вы чувствуете, что успешно справляетесь со стрессом?',
      options: baseOptions,
    },
  ],
};
