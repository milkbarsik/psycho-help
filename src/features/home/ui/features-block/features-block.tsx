import { FEATURES_OF_WORK } from '@/features/home/config/constants';
import styles from './features-block.module.css';

const FeaturesBlock = () => {
  return (
    <div className={styles.featuresBlock}>
      <div className={styles.container}>
        <div className={styles.item1}>
          <div className={styles.wrapper}>
            <h2>Компетентые психологи</h2>
            <p>Наши специалисты имеют высшее психологическое образование и практический опыт. Мы гарантируем бережную и профессиональную помощь</p>
          </div>
          <a>
            <span>Смотреть всех</span>
          </a>
        </div>
        <div className={styles.item2}>
          <h2>График работы</h2>
          <p>Служба доступна в течение всего года. Приём ведётся в будние дни, кроме официальных праздников</p>
        </div>
        <div className={styles.item3}>
          <h2>Формат консультаций</h2>
          <p>Очная встреча в вузе или дистанционно по телефону, через мессенджеры, Zoom, Skype или e-mail</p>
        </div>
        <div className={styles.item4}>
          <div className="wrapper">
            <h2>Перенос или пропуск <br/>консультации</h2>
            <p>Если встречу нужно перенести, просьба сообщить об этом заранее. Пропуск без предупреждения не допускается</p>
          </div>
          {/* <img src="" alt="" /> */}
          </div>
      </div>
    </div>
  );
};

export default FeaturesBlock;
