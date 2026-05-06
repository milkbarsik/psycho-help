export type News = {
  id: string;
  slug: string;
  image: string | null;
  type: NewsType | null;
  // event_date: string;
  date: string;
  title: string;
  description: string | null;
  link: string | null;
  text: string | null;
};

export type NewsType = 'Анонс мероприятия' | 'Отчет о мероприятии';
