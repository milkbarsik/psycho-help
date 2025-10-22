import { REASONS_TO_VISIT } from '@/features/home/config/constants';
import styles from './reasons-block.module.css';

const ReasonsBlock = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Чем психолог может помочь?</h2>
      <div className={styles.grid}>
        {REASONS_TO_VISIT.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt="Иллюстрация" className={styles.image} />
            </div>
            <p className={styles.text}>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReasonsBlock;
