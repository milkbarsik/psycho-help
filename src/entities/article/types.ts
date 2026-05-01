// должно быть
// export interface Article {
//   id: string;
//   slug: string;
//   image: string | null;
//   date: string | null;
//   author: string | null;
//   title: string;
//   description: string | null;
//   text: string;
// }

// сейчас на бэке
export interface Article {
  id: string;
  title: string;
  text: string;
}
