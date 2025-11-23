import styles from './Articles.module.scss';
import { articleMocks } from '@/pages/resources-page/entities/articles/mocks.ts';
import { ArticleCard } from '@/pages/resources-page/components';
import { TRANSLATES } from '@/pages/resources-page/consts';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

const initialArticles = articleMocks.slice(0, 5);

export const Articles = () => {
  const [articles, setArticles] = useState(initialArticles);

  const handleShowMore = () => {
    setArticles(articleMocks);
  }

  const isShowMoreVisible = articles.length < articleMocks.length;

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

      {isShowMoreVisible && <Button className={styles.showMore} onClick={handleShowMore}>Показать ещё</Button>}
    </div>
  );
};
