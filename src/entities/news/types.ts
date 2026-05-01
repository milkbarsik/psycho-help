// должно быть
// export interface News {
//   id: string;
//   slug: string;
//   image: string | null;
//   type: NewsType;
//   date: string;
//   title: string;
//   description: string | null;
//   link: string | null;
//   text: string | null;
// }

export type NewsType = 'Анонс мероприятия' | 'Отчет о мероприятии';

// сейчас на моке
export interface News {
  id: string;
  slug: string;
  image?: string;
  type: NewsType;
  date: string;
  title: string;
  description?: string;
  link?: string;
  text?: string;
}

// сейчас на бэке
// export interface News {
//   id: string;
//   title: string;
//   text: string;
//   created_at: string;
// }
