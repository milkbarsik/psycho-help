import styles from './Articles.module.scss';
import { articleMocks } from '@/pages/resources-page/entities/articles/mocks.ts';
import { ArticleCard } from '@/pages/resources-page/components';
import { TRANSLATES } from '@/pages/resources-page/consts';

export const Articles = () => {
  const articles = articleMocks;

  return (
    <div className={styles.wrapper}>
      <div className={styles.articleList}>
        {articles.map((item, index) => {
          return (
            <ArticleCard
              ellipseDescription
              title={item.title}
              info={{
                key: item.author,
                value: item.date,
              }}
              description={item.description}
              bottomSlot={<button className={styles.readBtn}>{TRANSLATES.read}</button>}
              hasHorizontalDesktopVersion
              key={`articles-${index}`}
            />
          );
        })}
      </div>
    </div>
  );
};
