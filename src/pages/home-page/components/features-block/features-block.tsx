import { FEATURES_OF_WORK } from '../../constants';
import styles from './features-block.module.css';

const FeaturesBlock = () => {
  return (
    <div className={styles.featuresBlock}>
      {FEATURES_OF_WORK.map((item) => (
        <div key={item.title} className={styles.featureItem}>
          <div className={styles.contentWrapper}>
            <div>
              <img src={item.image} alt="Иллюстрация особенностей службы" />
            </div>
            <div className={styles.textWrapper}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturesBlock;
