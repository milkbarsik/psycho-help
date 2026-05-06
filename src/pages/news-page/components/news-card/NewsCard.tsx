import type { News } from '@/entities/news/types';
import link from '@/shared/assets/images/news/link.svg';
import dayjs from '@/shared/lib/dayjs';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
// import Img from '@/shared/ui/img/Img';
// import altPhoto from '@/shared/assets/images/altPhotos/User_Accounts_alt.png';
import styles from './NewsCard.module.scss';

interface Props {
  news: News;
}

export const NewsCard: FC<Props> = ({ news }) => {
  return (
    <Link
      className={styles.link}
      // to={`/news/${news.slug}`}
      to={`/news/${news.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className={styles.card}>
        {/* {news.image && (
        <div className={styles['card__photo-wrapper']}>
          <Img
            className={styles.card__photo}
            photo={`${import.meta.env.VITE_REACT_APP_IMAGE_URL}` + news.image}
            altPhoto={altPhoto}
          />
        </div>
      )} */}
        <div className={styles.card__header}>
          {news.type && <div className={styles.card__type}>{news.type}</div>}
          {/* {news.event_date && (
            <div className={styles.card__event_date}>{dayjs(news.event_date).tz().format('DD.MM.YYYY')}</div>
          )} */}
          {news.date && (
            <div className={styles.card__date}>{dayjs(news.date).tz().format('DD.MM.YYYY')}</div>
          )}
        </div>
        <p className={styles.card__title}>{news.title}</p>
        {/* {news.description && <p className={styles.card__description}>{news.description}</p>} */}
        <img className={styles.card__link} src={link} />
      </div>
    </Link>
  );
};
