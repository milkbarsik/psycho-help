import React from 'react';
import styles from './NewsCard.module.css';
import Arrow from '@/shared/assets/images/news/arrow.svg';
import type { NewsDto } from '@/entities/news';

interface Props {
  item: NewsDto;
}

export const NewsCard: React.FC<Props> = ({ item }) => (
  <a href={'#'} className={styles.card}>
    <div className={styles.header}>
      <span className={styles.category}>{item.category}</span>
      <span className={styles.date}>{item.date}</span>
    </div>
    <h3 className={styles.title}>{item.title}</h3>
    <a className={styles.arrowBtn} aria-label="Open">
      <img src={Arrow} alt="Arrow" />
    </a>
  </a>
);
