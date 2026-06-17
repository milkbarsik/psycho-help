import type { TTestData, TTestOption } from './models';

const baseOptions: TTestOption[] = [
  { id: 'yes', label: 'Да' },
  { id: 'no', label: 'Нет' },
  { id: 'unknown', label: 'Не знаю' },
  { id: 'rather-yes', label: 'Больше да, чем нет' },
  { id: 'rather-no', label: 'Больше нет, чем да' },
];

export const mockTestData: TTestData = {
  id: '1',
  slug: 'kakie-chuvstva-vy-podavlyaete',
  title: 'Какие чувства вы подавляете?',
  questions: [
    {
      id: '1',
      title: 'Часто ли вы испытываете тревогу без причины?',
      options: baseOptions,
    },
    {
      id: '2',
      title: 'Воспринимаете ли вы критику близко к сердцу?',
      options: baseOptions,
    },
    {
      id: '3',
      title: 'Легко ли вы засыпаете?',
      options: baseOptions,
    },
    {
      id: '4',
      title: 'Часто ли вы чувствуете усталость?',
      options: baseOptions,
    },
    {
      id: '5',
      title: 'Вам сложно отказывать людям?',
      options: baseOptions,
    },
    {
      id: '6',
      title: 'Вы часто перепроверяете свою работу?',
      options: baseOptions,
    },
    {
      id: '7',
      title: 'Вы часто перепроверяете свою работу 👀?',
      options: baseOptions,
    },
    {
      id: '8',
      title: 'Вы легко адаптируетесь к изменениям?',
      options: baseOptions,
    },
    {
      id: '9',
      title: 'Часто ли вы вспоминаете неприятные ситуации?',
      options: baseOptions,
    },
    {
      id: '10',
      title: 'Вы доверяете своей интуиции?',
      options: baseOptions,
    },
  ],
};
