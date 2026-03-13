import React from 'react';
import { NewsCard } from '../news-card/news-card.tsx';
import { TelegramBanner } from '../telegram-banner/telegram-banner.tsx';
import { useNews } from '@/entities/news/api/useNews';
import styles from './news-grid.module.css';

export const NewsGrid: React.FC = () => {
  const { data: news, isError } = useNews();

  if (isError) {
    return <main className={styles.container}>Произошла ошибка при загрузке</main>;
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
