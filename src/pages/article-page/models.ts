export interface IArticlePageData {
  date: string;
  author: string;
  title: string;
  content: TArticleContentItem[];
}

export type TArticleContentItem =
  | IArticleTextItem
  | IArticleCover
  | IArticleHeading
  | IArticleBlockItem
  | IArticleListItem;

export interface IArticleCover {
  type: 'image';
  src: string;
  alt: string;
}

export interface IArticleTextItem {
  type: 'p';
  data: string;
}

export interface IArticleBlockItem {
  type: 'block';
  data: (IArticleTextItem | IArticleListItem)[];
}

export interface IArticleListItem {
  type: 'ul' | 'ol';
  items: string[];
}

export interface IArticleHeading {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  data: string;
}
