import newsHero from '@/shared/assets/images/news/news-hero.png';
import styles from './NewsHero.module.scss';

export const NewsHero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.hero__inner}>
        <h2 className={styles.hero__title}>Новости</h2>
        <p className={styles.hero__text}>
          Здесь вы всегда будете в курсе последних событий, анонсов и изменений в работе нашей
          Службы психологической помощи.
        </p>
        <img src={newsHero} className={styles.hero__image} />
      </div>
    </div>
  );
};
