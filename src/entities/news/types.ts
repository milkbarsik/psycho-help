export interface News {
  id: string;
  slug: string;
  image?: string;
  type: 'Анонс мероприятия' | 'Отчет о мероприятии';
  date: string;
  title: string;
  description?: string;
  link?: string;
  text?: string;
}
