import { REASONS_TO_VISIT } from '@/features/home/config/constants';
import styles from './reasons-block.module.css';

const ReasonsBlock = () => {
  return (
    <div className={styles.grid}>
      {REASONS_TO_VISIT.map((item) => (
        <div key={item.title} className={styles.content}>
          <div className={styles.imageWrapper}>
            <img src={item.image} alt="Иллюстрация с помощью" className={styles.image} />
          </div>
          <h2 className={styles.itemText}>{item.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default ReasonsBlock;
