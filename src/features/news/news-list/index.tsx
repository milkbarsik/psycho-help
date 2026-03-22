import type { FC } from 'react';
import { NewsCard } from '../news-card';
import styles from './NewsList.module.scss';
import type { News } from '@/shared/api/types';

interface Props {
  news: News[];
}

const NewsList: FC<Props> = ({ news }) => {
  return (
    <div className={styles.list}>
      {news.map((newsItem) => (
        <NewsCard newsItem={newsItem} key={newsItem.id} />
      ))}
    </div>
  );
};

export default NewsList;
