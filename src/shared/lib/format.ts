// Выбирает форму слова по числу для русского склонения:
// pluralizeRu(1, ['вопрос', 'вопроса', 'вопросов']) → 'вопрос'
// pluralizeRu(2, ...) → 'вопроса', pluralizeRu(5, ...) → 'вопросов'
const pluralizeRu = (count: number, forms: [one: string, few: string, many: string]): string => {
  const [one, few, many] = forms;
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  }
  return many;
};

// С бэка приходит только число — строку с окончанием собираем на фронте
export const formatQuestionsCount = (count: number): string =>
  `${count} ${pluralizeRu(count, ['вопрос', 'вопроса', 'вопросов'])}`;

export const formatDuration = (minutes: number): string =>
  `${minutes} ${pluralizeRu(minutes, ['минута', 'минуты', 'минут'])}`;
