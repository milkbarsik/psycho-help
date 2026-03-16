import styles from './news-page.module.css';
import psychologist_and_patient from '@/shared/assets/images/news/psychologist_and_patient.svg';
import { NewsGrid } from '@/pages/news-page/components/news-grid/news-grid.tsx';

const NewsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.wrapper}>
          <div className={styles.description}>
            <div className={styles.content}>
              <h1 className={styles.title}>Новости</h1>
              <p className={styles.subtitle}>
                Здесь вы всегда будете в курсе последних событий, анонсов и изменений в работе нашей
                Службы психологической помощи.
              </p>
            </div>

            <img src={psychologist_and_patient} alt="изображение психолга и пациента" />
          </div>
        </div>
      </div>

      <div className={styles.wrapper}>
        <NewsGrid />
      </div>
    </div>
  );
};

export default NewsPage;
