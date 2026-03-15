import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsQueries } from '@/entities/news';
import { NewsCard } from '../news-card/news-card';
import { TelegramBanner } from '../telegram-banner/telegram-banner';
import styles from './news-grid.module.css';

export const NewsGrid: React.FC = () => {
  const { data: news, isLoading } = useQuery(newsQueries.list());

  if (isLoading) {
    return <main className={styles.container}>Загрузка...</main>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.grid}>
        {news?.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
      <TelegramBanner />
    </main>
  );
};
