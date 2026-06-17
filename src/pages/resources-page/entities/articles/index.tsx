import styles from './Articles.module.scss';
import { articleMocks } from '@/pages/resources-page/entities/articles/mocks.ts';
import { ArticleCard } from '@/pages/resources-page/components';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

const initialArticles = articleMocks.slice(0, 6);

export const Articles = () => {
  const [articles, setArticles] = useState(initialArticles);

  const handleShowMore = () => setArticles(articleMocks);
  const isShowMoreVisible = articles.length < articleMocks.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.articleList}>
        {articles.map((item) => (
          <ArticleCard key={item.id} article={item} />
        ))}
      </div>
      {isShowMoreVisible && (
        <Button className={styles.showMore} onClick={handleShowMore}>
          Показать ещё
        </Button>
      )}
    </div>
  );
};
