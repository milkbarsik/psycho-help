export type TArticle = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  imageSrc?: string | null;
  author?: string | null;
  date?: string | null;
};
