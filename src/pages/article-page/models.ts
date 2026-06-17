export type TArticlePageData = {
  slug: string;
  date: string;
  author: string;
  title: string;
  content: TArticleContentItem[];
};

export type TArticleContentItem =
  | TArticleTextItem
  | TArticleCover
  | TArticleHeading
  | TArticleBlockItem
  | TArticleListItem;

export type TArticleCover = {
  type: 'image';
  src: string;
  alt: string;
};

export type TArticleTextItem = {
  type: 'p';
  data: string;
};

export type TArticleBlockItem = {
  type: 'block';
  data: (TArticleTextItem | TArticleListItem)[];
};

export type TArticleListItem = {
  type: 'ul' | 'ol';
  items: string[];
};

export type TArticleHeading = {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  data: string;
};
