export type News = {
  id: string;
  title: string;
  text: string;
  created_at: string;
};

// должно быть (правки запрошены)
// export type News = {
//   id: string;
//   slug: string;
//   image: string | null;
//   type: NewsType | null;
//   date: string;
//   title: string;
//   description: string | null;
//   link: string | null;
//   text: string | null;
// };

// export type NewsType = 'Анонс мероприятия' | 'Отчет о мероприятии';
