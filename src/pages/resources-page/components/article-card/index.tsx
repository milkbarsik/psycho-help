import clsx from 'clsx';
import { Button } from '@/shared/ui/button';
import { DEFAULT_ARTICLE_COVER, TRANSLATES } from '@/pages/resources-page/consts';
import { toText } from '@/shared/lib/coerce';
import type { TArticle } from '@/pages/resources-page/entities/articles/models.ts';
import styles from './ArticleCard.module.scss';

type TProps = {
  article: TArticle;
};

// Карточка статьи некликабельная — переход только по кнопке «Читать».
export const ArticleCard = ({ article }: TProps) => {
  const { slug } = article;
  const title = toText(article.title);
  const description = toText(article.description);
  const author = toText(article.author);
  const date = toText(article.date);
  const cover = toText(article.imageSrc) ?? DEFAULT_ARTICLE_COVER;

  return (
    <div className={clsx(styles.wrapper, styles.desktop)} data-testid="article-card">
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={cover} alt={title ?? ''} />
      </div>
      <div className={styles.content}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={clsx(styles.description, styles.ellipse)}>{description}</p>}
        {(author || date) && (
          <div className={styles.info}>
            {author && <p>{author}</p>}
            {date && <p>{date}</p>}
          </div>
        )}
        <div className={styles.bottomSlot}>
          <Button
            variant="secondary"
            to={`/article/${slug}`}
            className={styles.button}
            data-testid="read-article"
          >
            {TRANSLATES.read}
          </Button>
        </div>
      </div>
    </div>
  );
};
